# Appendix: Code Snippets and Technical Implementation

The snippets below are adapted from this repository and can be pasted into the appendix of the project report. They reflect the current project structure and implementation style.

## A.1 FOHEM Model Core Implementation (Python)

This snippet shows the FOHEM core in `multisow/ml/models/fohem.py`, where physics-informed fuzzy inference is combined with ensemble learners and weighted prediction fusion.

```python
class FOHEM:
    """
    Fuzzy-Optimized Hybrid Ensemble Model for a single stratum layer.

    Combines FIS stress scores with RF, CatBoost, and ELM base learners,
    using genetically-optimised weights and feature selection.
    """

    def __init__(self, layer: StrataLayer) -> None:
        self.layer = layer
        self.fis = StratifiedFuzzyInferenceSystem()
        self.rf = RandomForestSubModel()
        self.catboost = CatBoostSubModel()
        self.elm = ELMSubModel()
        self.ga_weights = GAWeightOptimizer()
        self.ga_features = GAFeatureSelector()
        self.weights: np.ndarray = np.array([0.25, 0.25, 0.25, 0.25])
        self.selected_features: List[str] = []
        self.is_trained: bool = False

    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
    ) -> None:
        self._y_train_mean = float(y.mean()) if len(y) > 0 else 1.0

        fis_scores = self.fis.infer_batch(X)

        numeric_X = X.select_dtypes(include=[np.number])
        if len(numeric_X.columns) == 0:
            self.selected_features = list(X.columns)
        else:
            self.selected_features, best_r2 = self.ga_features.evolve(
                numeric_X, y, self.rf
            )
            if not self.selected_features:
                self.selected_features = list(numeric_X.columns)

        X_sel = X[self.selected_features].copy()
        X_val_sel = X_val[self.selected_features].copy() if len(self.selected_features) > 0 else X_val.copy()

        X_aug = pd.concat(
            [X_sel.reset_index(drop=True),
             fis_scores[["aggregate_stress_score"]].reset_index(drop=True)],
            axis=1,
        )

        self.rf.fit(X_aug, y)
        self.catboost.fit(X_aug, y)
        self.elm.fit(X_aug.values, y.values)

        fis_val_scores = self.fis.infer_batch(X_val)
        X_val_aug = pd.concat(
            [X_val_sel.reset_index(drop=True),
             fis_val_scores[["aggregate_stress_score"]].reset_index(drop=True)],
            axis=1,
        )

        fis_yield_proxy = 1.0 - (fis_val_scores["aggregate_stress_score"].values / 10.0)
        fis_yield_scaled = fis_yield_proxy * self._y_train_mean

        rf_preds = self.rf.predict(X_val_aug)
        cb_preds = self.catboost.predict(X_val_aug)
        elm_preds = self.elm.predict(X_val_aug.values)

        self.weights, best_mae = self.ga_weights.optimize(
            fis_yield_scaled, rf_preds, cb_preds, elm_preds, y_val,
        )

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        if not self.is_trained:
            raise RuntimeError(f"FOHEM[{self.layer.value}] not trained — call fit() first")

        X_sel = X[self.selected_features].copy()
        fis_scores = self.fis.infer_batch(X)
        X_aug = pd.concat(
            [X_sel.reset_index(drop=True),
             fis_scores[["aggregate_stress_score"]].reset_index(drop=True)],
            axis=1,
        )

        fis_proxy = (1.0 - fis_scores["aggregate_stress_score"].values / 10.0) * self._y_train_mean
        rf_p = self.rf.predict(X_aug)
        cb_p = self.catboost.predict(X_aug)
        elm_p = self.elm.predict(X_aug.values)

        w = self.weights
        result = w[0] * fis_proxy + w[1] * rf_p + w[2] * cb_p + w[3] * elm_p
        return np.maximum(0, result)
```

Beer-Lambert light interception is implemented separately in `multisow/ml/utils/beers_law.py` and is used as the physical component of the model.

```python
def calculate_light_interception(params: BeersLawParams) -> BeersLawResult:
    if params.I_0 < 0:
        raise ValueError("Incident PAR (I_0) cannot be negative")
    if params.LAI < 0:
        raise ValueError("LAI cannot be negative")

    if params.I_0 == 0 or params.LAI == 0:
        return BeersLawResult(
            I_z=params.I_0,
            f_intercepted=0.0,
            f_transmitted=1.0,
            sunlit_fraction=1.0,
            shade_fraction=0.0,
        )

    solar_elev_rad = math.radians(max(params.solar_elevation_deg, 1.0))
    G = params.leaf_angle_distribution
    k_eff = params.k * G / math.sin(solar_elev_rad)
    k_eff = min(k_eff, 5.0)

    strip_width = max(params.path_width, 0.01)
    LAI_strip = params.LAI * params.row_spacing / strip_width

    f_intercepted = 1.0 - math.exp(-k_eff * LAI_strip / strip_width)
    f_intercepted = max(0.0, min(1.0, f_intercepted))
```

## A.2 React Component Pattern (TypeScript)

This section shows the hook-driven pattern used throughout the frontend. The project keeps feature logic inside custom hooks and uses an error boundary for graceful failure handling.

```tsx
'use client'

import { useState, useCallback, useRef } from 'react'
import { useAIFarm, type AdvisoryMessage } from '@/context/AIFarmContext'

export function useAIAdvisor() {
  const { currentFarm, selectedModel, advisoryMessages, addAdvisoryMessage, clearAdvisory, setIsAIProcessing } =
    useAIFarm()
  const [isLoading, setIsLoading] = useState(false)
  const autoSuggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  return {
    messages: advisoryMessages,
    isLoading,
    clearHistory: clearAdvisory,
  }
}
```

```tsx
export function useROICalculator(inputs: ROICalculatorInputs) {
  return useMemo(() => {
    const totalSetupCost = inputs.acres * inputs.saplingCostPerAcre
    const monthlyOperatingCost =
      inputs.laborCostPerMonth +
      inputs.fertilizerCostPerMonth +
      inputs.irrigationCostPerMonth

    const annualOperatingCost = (monthlyOperatingCost * 12) + (inputs.landLeasePerAcreYear * inputs.acres)
    const grossRevenue = inputs.estimatedRevenuePerYear
    const netProfit = grossRevenue - annualOperatingCost

    const monthlyNetProfit = netProfit / 12
    const paybackPeriodMonths = monthlyNetProfit > 0 ? totalSetupCost / monthlyNetProfit : Infinity

    return {
      totalSetupCost,
      annualOperatingCost,
      grossRevenue,
      netProfit,
      paybackPeriodMonths,
    }
  }, [inputs])
}
```

```tsx
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }
    return this.props.children
  }
}
```

## A.3 FastAPI Route Example (Python)

The backend follows typed request validation with Pydantic, dependency injection for the database session, and explicit HTTP status handling.

```python
@router.post("/recommend", summary="AI crop recommendation from soil/climate inputs")
def recommend_crop_endpoint(body: CropInputRequest):
    """Predict the most suitable crop and return compatible library crops."""
    try:
        from multisow.ml.inference.crop_recommender import recommend_crop
        return recommend_crop(
            N=body.n, P=body.p, K=body.k,
            temperature=body.temperature, humidity=body.humidity,
            ph=body.ph, rainfall=body.rainfall,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Model not trained. Run train_crop_recommender.py first. {exc}",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
```

```python
@router.get("/layer/{layer_name}", summary="Crops mapped to an intercropping layer")
def get_layer_crops(layer_name: str):
    valid = {"canopy", "midstory", "understory", "groundcover"}
    if layer_name not in valid:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid layer '{layer_name}'. Choose from: {sorted(valid)}.",
        )
    from multisow.ml.data.crop_library import get_crops_by_layer
    crops = get_crops_by_layer(layer_name)
    return {"layer": layer_name, "crops": crops}
```

## A.4 Database Schema (PostgreSQL DDL)

The SQLAlchemy models map directly to the core persistence layer. These tables are representative of the farm, crop, prediction, and ML feature registry structure.

```python
class StrataLayerRecord(Base):
    __tablename__ = "strata_layer_records"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(String, index=True, nullable=False)
    layer = Column(String, nullable=False)
    crop_species = Column(String, nullable=True)
    LAI = Column(Float, nullable=True)
    k_coeff = Column(Float, nullable=True)
    row_spacing_m = Column(Float, nullable=True)
    soil_N = Column(Float, nullable=True)
    soil_P = Column(Float, nullable=True)
    soil_K = Column(Float, nullable=True)
    soil_pH = Column(Float, nullable=True)
    VWC = Column(Float, nullable=True)
    GDD = Column(Float, nullable=True)
    rainfall_7d = Column(Float, nullable=True)
    solar_elevation_deg = Column(Float, nullable=True)
    root_depth_cm = Column(Float, nullable=True)
    root_radius_cm = Column(Float, nullable=True)
    canopy_height_m = Column(Float, nullable=True)
```

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
    shap_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
```

## A.5 Testing Strategy Examples

The project uses both unit tests and browser-driven end-to-end checks. The examples below show the mathematical assertions used for Beer-Lambert validation and a minimal user flow test.

```ts
describe('Beers Law', () => {
  it('f_intercepted is always between 0 and 1', () => {
    for (let k = 0; k <= 2; k += 0.2) {
      for (let LAI = 0; LAI <= 10; LAI += 0.5) {
        const f = f_intercepted(k, LAI)
        expect(f).toBeGreaterThanOrEqual(0)
        expect(f).toBeLessThanOrEqual(1)
      }
    }
  })

  it('f_transmitted = 1 - f_intercepted always', () => {
    for (let k = 0.5; k <= 2; k += 0.5) {
      for (let LAI = 0; LAI <= 10; LAI += 0.5) {
        const f = f_intercepted(k, LAI)
        const t = f_transmitted(k, LAI)
        expect(f + t).toBeCloseTo(1, 5)
      }
    }
  })
})
```

```ts
test('complete flow: landing → select preset → view in 3D → download planting guide', async ({ page }) => {
  await page.goto('/')
  await page.locator('#presets button', { hasText: 'Use This Model' }).first().click()
  await expect(page).toHaveURL(/designer/)
})
```

## A.6 Deployment Configuration (Docker Compose)

This compose file defines the application stack and the health-checked service relationships.

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.ml
    ports:
      - "8001:8001"
    environment:
      - MULTISOW_DATABASE_URL=postgresql+asyncpg://multisow:multisow-pass@postgres:5432/multisow_db
      - MULTISOW_REDIS_URL=redis://redis:6379/0
      - CORS_ORIGINS=http://localhost:3001,http://frontend:3001
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')"]

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - BACKEND_URL=http://web:8001

  postgres:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=multisow
      - POSTGRES_PASSWORD=multisow-pass
      - POSTGRES_DB=multisow_db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## A.7 Performance Optimization Techniques

The implementation emphasizes low-latency routes, caching-friendly data access, and memoized UI calculations.

```tsx
export function useSensorData(farmId: string) {
  const [readings, setReadings] = useState<Record<string, SensorReading>>({})
  const [isSimulated, setIsSimulated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const fetchSensors = async () => {
      try {
        const res = await fetch(`/api/sensors/readings?farm_id=${farmId}`)
        const data = await res.json()
        setReadings(data.readings || {})
        setIsSimulated(data.is_simulated || false)
      } finally {
        setLoading(false)
      }
    }

    fetchSensors()
    intervalId = setInterval(fetchSensors, 5000)

    return () => clearInterval(intervalId)
  }, [farmId])

  return { readings, isSimulated, loading }
}
```

Suggested operational optimizations already reflected in the project design:

- Database indexes on `farm_id`, `crop_id`, and prediction lookup fields.
- Redis-backed caching for repeat crop and recommendation requests.
- React memoization and hook encapsulation to reduce unnecessary rerenders.
- API pagination and field selection for payload reduction on larger datasets.
