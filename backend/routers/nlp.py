from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import logging

from ml.nlp.llm_advisor import (
    ask_advisor,
    extract_farm_parameters,
    explain_prediction_naturally,
    parse_soil_health_card,
    chat_multi_turn,
    generate_planting_advice,
)
from ml.nlp.config import SUPPORTED_LANGUAGES, NLP_CONFIG

router = APIRouter(prefix="/api/nlp", tags=["NLP Advisor"])
logger = logging.getLogger(__name__)


class AskRequest(BaseModel):
    text: str = Field(..., min_length=2, max_length=1000)
    farm_id: Optional[str] = None
    language: str = "english"
    farm_context: Optional[dict] = None

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1)

class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1)
    farm_context: Optional[dict] = None

class ExtractRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=2000)

class ExplainRequest(BaseModel):
    prediction: dict
    farm_context: dict
    language: str = "english"

class SoilCardRequest(BaseModel):
    card_text: str = Field(..., min_length=10, max_length=5000)

class PlantingAdviceRequest(BaseModel):
    preset_name: str = Field(..., min_length=2)
    farm_context: dict
    language: str = "english"


@router.get("/health")
async def nlp_health():
    return {
        "nlp_enabled": NLP_CONFIG["enabled"],
        "api_key_configured": bool(NLP_CONFIG["api_key"]),
        "model": NLP_CONFIG["model"],
        "supported_languages": list(SUPPORTED_LANGUAGES.keys()),
        "status": "ready" if NLP_CONFIG["api_key"] else "fallback_mode"
    }

@router.post("/ask")
async def ask_question(request: AskRequest):
    result = ask_advisor(
        question=request.text,
        farm_context=request.farm_context,
        language=request.language
    )
    return result

@router.post("/chat")
async def chat(request: ChatRequest):
    messages = [
        {"role": m.role, "content": m.content}
        for m in request.messages
    ]
    result = chat_multi_turn(
        messages=messages,
        farm_context=request.farm_context
    )
    return result

@router.post("/extract-parameters")
async def extract_parameters(request: ExtractRequest):
    params = extract_farm_parameters(request.text)
    return {
        "parameters": params,
        "ready_for_designer": bool(
            params.get("region") and params.get("soil_type")
        )
    }

@router.post("/explain-prediction")
async def explain_prediction(request: ExplainRequest):
    explanation = explain_prediction_naturally(
        prediction=request.prediction,
        farm_context=request.farm_context,
        language=request.language
    )
    return {
        "explanation": explanation,
        "language": request.language
    }

@router.post("/parse-soil-card")
async def parse_soil_card(request: SoilCardRequest):
    params = parse_soil_health_card(request.card_text)
    if not params:
        raise HTTPException(
            status_code=422,
            detail=(
                "Could not extract soil parameters. "
                "Please check the text and try again."
            )
        )
    return {
        "soil_parameters": params,
        "ready_for_designer": bool(params.get("pH"))
    }

@router.post("/planting-advice")
async def planting_advice(request: PlantingAdviceRequest):
    advice = generate_planting_advice(
        preset_name=request.preset_name,
        farm_context=request.farm_context,
        language=request.language
    )
    return {
        "advice": advice,
        "preset_name": request.preset_name,
        "language": request.language
    }

@router.get("/languages")
async def get_languages():
    return {"languages": SUPPORTED_LANGUAGES}
