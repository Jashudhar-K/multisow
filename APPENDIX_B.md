APPENDIX B: IMPLEMENTATION DETAILS

---

### Appendix B.1 – FastAPI Application Setup

Snippet (from `backend/main.py`):

```python
app = FastAPI(
    title="Multi-Tier Crop Management System",
    description="AI-enhanced platform for multi-tier intercropping optimization",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get("CORS_ORIGINS","http://localhost:3001,http://localhost:3000").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if HAS_ML:
    for ml_router in all_ml_routers:
        app.include_router(ml_router)

app.include_router(nlp_router.router)
app.include_router(crop_recommender_router.router)
app.include_router(crop_library_router.router)
```

Short explanation:
- App creation, lifespan and CORS middleware configuration are shown.
- Conditional ML router mounting and registration of core routers are demonstrated.

---

### Appendix B.2 – Crop Prediction API Endpoint

Snippet (from `backend/routers/crop_recommender_router.py`):

```python
@router.post("/predict", response_model=CropRecommendResponse, summary="Recommend a crop")
def predict_crop(body: CropRecommendRequest) -> CropRecommendResponse:
    try:
        from multisow.ml.inference.crop_recommender import recommend_crop

        result = recommend_crop(
            N=body.n,
            P=body.p,
            K=body.k,
            temperature=body.temperature,
            humidity=body.humidity,
            ph=body.ph,
            rainfall=body.rainfall,
        )
        return CropRecommendResponse(**result)

    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Crop recommender model is not available.") from exc
```

Short explanation:
- `POST /api/crop-recommender/predict` accepts seven soil/climate inputs and returns a typed prediction.
- Uses deferred artefact import and returns 503 when model artefacts are missing.

---

### Appendix B.3 – Yield Prediction API Endpoint

Snippet (from `multisow/ml/routers/ml_routes.py`):

```python
@ml_predict_router.post("/predict", response_model=YieldPredictionResponse)
async def predict(body: StrataInput) -> YieldPredictionResponse:
    prediction_id = str(uuid.uuid4())
    layers_result: Dict[str, LayerPrediction] = {}

    for layer_input in body.layers:
        layer_key = layer_input.layer.value
        if _fohem_system is not None and getattr(_fohem_system, "is_any_trained", lambda: False)():
            try:
                feat = _build_feature_vector(layer_input)
                pred = _fohem_system.predict(feat.to_frame().T, layer=layer_key)
                layers_result[layer_key] = LayerPrediction(
                    predicted_yield_t_ha=float(pred.get("yield_t_ha", 0.0)),
                    ci_80_low=float(pred.get("ci_low", 0.0)),
                    ci_80_high=float(pred.get("ci_high", 0.0)),
                    top_shap_features=pred.get("shap_features", []),
                    fis_stress_scores=pred.get("fis_scores", {}),
                    weights_used=pred.get("weights", [0.25, 0.30, 0.25, 0.20]),
                )
            except Exception:
                layers_result[layer_key] = _heuristic_predict(layer_input)
        else:
            layers_result[layer_key] = _heuristic_predict(layer_input)
```

Short explanation:
- Per-layer inference loop: uses FOHEM ensemble when trained, otherwise falls back to a physics-guided heuristic.
- Returns per-layer structured `LayerPrediction` objects with yield, CI, SHAP-like features and FIS scores.

---

### Appendix B.4 – Machine Learning Prediction Function

Snippet (from `multisow/ml/inference/crop_recommender.py`):

```python
def _load_artefacts() -> tuple:
    global _model, _scaler
    if _model is None or _scaler is None:
        missing = [p for p in (MODEL_PATH, SCALER_PATH) if not p.exists()]
        if missing:
            raise RuntimeError("Crop recommender model artefacts not found.")
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
    return _model, _scaler


def recommend_crop(N, P, K, temperature, humidity, ph, rainfall) -> dict:
    model, scaler = _load_artefacts()
    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]], dtype=float)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    confidence = float(np.max(model.predict_proba(features_scaled)[0])) if hasattr(model, "predict_proba") else None
    return {"recommended_crop": str(prediction), "confidence": confidence, "input_features": {"N": N, "P": P, "K": K}}
```

Short explanation:
- Lazy-loading artefacts, feature scaling and model prediction for the crop recommender.
- Returns predicted label, optional confidence and echo of input features; training code omitted.

---

### Appendix B.5 – FOHEM Model Implementation

Snippet (from `multisow/ml/models/fohem.py`):

```python
def predict(self, X: pd.DataFrame) -> np.ndarray:
    if not self.is_trained:
        raise RuntimeError(f"FOHEM[{self.layer.value}] not trained")

    X_sel = X[self.selected_features].copy()
    fis_scores = self.fis.infer_batch(X)
    X_aug = pd.concat([X_sel.reset_index(drop=True), fis_scores[["aggregate_stress_score"]].reset_index(drop=True)], axis=1)

    fis_proxy = (1.0 - fis_scores["aggregate_stress_score"].values / 10.0) * self._y_train_mean
    rf_p = self.rf.predict(X_aug)
    cb_p = self.catboost.predict(X_aug)
    elm_p = self.elm.predict(X_aug.values)

    w = self.weights
    result = w[0] * fis_proxy + w[1] * rf_p + w[2] * cb_p + w[3] * elm_p
    return np.maximum(0, result)
```

Short explanation:
- FOHEM combines FIS-derived proxy and sub-model predictions using GA-optimised weights.
- Returns non-negative ensemble yield predictions for a layer.

---

### Appendix B.6 – NSGA-II Optimization Algorithm

1) Population initialization (excerpt from `multisow/ml/models/strata_optimizer.py`):

```python
def _initialize_population(self, fixed_crops: Optional[Dict[StrataLayer, str]] = None) -> List[StrataConfiguration]:
    population = []
    for _ in range(self.pop_size):
        config = StrataConfiguration()
        if fixed_crops and StrataLayer.CANOPY in fixed_crops:
            config.canopy_crop = fixed_crops[StrataLayer.CANOPY]
        else:
            config.canopy_crop = random.choice(self.canopy_crops + [None])
        config.middle_crop = random.choice(self.middle_crops + [None])
        config.understory_crop = random.choice(self.understory_crops + [None])
        if config.canopy_crop and config.canopy_crop in CROP_DATABASE:
            crop = CROP_DATABASE[config.canopy_crop]
            config.canopy_spacing = random.uniform(crop.min_spacing_m, crop.max_spacing_m)
        population.append(config)
    return population
```

2) Fitness function (excerpt):

```python
def evaluate(self, config: StrataConfiguration) -> StrataConfiguration:
    crops_selected = []
    if config.canopy_crop and config.canopy_crop in self.crops:
        crops_selected.append((self.crops[config.canopy_crop], config.canopy_spacing))
    if config.middle_crop and config.middle_crop in self.crops:
        crops_selected.append((self.crops[config.middle_crop], config.middle_spacing))
    if not crops_selected:
        config.total_yield = 0.0
        config.ler = 0.0
        config.competition_index = 1.0
        return config

    yields, light_fracs = self._calculate_light_cascade(crops_selected)
    competition = self._calculate_root_competition(crops_selected)
    adjusted_yields = [y * (1.0 - competition * 0.3) for y in yields]
    synergy_bonus = self._calculate_synergy_bonus(crops_selected)
    final_yields = [y * (1.0 + synergy_bonus) for y in adjusted_yields]
    ler = self._calculate_ler(final_yields, crops_selected)
    total_revenue, total_cost = self._calculate_economics(final_yields, crops_selected)

    config.total_yield = sum(final_yields)
    config.ler = ler
    config.competition_index = competition
    config.net_profit_inr_ha = total_revenue - total_cost
    return config
```

3) Selection / mutation logic (excerpt):

```python
def _tournament_select(self, population: List[StrataConfiguration]) -> StrataConfiguration:
    candidates = random.sample(population, min(self.tournament_size, len(population)))
    candidates.sort(key=lambda x: (x.rank, -x.crowding_distance))
    return candidates[0]


def _mutate(self, ind: StrataConfiguration, fixed_crops: Optional[Dict[StrataLayer, str]] = None) -> None:
    if random.random() < self.mut_prob:
        if not (fixed_crops and StrataLayer.CANOPY in fixed_crops):
            ind.canopy_crop = random.choice(self.canopy_crops + [None])
    if random.random() < self.mut_prob and ind.canopy_crop:
        crop = CROP_DATABASE.get(ind.canopy_crop)
        if crop:
            delta = random.gauss(0, 0.5)
            ind.canopy_spacing = np.clip(ind.canopy_spacing + delta, crop.min_spacing_m, crop.max_spacing_m)
```

Short explanation:
- NSGA-II flow: initialize population, evaluate physics- and economics-based fitness, use tournament selection, crossover and mutation, and preserve diversity with crowding distance.
- Mutation respects species-specific spacing bounds and fixed constraints.

---

### Appendix B.7 – Database Models

Snippet 1 (`Crop`, from `backend/models.py`):

```python
class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    stratum_id = Column(Integer, ForeignKey("strata.id"))
    light_requirement = Column(String)
    soil_type_compatibility = Column(JSON, nullable=True)
    intercrop_layer = Column(String, nullable=True)
    spacing_m = Column(Float, nullable=True)
    yield_t_ha = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

Snippet 2 (`MLPrediction`):

```python
class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(String, unique=True, index=True, nullable=False)
    farm_id = Column(String, index=True, nullable=False)
    layer = Column(String, nullable=False)
    predicted_yield = Column(Float, nullable=False)
    ci_low = Column(Float, nullable=True)
    ci_high = Column(Float, nullable=True)
    system_LER = Column(Float, nullable=True)
    model_version = Column(String, nullable=True)
    input_features_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
```

Short explanation:
- `Crop` captures species metadata and agronomic defaults.
- `MLPrediction` records FOHEM inferences and metadata for audit and retraining.

---

### Appendix B.8 – Request/Response Schemas

Snippet (key Pydantic schemas, from `backend/schemas.py` and `multisow/ml/schemas/prediction.py`):

```python
class CropRecommendRequest(BaseModel):
    n: float
    p: float
    k: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class LayerPrediction(BaseModel):
    predicted_yield_t_ha: float
    ci_80_low: float
    ci_80_high: float
    top_shap_features: List[Dict[str, Any]] = Field(default_factory=list)
    fis_stress_scores: Dict[str, float] = Field(default_factory=dict)
    weights_used: List[float] = Field(default_factory=list)

class YieldPredictionResponse(BaseModel):
    prediction_id: str
    farm_id: str
    timestamp: datetime
    layers: Dict[str, LayerPrediction]
    system_LER: float = 0.0
    optimal_geometry_recommendation: str = ""
    model_version: str = "fohem-v2.0"
```

Short explanation:
- Defines validated inputs and typed FOHEM prediction outputs used by API and frontend.
- Ensures consistent payloads for downstream processing and UI rendering.

---

### Appendix B.9 – Business Logic (Service Layer)

Snippet (planner, from `backend/ai_advisor.py`):

```python
def generate_full_plan(self, *, acres: float, soil_type: str, budget_inr: float, goal: str = "maximize_profit") -> Dict[str, Any]:
    candidates = self._preset_candidates()
    filtered = [c for c in candidates if (c.get("soilType") in (None, soil_type))]
    if not filtered:
        filtered = candidates[:]
    scored: List[Tuple[float, Dict[str, Any], Dict[str, float], List[str]]] = []
    for model in filtered:
        breakdown = self._estimate_budget_breakdown(acres=acres, model=model)
        feasibility = min(budget_inr / breakdown["total"], 1.0)
        budget_penalty = 0.0 if budget_inr >= breakdown["total"] else (1.0 - feasibility) * 2.0
        profit_score = math.log1p(max(self._parse_revenue_mid_inr(model.get("estimatedRevenue","")), 0.0)) / 20.0
        yield_score = self._parse_yield_score(model.get("estimatedYield", ""))
        if goal == "maximize_yield":
            base = yield_score * 1.2 + profit_score * 0.6 + feasibility * 0.8 - budget_penalty
        else:
            base = profit_score * 1.2 + yield_score * 0.6 + feasibility * 0.8 - budget_penalty
        why = self._build_why(acres=acres, soil_type=soil_type, budget_inr=budget_inr, model=model, breakdown=breakdown, feasibility=feasibility)
        scored.append((base, model, breakdown, why))
    scored.sort(key=lambda x: x[0], reverse=True)
    best_score, best_model, breakdown, why = scored[0]
    apply_payload = self._build_apply_payload(acres=acres, model=best_model)
    return {
        "recommended_model_id": best_model["id"],
        "recommended_model_name": best_model["name"],
        "why_this_plan": why,
        "tiers": self._tiers_from_model(model=best_model, acres=acres),
        "budget_breakdown": breakdown,
        "apply_payload": apply_payload,
    }
```

Short explanation:
- Scores preset candidate plans by budget fit, profit and yield objectives and returns a ready-to-apply payload.
- Deterministic, explainable planner suitable for UI consumption.

---

### Appendix B.10 – Sample Frontend Component (Optional)

Snippet (client POST to `/ml/predict`, from `components/ml/YieldPredictionTool.tsx`):

```tsx
const handlePredict = async () => {
  setLoading(true)
  try {
    const res = await fetch('/ml/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farm_id: farmId, layers }),
    })
    if (!res.ok) throw new Error((await res.json()).detail || `HTTP ${res.status}`)
    const data: PredictionResult = await res.json()
    setResult(data)
  } catch (err: any) {
    setError(err.message ?? 'Prediction failed')
  } finally {
    setLoading(false)
  }
}
```

Short explanation:
- Frontend request flow for FOHEM prediction, including error handling and state update.
- Aligns with the backend `YieldPredictionResponse` schema.

---

### Appendix B.11 – Dependencies

Cleaned `requirements.txt` summary:

```text
fastapi>=0.115.0
granian>=1.6.0
sqlalchemy>=2.0.30
asyncpg>=0.29.0
pydantic>=2.9.0
pydantic-settings>=2.1.0
python-multipart==0.0.6
arq>=0.25.0
numpy>=1.26.0
pandas>=2.2.0
scipy>=1.12.0
scikit-learn>=1.4.0
httpx>=0.27.0
anthropic>=0.25.0
python-dotenv>=1.0.0
```

Short explanation:
- Core runtime and ML dependencies; optional heavy ML/explainability packages are installed selectively in deployment.

---

### Appendix B.12 – Backend Orchestration and Fallbacks

Snippet (from `backend/main.py`):

```python
# NLP startup check
anthropic_key = os.getenv("ANTHROPIC_API_KEY")
if not anthropic_key:
        logger.warning("ANTHROPIC_API_KEY not set — NLP endpoints will run in fallback mode.")

yield  # App runs here

logger.info("Shutting down MultiSow")

_raw_origins = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:3001,http://localhost:3000",
)
_allow_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

if HAS_ML:
        for ml_router in all_ml_routers:
                app.include_router(ml_router)

app.include_router(nlp_router.router)
app.include_router(crop_recommender_router.router)
app.include_router(crop_library_router.router)

@app.get("/health")
@app.head("/health")
def health_check():
        return {"status": "ok", "message": "Backend is running", "version": "2.0.0"}

def get_db():
        db = database.SessionLocal()
        try:
                yield db
        finally:
                db.close()
```

Short explanation:
- Shows the actual application wiring sequence: startup checks, environment-driven CORS, conditional ML router mounting and the health/database helpers.
- This is the control point that decides whether the ML subsystem is exposed or whether the app runs in fallback mode.

---

### Appendix B.13 – AI Advisor Decision Flow

Snippet (from `backend/ai_advisor.py`):

```python
def analyze_configuration(self, config: Dict[str, Any]):
        crops = config.get("crops", [])
        overstory_count = sum(1 for c in crops if c.get("stratum") == "Overstory")
        middle_count = sum(1 for c in crops if c.get("stratum") == "Middle")
        understory_count = sum(1 for c in crops if c.get("stratum") == "Understory")
        vertical_count = sum(1 for c in crops if c.get("stratum") == "Vertical")

        advice = []
        if overstory_count > 2:
                advice.append("⚠️ **High Canopy Density**: Multiple Overstory crops detected. Ensure at least 8-10m spacing to prevent excessive shading.")
        if understory_count > 0 and overstory_count == 0:
                advice.append("💡 **Missing Overstory**: Many understory crops thrive better with dappled sunlight from a canopy. Consider adding a Coconut or Areca Nut layer.")
        if not advice:
                advice.append("✅ **Excellent Stratification**: Your crop architecture is well-balanced and follows multi-tier best practices.")

        summary = (
            f"AI Analysis Result:\n"
            f"- Architecture: {'Full' if len(crops) >= 4 else 'Partial'} Multi-Tier\n"
            f"- Components: {overstory_count} Overstory, {middle_count} Middle, {understory_count} Understory, {vertical_count} Vertical\n\n"
            "**Strategic Recommendations:**\n" + "\n".join(advice)
        )

        return {
                "status": "success",
                "counts": {"overstory": overstory_count, "middle": middle_count, "understory": understory_count, "vertical": vertical_count},
                "advice": summary,
                "compatibility_score": 100 - (20 if overstory_count > 2 else 0),
        }

def _build_apply_payload(self, *, acres: float, model: Dict[str, Any]) -> Dict[str, Any]:
        payload = {
                "id": model["id"],
                "name": model["name"],
                "soilType": model.get("soilType"),
                "acres": acres,
                "cropSchedule": model.get("cropSchedule"),
        }
        return payload
```

Short explanation:
- This is the reasoning layer behind the advisor: it counts layer composition, produces rule-based guidance and returns a compatibility score.
- The apply payload is what connects a recommendation back into the designer workflow, so the advisor is not just descriptive but actionable.

---

### Appendix B.14 – Frontend AI Advisor Hook

Snippet (from `hooks/useAIAdvisor.ts`):

```ts
const buildFarmContext = useCallback(() => {
    if (!currentFarm) {
        return 'No farm configured yet.'
    }
    return (
        `Farm: ${currentFarm.name || 'Unnamed'}, ` +
        `${currentFarm.acres} acres, ${currentFarm.soilType} soil, ` +
        `Region: ${currentFarm.region || 'India'}, ` +
        `Goal: ${currentFarm.goal}` +
        (selectedModel ? `, Model: ${selectedModel.name}` : '')
    )
}, [currentFarm, selectedModel])

try {
    const res = await fetch(`${API_BASE}/api/nlp/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [...history, { role: 'user', content: text }],
            farm_context: { description: buildFarmContext() },
        }),
        signal: AbortSignal.timeout(20_000),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json() as { answer: string; source?: string; confidence?: number }

    addAdvisoryMessage({
        role: 'assistant',
        content: data.answer,
        source: (data.source as AdvisoryMessage['source']) ?? 'fallback',
        confidence: data.confidence,
    })
} catch {
    addAdvisoryMessage({
        role: 'assistant',
        content: getRuleBasedResponse(text),
        source: 'rule-based',
        confidence: 0.6,
    })
}
```

Short explanation:
- The hook injects farm context into every chat request, keeps a bounded history window and enforces a request timeout.
- If the NLP backend is unavailable, it degrades to a deterministic rule-based responder so the UI still gives advice.

---

### Appendix B.15 – Data-Driven Guide Rendering

Snippet (from `components/PlantingGuide.tsx`):

```tsx
const guide = useMemo<PlantingGuideData>(() => {
    if (presetId && GUIDE_DB[presetId]) return GUIDE_DB[presetId]
    return FALLBACK_GUIDE
}, [presetId])

const acreMultiplier = currentFarm?.acres ?? 1

{TABS.map(tab => {
    return (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                    : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
            <Icon name={tab.icon} size={12} /> {tab.label}
        </button>
    )
})}

{activeTab === 'irrigation' && (
    <div className="space-y-3">
        {guide.irrigation.map((ir, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start justify-between gap-4">
                <div>
                    <div className="font-medium text-white">{ir.period}</div>
                    <div className="text-sm text-white/50 mt-0.5">Method: <span className="text-white/75">{ir.method}</span></div>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-blue-400">
                        {(ir.litresPerDayPerAcre * acreMultiplier).toLocaleString()}
                    </div>
                </div>
            </div>
        ))}
    </div>
)}
```

Short explanation:
- The guide is entirely data-driven: a preset lookup chooses the content, and acreage scales quantities automatically.
- The tab renderer shows how the same dataset powers timeline, spacing, irrigation and revenue views without separate page logic.

---

### Appendix B.16 – Core Database Relationships

Snippet (from `backend/models.py`):

```python
class Stratum(Base):
        __tablename__ = "strata"
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, unique=True, index=True)
        crops = relationship("Crop", back_populates="stratum")

class Crop(Base):
        __tablename__ = "crops"
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, unique=True, index=True)
        stratum_id = Column(Integer, ForeignKey("strata.id"))
        stratum = relationship("Stratum", back_populates="crops")
        plot_crops = relationship("PlotCrop", back_populates="crop")

class PlotCrop(Base):
        __tablename__ = "plot_crops"
        id = Column(Integer, primary_key=True, index=True)
        plot_id = Column(Integer, ForeignKey("plots.id"))
        crop_id = Column(Integer, ForeignKey("crops.id"))
        plot = relationship("Plot", back_populates="plot_crops")
        crop = relationship("Crop", back_populates="plot_crops")

class MLPrediction(Base):
        __tablename__ = "ml_predictions"
        prediction_id = Column(String, unique=True, index=True, nullable=False)
        farm_id = Column(String, index=True, nullable=False)
        predicted_yield = Column(Float, nullable=False)
        system_LER = Column(Float, nullable=True)
        input_features_json = Column(Text, nullable=True)
        shap_json = Column(Text, nullable=True)
```

Short explanation:
- This is the persistence backbone: strata and crops model the agronomy graph, while plot-crop links represent the user’s layout.
- `MLPrediction` captures audit data for every prediction, including model inputs and explanation artifacts for later review or retraining.

---

### Appendix B.17 – Landing Page Composition

Snippet (from `app/page.tsx`):

```tsx
export const dynamic = 'force-static';
export const revalidate = 3600;

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <StrataSection />
            <FohemSection />
            <MetricsSection />
            <HowItWorksSection />
            <PresetsSection />
            <ExplainSection />
            <TrustSection />
            <CTASection />
        </div>
    );
}
```

Short explanation:
- The public homepage is assembled from focused sections, which makes the product story easy to scan while keeping the content modular.
- Static revalidation shows the landing page is optimized for low-cost delivery while still allowing periodic refreshes.

---

If you want a single-file `.docx` export, I can convert this Markdown to Word and place it in the repository. Otherwise, download or open the Markdown here: [APPENDIX_B.md](APPENDIX_B.md)
