# Decisions

### [2026-03-02] Routing and Navbar Strategy

**Decision:**
The project uses Next.js (see package.json: next dependency, /app directory, page.tsx files). Therefore, we will use **Option A**: all pages will be implemented as /app/[page]/page.tsx, and the Navbar will use Next.js <Link> components for navigation. This enables SPA routing, active link highlighting, and full design system integration.

**Rationale:**
- Next.js is present and used for all main pages (landing, designer, etc.).
- No static HTML pages or legacy FastAPI-served HTML detected.
- This approach allows for unified navigation, SSR/SSG, and best practices for modern React apps.

**Action:**
- All navigation links in the Navbar will use <Link> from 'next/link'.
- All main pages (Home, Dashboard, Designer, Research, Presets, Docs, Login, Profile) will be implemented as /app/[page]/page.tsx.
- The Navbar will be imported and used in all page layouts via a shared PageLayout component.

---
/*
MULTISOW PLATFORM — PRE-FLIGHT AUDIT (2026-03-02)
====================================================================

1. FRONTEND PAGES/ROUTES (Next.js /app structure):
--------------------------------------------------------------------
- / (Landing): app/page.tsx
- /designer: app/designer/page.tsx
- (No explicit dashboard, strata, research, login, or profile pages found in /app yet; may exist as legacy HTML or are to be migrated)

2. BACKEND API ENDPOINTS (backend/main.py & routers):
--------------------------------------------------------------------
**Direct FastAPI endpoints:**
- GET    /health
- GET    /           (redirects to /docs)
- POST   /crops/
- GET    /crops/
- POST   /plots/
- GET    /plots/{plot_id}
- POST   /plots/{plot_id}/crops
- GET    /plots/{plot_id}/analyze
- GET    /presets
- POST   /ai/plan
- POST   /ai/analyze

**ML Routers (mounted at /ml/* if ML available):**
- POST   /ml/predict
- GET    /ml/explain/{prediction_id}
- GET    /ml/explain/{prediction_id}/shap_beeswarm
- POST   /ml/train
- GET    /ml/train/{job_id}/status
- POST   /ml/ingest/sensor
- POST   /ml/ingest/manual
- POST   /ml/ingest/climate
- POST   /ml/ingest/drone
- GET    /ml/data/features
- GET    /ml/data/health
- POST   /ml/optimize/strata

3. FEATURES IN ai_advisor.py & models.py:
--------------------------------------------------------------------
**ai_advisor.py:**
- analyze_plot: Analyze a plot's stratification and give recommendations
- analyze_configuration: General stratification analysis (JSON config)
- generate_full_plan: AI planner for optimal crop plan (soil, budget, goal)

**models.py:**
- Stratum: Crop system layer (Overstory, Middle, Understory, Vertical)
- Crop: Crop type, stratum, light requirement
- Plot: User-defined farm plot
- PlotCrop: Crop instance in a plot (with x/y position)
- StrataLayerRecord: ML audit/replay of layer parameters

4. UI REACHABILITY OF FEATURES:
--------------------------------------------------------------------
- Landing page: Present (app/page.tsx)
- Designer: Present (app/designer/page.tsx)
- Species library, farm map, and 3D scene: Present in designer
- AI Advisor (analyze_plot, analyze_configuration): Only accessible via backend endpoints, not surfaced in UI yet
- Presets: /presets endpoint exists, but not fully surfaced in UI
- ML endpoints: Not directly surfaced in UI
- Crop/plot CRUD: Not surfaced in UI

5. BROKEN IMPORTS, MISSING DEPENDENCIES, DEAD ROUTES:
--------------------------------------------------------------------
- No broken imports found in main frontend/backend files scanned
- ML routers are conditionally imported; if ML dependencies are missing, endpoints are skipped (graceful fallback)
- Mapbox/GL dependencies are referenced in FarmMap (designer), but removal is pending (per Phase 2)
- No dead routes found in backend/main.py; all endpoints are mounted or conditionally skipped
- Some legacy HTML pages (dashboard, strata, research, login, profile) are referenced in the spec but not present in /app/ (migration needed)

6. ARCHITECTURAL DECISIONS (with date):
--------------------------------------------------------------------
- [2026-03-02] Next.js detected (package.json, /app structure). All new pages will be implemented as Next.js routes. Option A (Next.js migration) chosen for unified routing and Navbar integration.
- [2026-03-02] ML endpoints are conditionally available; UI must gracefully degrade if ML is unavailable.
- [2026-03-02] Mapbox/GL to be removed in Phase 2; all mapping to be replaced with R3F/SVG.
- [2026-03-02] All backend features must be surfaced in the UI per sprint requirements; current gaps identified above.

====================================================================
// End of audit. Proceed to Phase 1.
*/