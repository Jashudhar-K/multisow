# MultiSow Architecture Document

## Phase 0 — Deep Audit Report

**Generated:** March 3, 2026  
**Auditor:** GitHub Copilot (Claude Opus 4.5)

---

## 1. CURRENT STATE

### 1.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 16.1.6 |
| UI Framework | React | 19.2.4 |
| 3D Visualization | Three.js + @react-three/fiber | 0.183.2 / 9.5.0 |
| Animation | Framer Motion | 12.34.3 |
| Styling | Tailwind CSS | 4.2.1 |
| Backend | FastAPI | 0.109.0 |
| Database | SQLite (SQLAlchemy ORM) | 2.0.25 |
| ML/AI | FOHEM (Custom), Scikit-learn, Anthropic Claude | Various |
| Testing | Vitest, Playwright, Pytest | Latest |

---

### 1.2 Every Page/Route That Exists

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/` | `app/page.tsx` | ✅ Complete | Landing page with Hero, Strata, FOHEM, Metrics, HowItWorks, Presets, Explain, Trust, CTA sections |
| `/dashboard` | `app/dashboard/page.tsx` | ✅ Complete | Farmer dashboard with metrics, AI tools, data health widget |
| `/designer` | `app/designer/page.tsx` | ✅ Complete | 3D farm designer with species library, layers, row tools (741 lines) |
| `/farm` | `app/farm/page.tsx` | ✅ Complete | Farm data entry form with NLP auto-fill (329 lines) |
| `/strata` | `app/strata/page.tsx` | ✅ Complete | Strata system page with 3D previews for 6 preset models (374 lines) |
| `/predict` | `app/predict/page.tsx` | ✅ Complete | Yield prediction tool + explanation panel |
| `/optimize` | `app/optimize/page.tsx` | ✅ Complete | Strata optimizer panel |
| `/crops` | `app/crops/page.tsx` | ✅ Complete | Crops database browser |
| `/calc` | `app/calc/page.tsx` | ✅ Complete | Resource calculator |
| `/ai-advisor` | `app/ai-advisor/page.tsx` | ✅ Complete | AI plan generator form |
| `/research` | `app/research/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/presets` | `app/presets/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/docs` | `app/docs/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/login` | `app/login/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/signup` | `app/signup/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/settings` | `app/settings/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/profile` | `app/profile/page.tsx` | ⚠️ Placeholder | "Coming soon" stub |
| `/custom-model` | `app/custom-model/page.tsx` | ❓ Unknown | Listed in sidebar but not found |

---

### 1.3 Every API Endpoint

#### Backend (FastAPI) — Port 8000

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/` | Redirect to `/docs` | ✅ Works |
| GET/HEAD | `/health` | Health check | ✅ Works |
| GET | `/presets` | Get 6 regional presets | ✅ Works |
| GET | `/api/presets` | Get presets (duplicate) | ✅ Works |
| POST | `/api/crops/` | Create crop | ✅ Works |
| GET | `/api/crops/` | List crops | ✅ Works |
| POST | `/api/plots/` | Create plot | ✅ Works |
| GET | `/api/plots/{id}` | Get plot | ✅ Works |
| POST | `/api/plots/{id}/crops` | Add crop to plot | ✅ Works |
| GET | `/api/plots/{id}/analyze` | Analyze plot | ✅ Works |
| POST | `/api/ai/plan` | Generate AI plan | ✅ Works |
| POST | `/api/ai/analyze` | Analyze config | ✅ Works |

#### NLP Router (`/api/nlp/*`)

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/nlp/health` | NLP subsystem health | ✅ Works |
| POST | `/api/nlp/ask` | Single Q&A | ✅ Works (fallback mode w/o API key) |
| POST | `/api/nlp/chat` | Multi-turn chat | ✅ Works |
| POST | `/api/nlp/extract-parameters` | Extract farm params from text | ✅ Works |
| POST | `/api/nlp/explain-prediction` | Natural language explanation | ✅ Works |
| POST | `/api/nlp/parse-soil-card` | Parse soil health card | ✅ Works |
| POST | `/api/nlp/planting-advice` | Planting recommendations | ✅ Works |
| GET | `/api/nlp/languages` | Supported languages | ✅ Works |

#### ML Router (`/ml/*`) — Conditional on dependencies

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/ml/predict` | FOHEM yield prediction | ⚠️ Requires ML deps |
| GET | `/ml/explain/{id}` | SHAP/LIME explanation | ⚠️ Requires ML deps |
| POST | `/ml/train/*` | Model training | ⚠️ Requires ML deps |
| POST | `/ml/data/*` | Data ingestion | ⚠️ Requires ML deps |
| POST | `/ml/optimize/*` | Genetic optimizer | ⚠️ Requires ML deps |

#### Next.js API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health/route.ts` | Proxy to backend `/health` |
| GET | `/api/presets/route.ts` | Proxy to backend `/presets` |
| POST | `/api/ai/plan/route.ts` | Proxy to AI plan |
| POST | `/api/ai/analyze/route.ts` | Proxy to AI analyze |

---

### 1.4 Every Component and Its Purpose

#### Landing Page Components (`components/landing/`)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `HeroSection.tsx` | ~150 | Hero with headline, stats, CTAs, 3D scene |
| `StrataSection.tsx` | 263 | 4-layer strata visualization with animated bars |
| `FohemSection.tsx` | ~160 | FOHEM model explanation cards |
| `MetricsSection.tsx` | ~70 | 4 animated stats (LER, water, revenue, accuracy) |
| `HowItWorksSection.tsx` | Unknown | 3-step process |
| `PresetsSection.tsx` | ~140 | Horizontal preset card scroll |
| `ExplainSection.tsx` | Unknown | SHAP explanation demo |
| `TrustSection.tsx` | Unknown | Trust indicators |
| `CTASection.tsx` | Unknown | Final call-to-action |
| `Navbar.tsx` | Unknown | Navigation bar |
| `Footer.tsx` | Unknown | Page footer |

#### Layout Components (`components/layout/`)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `PageLayout.tsx` | 16 | Simple page wrapper with title |
| `Sidebar.tsx` | ~65 | Fixed left sidebar navigation |
| `SidebarLayout.tsx` | 15 | Layout with sidebar + main area |

#### Farm/Designer Components (`components/farm/`, `components/designer/`)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `FarmScene.tsx` | 691 | Full 3D farm visualization with trees, grid, stats |
| `FarmCanvas.tsx` | ~55 | Designer 3D canvas wrapper |
| `DesignerSidebar.tsx` | Unknown | Layer/tool controls sidebar |
| `PlantingGuidePanel.tsx` | Unknown | Planting guide drawer |
| `AIAdvisorPanel.tsx` | ~70 | AI plan generator form |
| `MetricsDashboard.tsx` | Unknown | Farm metrics display |
| `CompatibilityWarnings.tsx` | Unknown | Crop compatibility alerts |
| `FarmMap.tsx` | Unknown | 2D map view |
| `MeasurementOverlays.tsx` | Unknown | Measurement tool overlays |
| `PresetsPanel.tsx` | Unknown | Preset selection panel |
| `RowLayoutTools.tsx` | Unknown | Row pattern tools |
| `SeasonTimeline.tsx` | Unknown | Season slider |
| `ShapExplanationChart.tsx` | Unknown | SHAP waterfall chart |
| `UndoRedoButtons.tsx` | Unknown | Undo/redo controls |

#### ML Components (`components/ml/`)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `YieldPredictionTool.tsx` | 586 | Multi-layer prediction form |
| `ExplainPredictionTool.tsx` | 300 | SHAP/LIME explanation viewer |
| `CropsDatabase.tsx` | Unknown | Crop database browser |
| `DataHealthWidget.tsx` | Unknown | Data quality indicator |
| `ResourceCalculator.tsx` | Unknown | Resource calculation tool |
| `OptimizerPanel.tsx` | Unknown | Optimization controls |

#### UI Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `ErrorBoundary.tsx` | React error boundary (basic) |
| `SkeletonCard.tsx` | Loading skeleton |
| `spotlight.tsx` | Spotlight visual effect |

#### Three.js Components (`components/three/`)

| Component | Purpose |
|-----------|---------|
| `CropGrowthStatic.tsx` | Static 3D crop scene for hero |
| `FlyoverCamera.tsx` | Flying camera animation |

---

### 1.5 Every Data Model

#### SQLAlchemy Models (`backend/models.py`)

| Model | Table | Purpose |
|-------|-------|---------|
| `Stratum` | `strata` | 4 vertical layers (Overstory, Middle, Understory, Vertical) |
| `Crop` | `crops` | Crop species with stratum assignment |
| `Plot` | `plots` | User-defined garden plots |
| `PlotCrop` | `plot_crops` | Crop instances in plots with x/y positions |
| `StrataLayerRecord` | `strata_layer_records` | ML input parameters audit log |
| `SensorReading` | `sensor_readings` | IoT sensor data fallback storage |
| `MLPrediction` | `ml_predictions` | Prediction history with SHAP data |
| `FeatureMatrixVersion` | `feature_matrix_versions` | Feature store versions |

#### TypeScript Types (`types/farm.ts`)

| Type | Purpose |
|------|---------|
| `Coordinate`, `LocalCoordinate` | Position types |
| `GeoPolygon`, `FieldBoundary` | Field geometry |
| `StrataLayerId` | `canopy | middle | understory | root` |
| `Species` | Full crop species definition |
| `CropTemplate` | Regional crop template |
| `PlantInstance` | Individual plant in layout |
| `PlantingRow`, `RowGrid` | Row planting patterns |
| `FarmScene3D` | 3D scene configuration |

#### TypeScript Types (`types/landing.ts`)

| Type | Purpose |
|------|---------|
| `StrataLayer` | Layer card data |
| `FohemCard` | FOHEM model card |
| `RegionalPreset` | Preset model data |
| `ShapFeature` | SHAP feature |
| `MetricStat` | Animated stat |

---

### 1.6 Every Broken or Incomplete Feature

| Feature | Location | Issue | Severity |
|---------|----------|-------|----------|
| Research Hub | `/research` | Placeholder only | Medium |
| Presets Page | `/presets` | Placeholder only (duplicate of landing section) | Low |
| Documentation | `/docs` | Placeholder only | Medium |
| User Auth | `/login`, `/signup` | Placeholder forms | High |
| Settings | `/settings` | Placeholder only | Medium |
| Profile | `/profile` | Placeholder only | Medium |
| Custom Model Builder | `/custom-model` | Listed in sidebar but file not found | High |
| ML Prediction | `/ml/predict` | Requires optional deps not installed | Medium |
| Scenario Comparison | Not implemented | Listed in PRD as P2 | Low |
| Data Import/Export | Not implemented | Listed in PRD as P1 | Medium |

---

### 1.7 Performance Bottlenecks Identified

| Issue | Location | Impact | Priority |
|-------|----------|--------|----------|
| No code splitting for 3D | `FarmScene.tsx` (691 lines) | Large bundle size | High |
| No image optimization | Various | Slow LCP | Medium |
| No response caching | Backend endpoints | Repeated API calls | Medium |
| No bundle analysis | `next.config.js` | Unknown bundle size | Low |
| SQLite in production | `database.py` | Not scalable | Medium |
| Full species data inline | `designer/page.tsx` | 741 lines, large component | High |
| No skeleton loaders | Most pages | Poor perceived performance | Medium |
| Synchronous DB operations | Backend | Blocks event loop | Medium |

---

### 1.8 Accessibility Violations

| Issue | Location | WCAG | Severity |
|-------|----------|------|----------|
| Missing skip link | All pages | 2.4.1 | High |
| Missing `aria-label` on icon buttons | Navbar, toolbar | 1.1.1 | High |
| Low contrast text | `text-neutral-400` on dark bg | 1.4.3 | Medium |
| Missing form labels | Some inputs use placeholder only | 1.3.1 | High |
| No focus indicators customized | Default browser | 2.4.7 | Medium |
| 3D canvas not accessible | `FarmScene.tsx` | N/A | Low |
| Missing heading hierarchy | Some pages | 1.3.1 | Medium |
| No `prefers-reduced-motion` | Animations | 2.3.3 | Medium |

---

### 1.9 Security Concerns

| Issue | Location | Risk | Priority |
|-------|----------|------|----------|
| CORS `allow_origins=["*"]` | `backend/main.py` | Open to any origin | High |
| No rate limiting | All endpoints | DoS vulnerability | High |
| No input sanitization | NLP endpoints | Injection risk | High |
| API key not validated | Missing auth middleware | Unauthorized access | Critical |
| No HTTPS enforcement | All endpoints | Man-in-middle | High |
| SQLite file permissions | `sql_app.db` | Database access | Medium |
| No security headers | Backend responses | Various | Medium |
| No CSRF protection | API endpoints | CSRF attacks | Medium |

---

## 2. TARGET STATE

### 2.1 Upgraded Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js 16)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Landing   │  │  Dashboard  │  │   Designer  │  │   Research  │       │
│  │   Page      │  │             │  │   (2D/3D)   │  │     Hub     │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      Design System (tokens.css)                       │ │
│  │   Typography | Colors | Spacing | Shadows | Animations | Components  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                     Component Library (primitives.tsx)                │ │
│  │   Button | Input | Card | Badge | Tooltip | Toast | Modal | Progress │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ REST API
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND (FastAPI)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   AI/ML     │  │    NLP      │  │    CRUD     │  │   Health    │       │
│  │  Routers    │  │   Router    │  │   Routers   │  │   Router    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      Middleware Layer                                 │ │
│  │   Rate Limiting | Security Headers | Error Handling | Caching        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      FOHEM ML System                                  │ │
│  │   Fuzzy Logic | Random Forest | CatBoost | Genetic Optimizer         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      Data Layer                                       │ │
│  │   SQLAlchemy ORM | Feature Store | Sensor Data | Predictions         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE (SQLite → PostgreSQL)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Decisions

| Decision | Rationale |
|----------|-----------|
| Keep Next.js 16 | Already newest, App Router mature |
| Keep Tailwind CSS 4 | Works well, add design tokens layer |
| Add Cal Sans / DM Sans fonts | Premium typography |
| Keep Three.js/R3F | Best 3D for React |
| Add Recharts | For dashboard charts |
| Keep FastAPI | Already excellent |
| Keep SQLite for dev | Add PostgreSQL option for prod |
| Keep Anthropic Claude | Already integrated |

### 2.3 Component Hierarchy

```
RootLayout
├── Navbar (global, sticky)
│   ├── Logo
│   ├── NavLinks (7 items)
│   ├── SearchButton → CommandPalette
│   └── UserMenu → Dropdown
│
├── LandingPage
│   ├── HeroSection
│   │   ├── AnnouncementPill
│   │   ├── Headline (animated)
│   │   ├── StatPills (3)
│   │   ├── CTAButtons (2)
│   │   └── CropGrowthScene (3D)
│   ├── StrataSection (4 layer cards)
│   ├── FohemSection (4 model cards)
│   ├── MetricsSection (4 stats)
│   ├── HowItWorksSection (3 steps)
│   ├── PresetsSection (6 cards)
│   ├── ExplainSection (SHAP chart)
│   └── CTASection
│
├── Dashboard
│   ├── Header (greeting + date)
│   ├── KPICards (4)
│   ├── ChartTabs (Yield, Revenue, Light, Root)
│   ├── PredictionResultCard
│   └── QuickActions (3)
│
├── Designer
│   ├── TopToolbar
│   │   ├── ViewModeTabs (2D, 3D, Analytics)
│   │   └── ActionButtons (Undo, Redo, Export, Save)
│   ├── LeftSidebar (tabs: Layers, Species, Tools, AI)
│   ├── MainCanvas (2D or 3D)
│   └── RightPanel (context-sensitive)
│
└── Footer (global)
```

### 2.4 Data Flow Diagram

```
User Input (Form/Designer)
        │
        ▼
┌───────────────────┐
│   React State     │ ←─────┐
│   (useState/      │       │
│    useReducer)    │       │
└───────────────────┘       │
        │                   │
        ▼                   │
┌───────────────────┐       │
│   API Call        │       │
│   (fetch/axios)   │       │
└───────────────────┘       │
        │                   │
        ▼                   │
┌───────────────────┐       │
│   FastAPI         │       │
│   Endpoint        │       │
└───────────────────┘       │
        │                   │
        ▼                   │
┌───────────────────┐       │
│   FOHEM ML        │       │
│   (if needed)     │       │
└───────────────────┘       │
        │                   │
        ▼                   │
┌───────────────────┐       │
│   Database        │       │
│   (SQLAlchemy)    │       │
└───────────────────┘       │
        │                   │
        ▼                   │
┌───────────────────┐       │
│   Response        │───────┘
│   (JSON)          │
└───────────────────┘
```

### 2.5 API Contract Changes

| Endpoint | Current | Target |
|----------|---------|--------|
| All endpoints | No auth | Add optional API key auth |
| All endpoints | No rate limit | Add per-endpoint limits |
| All responses | Minimal | Add standard envelope: `{data, meta, error}` |
| `/ml/predict` | Requires deps | Graceful fallback mock |
| `/api/presets` | Duplicate | Keep `/presets` only |

---

## 3. UPGRADE PLAN

### Phase 1 — Design System Foundation
- Create `styles/tokens.css` with all design tokens
- Add typography fonts (Cal Sans, DM Sans)
- Build component primitives (Button, Input, Card, Badge, etc.)
- Create animation utilities
- Add noise textures and visual depth

**Risk:** Low  
**Rollback:** Revert CSS changes

### Phase 2 — Navigation
- Upgrade Navbar with glassmorphism
- Add command palette (Ctrl+K search)
- Mobile drawer menu
- User dropdown

**Risk:** Low  
**Rollback:** Revert Navbar component

### Phase 3 — Landing Page
- Upgrade each section with new design
- Add countUp animations
- Improve 3D scene
- Add scroll indicator

**Risk:** Medium (many components)  
**Rollback:** Revert `components/landing/*`

### Phase 4 — Dashboard
- Build KPI cards with sparklines
- Add chart tabs (Recharts)
- Build prediction result card
- Add quick action cards

**Risk:** Medium  
**Rollback:** Revert `app/dashboard/page.tsx`

### Phase 5 — Designer
- Professional toolbar
- Layer sidebar with drag-to-reorder
- Species library with search
- Row layout tools
- AI optimizer integration

**Risk:** High (complex feature)  
**Rollback:** Keep backup of current designer

### Phase 6 — Research Hub
- Build complete page (not placeholder)
- Crop database grid
- Filter system
- Market data table

**Risk:** Low (new feature)  
**Rollback:** Delete new code

### Phase 7 — Farm Data Entry
- NLP quick-fill
- Visual soil selector
- pH slider with gradient
- Live preview panel

**Risk:** Medium  
**Rollback:** Revert `app/farm/page.tsx`

### Phase 8 — Strata Page
- Preserve all logic (CRITICAL)
- Apply design system
- Match new theme

**Risk:** Low (styling only)  
**Rollback:** Revert styling

### Phase 9 — Performance
- Add dynamic imports
- Response caching
- Image optimization
- Bundle analysis

**Risk:** Low  
**Rollback:** Remove optimizations

### Phase 10 — Accessibility
- Skip links
- ARIA labels
- Focus indicators
- Color contrast fixes
- `prefers-reduced-motion`

**Risk:** Low  
**Rollback:** Revert changes

### Phase 11 — Error Handling
- Upgrade ErrorBoundary
- Global exception handler
- Timeout wrappers
- User-friendly messages

**Risk:** Low  
**Rollback:** Keep existing handling

### Phase 12 — Security
- Rate limiting
- Security headers
- Input sanitization
- CORS tightening

**Risk:** Medium  
**Rollback:** Remove middleware

### Phase 13 — Deployment
- Vercel configuration
- Docker/Railway config
- GitHub Actions CI/CD

**Risk:** Low  
**Rollback:** Remove config files

### Phase 14 — Testing
- Backend test suite
- E2E Playwright tests
- Lighthouse CI

**Risk:** Low (additive)  
**Rollback:** Delete tests

### Phase 15 — Quality Gate
- Final checklist verification
- Performance audit
- Accessibility audit
- Security scan

**Risk:** None  
**Rollback:** N/A

---

## 4. CRITICAL CONSTRAINTS

These must NEVER be violated during the upgrade:

1. **Never delete working business logic from `ai_advisor.py`**
2. **Never change crop compatibility rules or yield formulas**
3. **Never remove any of the 6 regional preset models**
4. **Never break existing API endpoints — extend them instead**
5. **Every change must be backwards compatible**
6. **The app must run with zero environment variables set** (graceful degradation)

---

## 5. FILE INVENTORY

### Backend Files (9)
- `backend/__init__.py`
- `backend/main.py` (258 lines)
- `backend/models.py` (96 lines)
- `backend/schemas.py` (87 lines)
- `backend/crud.py` (39 lines)
- `backend/database.py` (11 lines)
- `backend/ai_advisor.py` (273 lines)
- `backend/routers/nlp.py` (106 lines)
- `backend/Procfile`

### ML/NLP Files (~20)
- `ml/nlp/llm_advisor.py` (584 lines)
- `ml/nlp/config.py` (34 lines)
- `multisow/ml/routers/*` (5 files)
- `multisow/ml/models/*`
- `multisow/ml/schemas/*`
- `multisow/ml/pipelines/*`
- `multisow/ml/utils/*`

### Frontend Pages (17)
- `app/page.tsx` (landing)
- `app/layout.tsx`
- `app/globals.css`
- `app/dashboard/page.tsx` (120 lines)
- `app/designer/page.tsx` (741 lines)
- `app/farm/page.tsx` (329 lines)
- `app/strata/page.tsx` (374 lines)
- `app/predict/page.tsx`
- `app/optimize/page.tsx`
- `app/crops/page.tsx`
- `app/calc/page.tsx`
- `app/ai-advisor/page.tsx`
- `app/research/page.tsx` (placeholder)
- `app/presets/page.tsx` (placeholder)
- `app/docs/page.tsx` (placeholder)
- `app/login/page.tsx` (placeholder)
- `app/signup/page.tsx` (placeholder)
- `app/settings/page.tsx` (placeholder)
- `app/profile/page.tsx` (placeholder)

### Components (~40)
- `components/landing/*` (10 files)
- `components/layout/*` (3 files)
- `components/farm/*` (12 files)
- `components/designer/*` (3 files)
- `components/ml/*` (6+ files)
- `components/ui/*` (3+ files)
- `components/three/*` (2 files)

### Hooks (5)
- `hooks/useCountUp.ts`
- `hooks/useEnhancedDesigner.ts`
- `hooks/useFohem.ts`
- `hooks/useInViewAnimation.ts`
- `hooks/useUndoRedo.ts`

### Lib (6)
- `lib/compatibility.ts` (191 lines)
- `lib/spacing.ts` (186 lines)
- `lib/presetToLayout.ts` (564 lines)
- `lib/generatePlantsFromModel.ts`
- `lib/index.ts`
- `lib/utils.ts`

### Types (2)
- `types/farm.ts` (396 lines)
- `types/landing.ts` (55 lines)

### Config Files (12)
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `tailwind.config.ts`
- `postcss.config.js`
- `eslint.config.mjs`
- `vitest.config.ts`
- `requirements.txt`
- `docker-compose.yml`
- `Dockerfile.ml`
- `vercel.json`
- `lighthouse.config.js`

### Data Files (1)
- `data/planting-guides.ts`

---

## 6. SUMMARY OF FINDINGS

### Strengths
1. **Solid foundation** — Next.js 16, FastAPI, SQLAlchemy ORM
2. **3D visualization** — Impressive FarmScene with procedural trees
3. **FOHEM ML system** — Well-designed hybrid ensemble model
4. **NLP integration** — Claude API with graceful fallback
5. **6 regional presets** — Real agricultural research data
6. **Crop compatibility** — Research-backed matrix
7. **Good test coverage** — Vitest, Playwright, Pytest

### Weaknesses
1. **Design inconsistency** — No unified design system
2. **Placeholder pages** — 7 pages are stubs
3. **No auth system** — Security gap
4. **No rate limiting** — DoS vulnerability
5. **Accessibility gaps** — Missing skip links, ARIA, contrast
6. **Performance** — No caching, large components
7. **No CI/CD** — Manual deployment

### Critical Path
1. Design system (foundation for all UI work)
2. Security hardening (must be done for production)
3. Placeholder pages (complete feature set)
4. Performance optimization (user experience)
5. Accessibility (legal and ethical requirement)

---

## 7. NEXT STEPS

Phase 0 is complete. Ready to proceed with **Phase 1 — Design System Foundation** upon confirmation.

---

*Document generated by automated codebase audit.*
