# FIXES_AUDIT.md

## PRE-FLIGHT AUDIT — MULTISOW CODEBASE

### 1. Backend FastAPI Routes

- `/` (GET): Redirects to /docs
- `/health` (GET/HEAD): Health check
- `/api/crops/` (POST): Create crop
- `/api/crops/` (GET): List crops
- `/api/plots/` (POST): Create plot
- `/api/plots/{plot_id}` (GET): Get plot by ID
- `/api/plots/{plot_id}/crops` (POST): Add crop to plot
- `/api/plots/{plot_id}/analyze` (GET): Analyze plot (AI stratification)
- `/api/presets` (GET): List preset models (6 regional presets)
- `/api/ai/plan` (POST): AI plan recommendation
- `/api/ai/analyze` (POST): Analyze configuration
- ML routers (if available): `/ml/predict`, `/ml/explain`, `/ml/train`, `/ml/data`, `/ml/optimize`

### 2. Frontend Pages & Components

#### Pages (app/)
- `/` (Landing)
- `/dashboard`
- `/designer`
- `/strata`
- `/predict`
- `/optimize`
- `/ai-advisor`
- `/crops`
- `/research`
- `/presets`
- `/profile`
- `/settings`
- `/login`
- `/signup`
- `/calc`

#### Key Components (components/)
- designer/: DesignerSidebar, FarmCanvas, PlantingGuidePanel
- farm/: AIAdvisorPanel, CompatibilityWarnings, FarmMap, FarmScene, MeasurementOverlays, MetricsDashboard, PresetsPanel, RowLayoutTools, SeasonTimeline, ShapExplanationChart, UndoRedoButtons
- landing/: CTASection, ExplainSection, FohemSection, Footer, HeroSection, HowItWorksSection, MetricsSection, Navbar, PresetsSection, StrataSection, TrustSection
- layout/: PageLayout, Sidebar, SidebarLayout
- ml/: CropsDatabase, DataHealthWidget, ExplainPredictionTool, OptimizerPanel, ResourceCalculator, YieldPredictionTool
- ui/: card, ErrorBoundary, SkeletonCard, splite, spotlight

### 3. ai_advisor.py — Core Functions
- `AIStratificationAdvisor.analyze_plot`
- `AIStratificationAdvisor.analyze_configuration`
- `AIStratificationAdvisor.generate_full_plan`
- `_preset_candidates` (returns 6 regional preset models)
- `_estimate_budget_breakdown`
- `_parse_revenue_mid_inr`, `_revenue_range_inr`, `_parse_yield_score`, `_difficulty_risk_score`
- `_build_why`, `_build_apply_payload`, `_tiers_from_model`

### 4. API Endpoints Already Working
- All endpoints listed in section 1 are implemented and functional.
- ML endpoints are conditionally available if ML modules are installed.

### 5. Broken Imports / Missing Dependencies
- No broken imports detected in main backend or frontend files.
- ML extras (catboost, scikit-fuzzy, deap, shap, lime, influxdb-client, mlflow, etc.) are optional and commented in requirements.txt. If not installed, backend degrades gracefully.

### 6. Original Repo Structure & Logic
- Strata system logic: 4 tiers (Overstory, Middle, Understory, Vertical) with exact crop compatibility, yield, and plant count logic preserved in ai_advisor.py.
- Crop compatibility rules: Encoded in preset models and advisor logic.
- Preset models: 6 regional presets in both backend and frontend, with matching IDs and crop schedules.
- Soil compatibility data: Used in plan generation and recommendations.
- UI layout: Strata page uses a modern React/Next.js layout, but original logic and data are preserved.

### 7. Summary
- All core logic, data, and compatibility rules from the original MultiSow repo are present and unmodified.
- No critical missing dependencies or broken imports.
- Ready to proceed to FIX 5 (Strata page reskin).
