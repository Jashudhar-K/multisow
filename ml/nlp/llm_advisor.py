import os
import json
import logging
from typing import Optional
from anthropic import Anthropic, APIError, APIConnectionError
from ml.nlp.config import NLP_CONFIG, FARM_ADVISOR_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


def _get_client() -> Optional[Anthropic]:
    """
    Returns configured Anthropic client.
    Returns None if API key is missing or NLP is disabled.
    Caller must handle None — never raise, always fallback.
    """
    if not NLP_CONFIG["api_key"]:
        logger.warning(
            "ANTHROPIC_API_KEY not set — NLP using rule-based fallback"
        )
        return None
    if not NLP_CONFIG["enabled"]:
        logger.info("NLP disabled via NLP_ENABLED=false")
        return None
    try:
        return Anthropic(api_key=NLP_CONFIG["api_key"])
    except Exception as e:
        logger.error(f"Failed to create Anthropic client: {e}")
        return None


def ask_advisor(
    question: str,
    farm_context: Optional[dict] = None,
    language: str = "english"
) -> dict:
    """
    Answer a single farmer question using Claude.
    Always returns a valid dict — never raises.
    Falls back to rule-based answer if API unavailable.

    Returns:
        {
            "answer": str,
            "source": "claude" | "rule-based" | "fallback",
            "language": str,
            "tokens_used": int (optional)
        }
    """
    client = _get_client()

    context_block = ""
    if farm_context:
        context_block = f"""
Current farm profile:
- Region: {farm_context.get('region', 'Not specified')}
- Soil type: {farm_context.get('soil_type', 'Not specified')}
- Crops: {', '.join(farm_context.get('crops', [])) or 'Not specified'}
- Farm size: {farm_context.get('area_acres', 'Not specified')} acres
- Irrigation: {farm_context.get('irrigation_type', 'Not specified')}
- Season: {farm_context.get('season', 'Not specified')}
        """

    if not client:
        return {
            "answer": _rule_based_answer(question),
            "source": "rule-based",
            "language": language
        }

    try:
        response = client.messages.create(
            model=NLP_CONFIG["model"],
            max_tokens=NLP_CONFIG["max_tokens"],
            system=FARM_ADVISOR_SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": f"{context_block}\n\nFarmer question: {question}"
            }]
        )
        return {
            "answer": response.content[0].text,
            "source": "claude",
            "language": language,
            "tokens_used": response.usage.output_tokens
        }

    except (APIError, APIConnectionError) as e:
        logger.error(f"Anthropic API error in ask_advisor: {e}")
        return {
            "answer": _rule_based_answer(question),
            "source": "fallback",
            "language": language,
            "error": str(e)
        }
    except Exception as e:
        logger.error(f"Unexpected error in ask_advisor: {e}")
        return {
            "answer": _rule_based_answer(question),
            "source": "fallback",
            "language": language
        }


def extract_farm_parameters(natural_text: str) -> dict:
    """
    Convert natural language farm description into structured
    parameters ready for FOHEM prediction and designer auto-fill.

    Example input:
        "2 acres laterite soil in Wayanad, rain-fed coconut farm"
    Example output:
        {"region": "kerala", "soil_type": "laterite",
         "area_acres": 2, "crops": ["coconut"],
         "irrigation_type": "rain-fed"}

    Returns empty dict on any failure — never raises.
    """
    client = _get_client()

    if not client:
        return {}

    EXTRACT_SYSTEM = """
    Extract farm parameters from the farmer's text.
    Return ONLY valid JSON. No explanation. No markdown. No backticks.
    Keys to extract (use null if not mentioned):
    {
      "region": one of [kerala, karnataka, tamil_nadu,
                        andhra, maharashtra, null],
      "soil_type": one of [laterite, red, alluvial,
                           black, mountain, null],
      "area_acres": number or null,
      "crops": list of crop name strings or [],
      "irrigation_type": one of [drip, flood, rain-fed, null],
      "season": one of [kharif, rabi, zaid, null],
      "goal": one of [income, subsistence, organic,
                      export, mixed, null],
      "problems": list of problem strings or []
    }
    """

    try:
        response = client.messages.create(
            model=NLP_CONFIG["model"],
            max_tokens=300,
            system=EXTRACT_SYSTEM,
            messages=[{"role": "user", "content": natural_text}]
        )
        raw = response.content[0].text.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in extract_farm_parameters: {e}")
        return {}
    except Exception as e:
        logger.error(f"Error in extract_farm_parameters: {e}")
        return {}


def explain_prediction_naturally(
    prediction: dict,
    farm_context: dict,
    language: str = "english"
) -> str:
    """
    Convert FOHEM ML prediction numbers into plain farmer-friendly
    explanation in the requested language.

    Always returns a non-empty string — never raises.
    Falls back to template explanation if API unavailable.
    """
    client = _get_client()

    if not client:
        return _fallback_prediction_explanation(prediction)

    EXPLAIN_SYSTEM = f"""
    You are explaining AI crop yield predictions to an Indian farmer.
    Respond entirely in {language}.
    Use simple, warm, encouraging language.
    Format: exactly 2 short paragraphs.
    First paragraph: what the numbers mean in practical terms
      for this farmer. Use rupees and kilograms, not t/ha.
    Second paragraph: one specific action they can take
      to improve their results next season.
    Never use terms like FOHEM, R-squared, LER, t/ha
      without explaining them in simple words first.
    """

    content = f"""
    Farm details:
    Region: {farm_context.get('region', 'India')}
    Soil: {farm_context.get('soil_type', 'unknown')} soil
    Crops: {farm_context.get('crops', 'intercrop system')}

    AI predicted results:
    - Top canopy layer yield (coconut/teak type crops):
      {prediction.get('yield_canopy_t_ha', 'N/A')} tonnes per hectare
    - Middle layer yield (banana/cocoa type crops):
      {prediction.get('yield_middle_t_ha', 'N/A')} tonnes per hectare
    - Ground layer yield (ginger/turmeric type crops):
      {prediction.get('yield_understory_t_ha', 'N/A')} tonnes per hectare
    - Land productivity ratio (LER):
      {prediction.get('LER', 'N/A')}
      (a number above 1.0 means intercropping beats single-crop farming)
    - Estimated monthly revenue:
      ₹{prediction.get('revenue_estimate_inr', 'N/A')}
    - Key factors affecting yield:
      {prediction.get('shap_features', [])}

    Write a clear explanation for this farmer.
    """

    try:
        response = client.messages.create(
            model=NLP_CONFIG["model"],
            max_tokens=350,
            system=EXPLAIN_SYSTEM,
            messages=[{"role": "user", "content": content}]
        )
        return response.content[0].text

    except Exception as e:
        logger.error(f"Error in explain_prediction_naturally: {e}")
        return _fallback_prediction_explanation(prediction)


def parse_soil_health_card(card_text: str) -> dict:
    """
    Parse Indian government soil health card text into
    structured soil parameters for designer auto-fill.

    Returns empty dict on failure — never raises.
    """
    client = _get_client()

    if not client:
        return {}

    SOIL_SYSTEM = """
    Extract soil test values from Indian soil health card text.
    Return ONLY valid JSON. No explanation. No markdown. No backticks.
    Use null for any value not found in the text.
    {
      "N_kg_ha": number or null,
      "P_kg_ha": number or null,
      "K_kg_ha": number or null,
      "pH": number or null,
      "OC_percent": number or null,
      "EC_dS_m": number or null,
      "soil_texture": string or null,
      "deficiencies": list of strings or [],
      "recommendations": list of strings or []
    }
    """

    try:
        response = client.messages.create(
            model=NLP_CONFIG["model"],
            max_tokens=400,
            system=SOIL_SYSTEM,
            messages=[{"role": "user", "content": card_text}]
        )
        raw = response.content[0].text.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in parse_soil_health_card: {e}")
        return {}
    except Exception as e:
        logger.error(f"Error in parse_soil_health_card: {e}")
        return {}


def chat_multi_turn(
    messages: list[dict],
    farm_context: Optional[dict] = None
) -> dict:
    """
    Multi-turn conversation for the chat widget.
    messages format: [{"role": "user"|"assistant", "content": str}]

    Always returns valid dict — never raises.
    """
    client = _get_client()

    context_block = ""
    if farm_context:
        crops = farm_context.get('crops', [])
        crops_str = ', '.join(crops) if crops else 'Not set'
        context_block = f"""
Active farm context:
Region: {farm_context.get('region', 'Not set')} |
Soil: {farm_context.get('soil_type', 'Not set')} |
Crops: {crops_str} |
Area: {farm_context.get('area_acres', 'Not set')} acres
        """

    system = FARM_ADVISOR_SYSTEM_PROMPT
    if context_block:
        system = system + f"\n\n{context_block}"

    if not client:
        last_user_msg = next(
            (m["content"] for m in reversed(messages)
             if m.get("role") == "user"),
            ""
        )
        return {
            "response": _rule_based_answer(last_user_msg),
            "source": "rule-based"
        }

    try:
        response = client.messages.create(
            model=NLP_CONFIG["model"],
            max_tokens=NLP_CONFIG["max_tokens"],
            system=system,
            messages=messages
        )
        return {
            "response": response.content[0].text,
            "source": "claude",
            "tokens_used": response.usage.output_tokens
        }

    except (APIError, APIConnectionError) as e:
        logger.error(f"Anthropic API error in chat_multi_turn: {e}")
        last_user_msg = next(
            (m["content"] for m in reversed(messages)
             if m.get("role") == "user"),
            ""
        )
        return {
            "response": _rule_based_answer(last_user_msg),
            "source": "fallback",
            "error": str(e)
        }
    except Exception as e:
        logger.error(f"Unexpected error in chat_multi_turn: {e}")
        return {
            "response": (
                "I am having trouble connecting right now. "
                "Please try again in a moment."
            ),
            "source": "error"
        }


def generate_planting_advice(
    preset_name: str,
    farm_context: dict,
    language: str = "english"
) -> str:
    """
    Generate specific planting advice for a chosen preset model.
    Used in the planting guide panel of the designer.
    Always returns a string — never raises.
    """
    client = _get_client()

    if not client:
        return (
            f"For the {preset_name} model, follow the standard "
            f"planting guide available in the MultiSow designer. "
            f"Enable AI Advisor for personalised recommendations."
        )

    ADVICE_SYSTEM = f"""
    You are giving specific planting advice to an Indian farmer
    who has chosen a multi-tier intercropping preset model.
    Respond in {language}.
    Be specific, practical, and encouraging.
    Format as 3 short bullet points.
    Each bullet: one clear, actionable instruction.
    Base advice on the farm's specific soil and region.
    """

    content = f"""
    Chosen model: {preset_name}
    Farm region: {farm_context.get('region', 'India')}
    Soil type: {farm_context.get('soil_type', 'unknown')}
    Farm size: {farm_context.get('area_acres', 'unknown')} acres
    Irrigation: {farm_context.get('irrigation_type', 'unknown')}
    Season: {farm_context.get('season', 'unknown')}

    Give 3 specific planting tips for this farmer
    starting this model on their farm.
    """

    try:
        response = client.messages.create(
            model=NLP_CONFIG["model"],
            max_tokens=250,
            system=ADVICE_SYSTEM,
            messages=[{"role": "user", "content": content}]
        )
        return response.content[0].text

    except Exception as e:
        logger.error(f"Error in generate_planting_advice: {e}")
        return (
            f"For {preset_name}: start with soil preparation "
            f"2 weeks before planting. Plant canopy crops first, "
            f"then middle tier after 2 weeks. Add understory crops "
            f"once canopy is established."
        )


# ── Rule-based fallbacks (zero dependencies, always work) ─────────

def _rule_based_answer(question: str) -> str:
    """
    Keyword-based fallback used when Anthropic API is unavailable.
    Covers the most common farmer questions.
    Always returns a helpful, non-empty string.
    """
    if not question:
        return (
            "Welcome to MultiSow! You can ask me about crop selection, "
            "soil types, spacing, irrigation, fertilizers, and harvest "
            "timing. How can I help your farm today?"
        )

    q = question.lower()

    if any(w in q for w in ["yellow", "brown", "wilt",
                              "disease", "pest", "insect", "rot"]):
        return (
            "For yellowing, wilting or disease symptoms: check soil pH "
            "(ideal 5.5-6.5), ensure good drainage, and remove affected "
            "plant parts immediately. Apply neem oil spray (5ml per litre) "
            "as a first response. Contact your local KVK agricultural "
            "officer for accurate diagnosis. MultiSow Research Hub has "
            "detailed pest management guides for all major crops."
        )

    if any(w in q for w in ["fertilizer", "fertiliser", "manure",
                              "npk", "nutrient", "urea", "compost"]):
        return (
            "General fertilizer recommendation: apply well-decomposed "
            "FYM at 10kg per plant before monsoon onset. For NPK, always "
            "follow your soil test card values. Intercropping systems need "
            "15-20% more nutrients than monocrops due to higher biomass. "
            "MultiSow planting guides have crop-specific schedules with "
            "exact quantities and timing."
        )

    if any(w in q for w in ["water", "irrigat", "drought",
                              "rain", "moisture", "dry"]):
        return (
            "Drip irrigation saves 40-60% water compared to flood. "
            "Multi-tier intercropping naturally reduces water needs by "
            "up to 30% through canopy shade and mulching effect. "
            "Coconut needs 45 litres per day in peak summer. "
            "Banana needs 25-30mm per week. "
            "Use organic mulch between rows to retain soil moisture."
        )

    if any(w in q for w in ["spacing", "distance", "row",
                              "plant", "gap", "density"]):
        return (
            "Standard intercropping spacing: "
            "Coconut: 7.5m x 7.5m (triangular pattern recommended). "
            "Banana in alleys: 3m x 3m. "
            "Pepper on coconut stems: 1 vine per tree. "
            "Ginger rows: 25cm x 30cm between plants. "
            "Use MultiSow Designer for exact spacing calculated for "
            "your specific farm size and crop combination."
        )

    if any(w in q for w in ["harvest", "when", "ready",
                              "mature", "pick", "yield"]):
        return (
            "Harvest timing guide: "
            "Ginger: 8-9 months after planting (leaves turn yellow). "
            "Turmeric: 9-10 months (leaves dry and fall). "
            "Banana: 12-15 months from planting. "
            "Pepper: berries turn orange-red, harvest before fully red. "
            "Coconut: year-round after year 5-7, every 45 days. "
            "Check MultiSow planting guides for your specific preset model."
        )

    if any(w in q for w in ["soil", "ph", "laterite", "alluvial",
                              "black", "red soil", "clay"]):
        return (
            "Soil guidance for intercropping: "
            "Laterite (Kerala/Karnataka): ideal for coconut+pepper+ginger. "
            "Red soil: suits coffee+cardamom+silver oak combination. "
            "Alluvial: excellent for banana+turmeric+mango systems. "
            "Black soil: good for cotton-based intercrops. "
            "Maintain pH 5.5-6.5 for most Indian intercropping systems. "
            "Use MultiSow strata designer to see soil-specific crop recommendations."
        )

    if any(w in q for w in ["income", "revenue", "profit",
                              "money", "earn", "rupee", "cost"]):
        return (
            "Income potential from multi-tier intercropping: "
            "Wayanad Classic (coconut+pepper+ginger): ₹80,000-1,20,000 "
            "per acre per year from year 3 onwards. "
            "Karnataka Spice Garden: ₹60,000-90,000 per acre. "
            "First 2 years have lower income while canopy establishes. "
            "Ginger and turmeric provide early cash flow from year 1. "
            "Use MultiSow dashboard for detailed revenue projections."
        )

    if any(w in q for w in ["preset", "model", "wayanad", "kerala",
                              "karnataka", "tamil", "andhra",
                              "maharashtra", "combination"]):
        return (
            "MultiSow has 6 research-backed regional preset models: "
            "1. Wayanad Classic (Kerala) - Coconut+Pepper+Ginger "
            "2. Karnataka Spice Garden - Coffee+Cardamom+Silver Oak "
            "3. Tamil Nadu Tropical - Coconut+Banana+Turmeric "
            "4. Andhra Commercial - Mango+Banana+Groundnut "
            "5. Maharashtra Konkan - Coconut+Mango+Cashew "
            "6. Cocoa Premium - Coconut+Cocoa+Pepper+Spices "
            "Select any preset in the MultiSow designer to see full "
            "planting guide and 3D visualization."
        )

    # Default helpful response
    return (
        "Thank you for your question. For the most accurate personalised "
        "advice, the AI Advisor needs an API key to be configured. "
        "Meanwhile: check the MultiSow Research Hub for crop guides, "
        "use the Strata Designer to plan your layout, and view regional "
        "Preset Models for proven intercropping combinations in your area. "
        "You can also contact your nearest KVK (Krishi Vigyan Kendra) "
        "for free local agricultural advice."
    )


def _fallback_prediction_explanation(prediction: dict) -> str:
    """
    Template-based explanation when Claude API is unavailable.
    Uses prediction values to generate a readable summary.
    """
    ler = float(prediction.get("LER", 1.0) or 1.0)
    canopy = float(prediction.get("yield_canopy_t_ha", 0) or 0)
    middle = float(prediction.get("yield_middle_t_ha", 0) or 0)
    revenue = prediction.get("revenue_estimate_inr", None)

    if ler >= 1.5:
        quality = "excellent"
        action = (
            "Your farm layout is well-optimised. Focus on soil health "
            "maintenance — apply compost before next monsoon season."
        )
    elif ler >= 1.2:
        quality = "good"
        action = (
            "Consider reducing root zone competition by maintaining "
            "minimum 1.5m clearance between canopy and understory plants."
        )
    else:
        quality = "fair"
        action = (
            "Review your crop spacing — the plants may be competing for "
            "nutrients. Try the Wayanad Classic preset for a proven layout."
        )

    revenue_text = (
        f"Estimated monthly revenue: ₹{revenue:,}. "
        if revenue else ""
    )

    return (
        f"Your intercropping system shows {quality} productivity. "
        f"The land productivity ratio of {ler:.2f} means your farm "
        f"produces {ler:.1f}x more total output than growing a single "
        f"crop alone would. "
        f"Top layer crops are predicted at {canopy:.1f} tonnes per "
        f"hectare, and middle tier at {middle:.1f} tonnes per hectare. "
        f"{revenue_text}"
        f"{action} "
        f"Enable the AI Advisor with your API key for detailed "
        f"personalised recommendations in your preferred language."
    )
