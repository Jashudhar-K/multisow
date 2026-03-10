# MultiSow v2 — Complete Feature List

**Generated:** March 3, 2026  
**System Version:** 2.0.0  
**Platform:** Multi-Tier Crop Management + FOHEM ML Platform

---

## 📋 Table of Contents

1. [Core Features](#core-features)
2. [Frontend Features](#frontend-features)
3. [Backend Features](#backend-features)
4. [ML/AI Features](#mlai-features)
5. [UI Components & Buttons](#ui-components--buttons)
6. [API Endpoints](#api-endpoints)
7. [Developer Features](#developer-features)

---

## Core Features

### 1. Multi-Tier Crop System Design
- **Stratified Intercropping:** Design 4-layer (canopy, middle, understory, root) agricultural systems
- **Interactive 3D Farm Designer:** Real-time 3D visualization using Three.js with orbit controls
- **Species Library:** Pre-configured database of 20+ crop species with detailed agronomic data
- **Layer-Based Organization:** Visual separation of crop layers with color coding and filtering
- **Row Layout Tools:** Multiple planting patterns (straight, staggered, contour-following)
- **Undo/Redo System:** Full state management with unlimited history

### 2. AI-Powered Planning & Optimization
- **FOHEM ML Engine:** Fuzzy-Optimized Hybrid Ensemble Model for yield prediction
- **Genetic Algorithm Optimizer:** Multi-objective optimization for crop arrangement
- **Rule-Based AI Advisor:** Instant recommendations based on farm parameters
- **Natural Language Processing:** Claude 4.5-powered farm advisor with multi-turn conversations
- **Preset Models:** 6 regional pre-configured models (Wayanad, Karnataka, Tamil Nadu, etc.)
- **Budget Planning:** Comprehensive cost estimation and ROI calculation

### 3. Data Visualization & Analytics
- **Real-Time Metrics Dashboard:** LER, water savings, carbon sequestration tracking
- **Interactive Charts:** Area charts, bar charts, donut charts, sparklines
- **3D Farm Visualization:** Realistic plant models with growth animation
- **SHAP/LIME Explainability:** Visual explanation of AI predictions
- **Season Timeline:** Growth stage visualization across crop lifecycle
- **Measurement Overlays:** Distance, area, and spacing measurements

### 4. Compatibility & Validation
- **Allelopathy Checker:** Warns about incompatible crop combinations
- **Root Competition Analysis:** Calculates root overlap index
- **Light Distribution Modeling:** Beer-Lambert equation for canopy penetration
- **Resource Conflict Detection:** Identifies water and nutrient competition
- **Synergy Scoring:** Highlights beneficial crop combinations

---

## Frontend Features

### Landing Page (`/`)
- **Hero Section:** 
  - Animated headline with gradient effects
  - 3D crop growth static visualization
  - CTA buttons: "Design Your Farm" and "Open Designer"
  - Stat pills showing productivity gains

- **Strata Section:**
  - Visual explanation of 4-layer system
  - Animated layer transitions
  - Interactive layer preview

- **FOHEM Section:**
  - ML system explanation
  - Feature highlights (Fuzzy Logic, Ensemble Models, GA Optimization)
  - Technical architecture diagram

- **Metrics Section:**
  - Animated counter for key statistics
  - 3.5-4.2× productivity, 70% water savings
  - Land Equivalent Ratio visualization

- **How It Works Section:**
  - 3-step process breakdown
  - Icon-based workflow
  - Simplified user journey

- **Presets Section:**
  - Horizontal scrolling carousel
  - 6 regional preset cards
  - Quick stats (LER, revenue, crops)
  - Direct navigation to strata page

- **Explainability Section:**
  - SHAP/LIME feature importance
  - Model transparency messaging
  - Trust-building content

- **Trust Section:**
  - Social proof elements
  - References to agricultural research
  - Credibility indicators

- **CTA Section:**
  - Final call-to-action
  - Multiple entry points to designer

### Dashboard Page (`/dashboard`)
**Purpose:** Central hub for farmers to monitor farm performance and access tools

**Sections:**
1. **AI/ML Tools Panel:**
   - Button: "Yield Prediction" → navigate to `/predict`
   - Button: "Strata Optimizer" → navigate to `/optimize`
   - Button: "Resource Calculator" → navigate to `/calc`
   - Button: "Crops Database" → navigate to `/crops`

2. **Data Health Widget:**
   - Displays data completeness percentage
   - Shows last update timestamp
   - Color-coded health indicators (green/yellow/red)
   - Farm ID selector

3. **Farm Profile Summary:**
   - Displays farm name and location
   - Shows total area and planted area
   - Lists recommended crops from farm profile
   - Sourced from localStorage

4. **Metrics Dashboard:**
   - **Key Metrics Cards:**
     - Total Area (hectares)
     - Tree Density (plants/ha)
     - Land Equivalent Ratio (LER)
     - Water Savings (%)
     - Carbon Sequestration (tons/year)
     - Net Revenue (INR/year)
     - ROI (%)
     - Root Overlap Index
     - Canopy Coverage (%)

5. **Charts Section:**
   - Yield Trend Chart: 6-month historical data
   - Crop Distribution Bar Chart: Comparative yields by crop

### Designer Page (`/designer`)
**Purpose:** Professional-grade 3D farm layout tool with 741 lines of interactive functionality

**UI Layout:**
- Left: Collapsible sidebar (320px width)
- Center: 3D canvas
- Right: Metrics panel

**Toolbar Buttons:**

1. **Drawing Tools:**
   - **Select Tool (MousePointer2 icon):** Default selection mode
   - **Pan Tool (Hand icon):** Move camera without rotating
   - **Paint Brush Tool:** Paint plants in rows
   - **Rectangle Tool (Square icon):** Draw rectangular planting areas
   - **Row Tool (Rows3 icon):** Create straight/staggered rows
   - **Eraser Tool:** Remove plants
   - **Measurement Tool (Ruler icon):** Measure distances

2. **View Controls:**
   - **Toggle Layers (Layers icon):** Show/hide specific strata layers
   - **Toggle Grid (Eye icon):** Show/hide ground grid
   - **Settings (Settings icon):** Canvas configuration
   - **Undo (Undo2 icon):** Revert last action
   - **Redo (Redo2 icon):** Reapply undone action

3. **Export/Actions:**
   - **Download (Download icon):** Export layout as JSON
   - **AI Suggestions (Sparkles icon):** Get optimization recommendations

**Sidebar Sections:**

1. **Species Library Tab:**
   - Filter by layer: Canopy, Middle, Understory, Root
   - Species cards showing:
     - Name (common + scientific)
     - Layer badge
     - Height range
     - Water needs indicator
     - Drag-to-add functionality
   
   **Species Icons:**
   - Canopy: TreePine icon (Coconut, Teak, Mango, Silver Oak, Areca Nut)
   - Middle: Leaf icon (Banana, Coffee, Papaya, Cocoa, Guava)
   - Understory: Sprout icon (Ginger, Cardamom, Pineapple)
   - Root: Flower2 icon (Turmeric, Groundnut)

2. **Layers Tab:**
   - Toggle visibility for each layer
   - Plant count per layer
   - Color-coded layer indicators

3. **Metrics Tab:**
   - Real-time calculated metrics
   - Total plants count
   - Estimated yield
   - LER calculation
   - Warning indicators

**3D Canvas Features:**
- **Camera Controls:**
  - Orbit: Left-click drag
  - Zoom: Mouse wheel
  - Pan: Right-click drag or middle-click
- **Plant Rendering:**
  - Realistic 3D models (instanced meshes)
  - LOD (Level of Detail) system
  - Shadow rendering
  - Growth animation option
- **Grid System:**
  - 1m spacing
  - Coordinate labels
  - Compass indicator
- **Season Timeline:**
  - Month-by-month growth stages
  - Harvest timing indicators

### Strata Models Page (`/strata`)
**Purpose:** Browse and preview 6 pre-built regional crop models with 3D visualization

**Features:**
- **Model Cards (6 total):**
  1. Wayanad Classic (Beginner)
  2. Karnataka Spice Garden (Intermediate)
  3. Maharashtra Coconut-Mango (Intermediate)
  4. Tamil Nadu Tropical (Beginner)
  5. Andhra Commercial (Advanced)
  6. Cocoa Premium (Advanced)

- **Card Information:**
  - Model name and region
  - Difficulty badge
  - Crop list with icons
  - Acreage
  - Estimated yield (Quintals)
  - Annual revenue (INR)
  - Gradient color theme

- **Card Actions:**
  - **"View 3D" Button (Eye icon):** Opens fullscreen 3D preview modal
  - **"Apply to Farm" Button:** Navigate to designer with model pre-loaded

- **3D Preview Modal:**
  - Fullscreen/windowed toggle (Maximize2 icon)
  - Reset view button (RotateCcw icon)
  - Close button (X icon)
  - Crop layers legend
  - Camera controls hint overlay
  - Generated plant instances from model
  - Row layout visualization

**Statistics Section:**
- 4 animated stat cards:
  - Water Conserved (40-70%)
  - Est. Yield (300+ Q)
  - Est. Annual Revenue (₹8-12L)
  - Sunlight Captured (88%)

### Predict Page (`/predict`)
**Purpose:** ML-powered yield prediction with explainability

**Components:**

1. **Yield Prediction Tool:**
   - **Farm Input Form:**
     - Farm ID field (text)
     - Acres field (number)
   
   - **Layer Configuration (4 collapsible sections):**
     - Canopy Layer (green theme)
     - Middle Layer (yellow theme)
     - Understory Layer (orange theme)
     - Belowground Layer (amber theme)
   
   - **Per-Layer Fields (expandable):**
     - Crop species (dropdown)
     - LAI (Leaf Area Index)
     - k coefficient (extinction)
     - Row spacing (meters)
     - Soil N, P, K (ppm)
     - Soil pH
     - VWC (Volumetric Water Content)
     - GDD (Growing Degree Days)
     - 7-day rainfall (mm)
     - Solar elevation (degrees)
     - Root depth (cm)
     - Root radius (cm)
     - Canopy height (m)
     - Path width (m)
     - Crop density
     - Shade fraction
     - Root length density
   
   - **Preset Buttons:**
     - "Wayanad Classic" - loads profile
     - "Karnataka Spice" - loads profile
     - "Custom" - manual entry
   
   - **Action Buttons:**
     - **"Run Prediction" Button (TrendingUp icon):**
       - Primary green button
       - Loading spinner when processing
       - Calls `/ml/predict` API
     - **"Reset All" Button:** Clear all fields

   - **Results Display:**
     - Prediction ID with copy button
     - Timestamp of prediction
     - System-wide LER score with color coding
     - Per-layer results cards:
       - Predicted yield (t/ha)
       - 80% confidence interval
       - Top SHAP features with bar chart
       - FIS stress scores (light, water, nutrient, competition)
       - Model weights used
       - **"Explain This Layer" Button:** Navigate to explainability

2. **Explain Prediction Tool:**
   - Automatically populated from prediction results
   - SHAP force plot visualization
   - LIME local explanation
   - Natural language explanation (NLP-powered)
   - Feature importance ranking

### Optimize Page (`/optimize`)
**Purpose:** Genetic algorithm-based strata system optimizer

**Features:**

1. **Optimizer Panel:**
   - **Input Form:**
     - Farm ID field
     - Acres field (number, min 0.5)
     - Soil type dropdown:
       - Laterite
       - Black soil
       - Red soil
       - Alluvial
       - Sandy loam
       - Clay
     - Budget field (INR, thousands)
     - Goal selector:
       - Maximize Profit
       - Maximize Yield
       - Minimize Risk
   
   - **Optimization Buttons:**
     - **"Run Full Optimizer" Button (Cpu icon):**
       - Runs genetic algorithm (slower, more accurate)
       - Processing indicator with progress bar
       - Calls `/ml/optimize/full`
     
     - **"Quick Recommendation" Button (Zap icon):**
       - Fast heuristic recommendation
       - Calls `/ml/optimize/quick`
   
   - **Results Display:**
     - Optimization ID
     - Pareto front size (number of solutions)
     - Execution time and statistics
     - Natural language summary
   
   - **Recommendation Cards (top 3):**
     - Rank badge (Trophy icon for #1)
     - Per-layer crop recommendations:
       - Crop name
       - Spacing (meters)
       - Plants per hectare
       - Expected yield (t/ha)
     - Metrics badges:
       - Total yield
       - LER
       - Competition index
       - Light efficiency
       - Net profit (INR/ha)
       - Establishment cost (INR/ha)
     - Synergy notes (green badges)
     - Warning notes (red badges)
     - **Expand/Collapse button (ChevronDown/ChevronUp)**
     - **"Apply to Designer" button:** Load configuration

### Farm Data Entry Page (`/farm`)
**Purpose:** Collect farm parameters with NLP auto-fill

**Form Sections:**

1. **Basic Information:**
   - Farm name (text)
   - Location (text with geolocation option)
   - Total size (acres)
   - Currently planted area (acres)

2. **Soil & Climate:**
   - Soil type (dropdown)
   - Average rainfall (mm/year)
   - Temperature range (°C)
   - Irrigation method:
     - Rain-fed
     - Drip
     - Sprinkler
     - Flood

3. **Natural Language Input Section:**
   - **"Describe Your Farm" textarea:**
     - Multi-line text input
     - Placeholder: "e.g., I have 5 acres in Wayanad with red laterite soil..."
   - **"Auto-Fill from Description" Button (Sparkles icon):**
     - Calls `/api/nlp/extract-parameters`
     - Populates form fields from NLP extraction
   
   - **"Parse Soil Health Card" Button:**
     - Upload soil test report (text)
     - Calls `/api/nlp/parse-soil-card`
     - Auto-fills N, P, K, pH values

4. **Crop Preferences:**
   - Multi-select checkboxes for interested crops
   - Filter by layer
   - **"Get AI Recommendations" Button:**
     - Calls `/api/ai/plan`
     - Shows recommended crops

5. **Action Buttons:**
   - **"Save Profile" Button (primary):** Save to localStorage
   - **"Generate Plan" Button (success):** Navigate to AI advisor with data
   - **"Reset" Button (ghost):** Clear form

### AI Advisor Page (`/ai-advisor`)
**Purpose:** Generate full farm plans using deterministic AI

**AI Plan Generator Panel:**

- **Input Form:**
  - Acres (number input, min 0.1, step 0.1)
  - Soil Type (text input):
    - Suggested: laterite, black, red, alluvial
  - Budget (INR, number input, min 10000, step 1000)
  - Goal (dropdown):
    - Maximize Profit
    - Maximize Yield
    - Low Risk

- **"Generate Plan" Button:**
  - Primary button, full width
  - Shows "Generating..." when loading
  - Calls `/api/ai/plan` endpoint
  - Disabled during generation

- **Results Display:**
  - Shows full JSON response in formatted pre block
  - Includes:
    - Recommended model ID and name
    - Why this plan was selected
    - Tier-by-tier breakdown
    - Budget breakdown (all costs)
    - Expected revenue range
    - Apply payload for designer

### Crops Database Page (`/crops`)
**Purpose:** Browse comprehensive crop database

**Features:**
- Searchable crop list
- Filter by:
  - Layer (Canopy, Middle, Understory, Root)
  - Water needs (Low, Medium, High)
  - Shade tolerance
  - Growth rate
  - Nitrogen fixing
- Crop detail cards showing:
  - Common name, scientific name
  - Layer badge
  - Height range, canopy diameter
  - Root characteristics
  - Agronomic requirements
  - Economic data (yield/tree, price/kg)
  - Photosynthetic parameters (k, LAI)
  - Compatibility matrix

### Resource Calculator Page (`/calc`)
**Purpose:** Calculate resource requirements for farm design

**Calculators:**

1. **Spacing Calculator:**
   - Input: Species, desired plants/acre
   - Output: Optimal row and plant spacing

2. **Irrigation Calculator:**
   - Input: Crop mix, acreage, climate
   - Output: Daily water requirement (liters)

3. **Fertilizer Calculator:**
   - Input: Soil test results, crop needs
   - Output: N-P-K application rates

4. **Labor Calculator:**
   - Input: Farm size, crop types
   - Output: Person-days required per season

5. **ROI Calculator:**
   - Input: Establishment costs, expected yield
   - Output: Break-even time, 5-year projection

### Placeholder Pages (Coming Soon)
- **Research Page (`/research`):** Academic papers and case studies
- **Presets Page (`/presets`):** Expanded preset library
- **Docs Page (`/docs`):** API documentation and tutorials
- **Login Page (`/login`):** User authentication
- **Signup Page (`/signup`):** New user registration
- **Settings Page (`/settings`):** User preferences
- **Profile Page (`/profile`):** User account management
- **Custom Model Page (`/custom-model`):** Upload custom ML models

---

## Backend Features

### API Architecture
- **FastAPI Framework:** Modern async Python API with automatic OpenAPI docs
- **CORS Middleware:** Enables cross-origin requests from frontend
- **SQLAlchemy ORM:** Database abstraction layer
- **Pydantic Schemas:** Request/response validation
- **Graceful Degradation:** ML features optional, service continues without them
- **Lifespan Management:** Startup/shutdown hooks for resource initialization

### Database Models

1. **Crop Model:**
   - ID, name, scientific name
   - Layer (stratum foreign key)
   - Growth characteristics
   - Economic data

2. **Stratum Model:**
   - ID, name, description
   - Vertical layer classification

3. **Plot Model:**
   - ID, name, area
   - User reference
   - Geographic data

4. **PlotCrop Model:**
   - Plot-crop association
   - Quantity, spacing
   - Planting date

5. **ML Models (optional):**
   - Predictions
   - TrainingRuns
   - FeatureImportance
   - DataQualityMetrics

### AI Advisor Module (backend/ai_advisor.py)

**AIStratificationAdvisor Class:**

1. **analyze_plot(plot_id, db):**
   - Fetches plot from database
   - Extracts crop configuration
   - Returns compatibility analysis

2. **analyze_configuration(config):**
   - Counts crops by stratum
   - Validates architecture balance
   - Returns strategic recommendations:
     - High canopy density warnings
     - Missing layer suggestions
     - Vertical climber opportunities
   - Calculates compatibility score

3. **generate_full_plan(acres, soil_type, budget_inr, goal):**
   - Deterministic "AI" planner (no LLM required)
   - Filters 6 preset candidates by soil compatibility
   - Scores by goal (profit/yield/risk)
   - Checks budget feasibility
   - Returns:
     - Recommended model
     - Detailed justification
     - Tier breakdown
     - Budget breakdown (materials, labor, maintenance)
     - Revenue projections
     - Apply payload for designer

4. **_preset_candidates():**
   - Returns 6 regional models:
     - Wayanad Classic (₹13.5L/year)
     - Karnataka Spice (₹7.8L/year)
     - Maharashtra Coconut-Mango (₹26.2L/year)
     - Tamil Nadu Tropical (₹11.2L/year)
     - Andhra Commercial (₹32.5L/year)
     - Cocoa Premium (₹28.8L/year)

5. **_estimate_budget_breakdown(acres, model):**
   - Calculates:
     - Material costs (saplings, inputs)
     - Labor costs (planting, maintenance)
     - Maintenance costs (annual)
     - Total establishment cost

### NLP Router (backend/routers/nlp.py)

**Endpoints:**

1. **GET `/api/nlp/health`:**
   - Returns NLP system status
   - API key configuration check
   - Supported languages list

2. **POST `/api/nlp/ask`:**
   - Single question-answer
   - Input: text, farm_context, language
   - Output: answer, confidence, fallback flag

3. **POST `/api/nlp/chat`:**
   - Multi-turn conversation
   - Input: message history
   - Output: assistant response

4. **POST `/api/nlp/extract-parameters`:**
   - Extract farm params from natural language
   - Input: descriptive text
   - Output: structured JSON (region, soil_type, size, crops, irrigation)

5. **POST `/api/nlp/explain-prediction`:**
   - Natural language explanation of ML predictions
   - Input: prediction object, farm context
   - Output: plain English explanation

6. **POST `/api/nlp/parse-soil-card`:**
   - Extract data from soil health card text
   - Input: card text (OCR or manual)
   - Output: N, P, K, pH, organic carbon, EC

7. **POST `/api/nlp/planting-advice`:**
   - Generate planting recommendations
   - Input: preset name, farm context
   - Output: seasonal planting guide

8. **GET `/api/nlp/languages`:**
   - Returns supported languages:
     - English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi

**NLP Implementation:**
- Uses Anthropic Claude 4.5 API (when available)
- Fallback to rule-based responses when API key missing
- Configurable temperature and max tokens
- Graceful error handling

---

## ML/AI Features

### FOHEM System (Fuzzy-Optimized Hybrid Ensemble Model)

**Architecture:**

1. **Stage 1A - Fuzzy Inference System (FIS):**
   - Light stress calculation (Beer-Lambert law)
   - Water competition analysis
   - Nutrient availability assessment
   - Root overlap competition
   - Outputs: Per-layer stress scores (0-1)

2. **Stage 1B - Ensemble Models:**
   - **Random Forest:** Baseline predictor
   - **CatBoost:** Gradient boosting for tabular data
   - **ELM (Extreme Learning Machine):** Fast neural predictor
   - Each outputs yield prediction per layer

3. **Stage 2 - Genetic Optimizer:**
   - Optimizes weights [w_fis, w_rf, w_cb, w_elm]
   - Uses DEAP (Distributed Evolutionary Algorithms)
   - NSGA-II multi-objective optimization
   - Validates on hold-out set

4. **Final Prediction:**
   - Ŷ = w_fis × FIS_yield + w_rf × RF + w_cb × CB + w_elm × ELM
   - Per-layer predictions
   - System-wide LER calculation
   - 80% confidence intervals

**FOHEMSystem Class:**
- Manages 4 layer-specific FOHEM models
- Coordinates batch predictions
- Handles model training pipeline
- Provides system-wide analytics

### ML Routers

#### 1. Predict Router (`/ml/predict`)

**POST `/ml/predict`:**
- **Input (StrataInput):**
  - farm_id, acres
  - 4 layer configurations:
    - layer, crop_species
    - LAI, k_coeff, row_spacing_m
    - Soil: N, P, K, pH, VWC
    - Climate: GDD, rainfall_7d, solar_elevation_deg
    - Root: depth_cm, radius_cm
    - Canopy: height_m, shade_fraction
    - Additional: path_width_m, crop_density, root_length_density

- **Output (YieldPredictionResponse):**
  - prediction_id (UUID)
  - timestamp
  - Per-layer predictions:
    - predicted_yield_t_ha
    - ci_80_low, ci_80_high
    - top_shap_features (feature importance)
    - fis_stress_scores (light, water, nutrient, competition)
    - weights_used
  - system_LER
  - optimal_geometry_recommendation
  - nlp_explanation (natural language summary)

#### 2. Explain Router (`/ml/explain`)

**GET `/ml/explain/{prediction_id}`:**
- Retrieves cached SHAP explainer
- Generates feature importance
- Calculates partial dependence
- Returns interactive plots (JSON)

**GET `/ml/explain/{prediction_id}/lime`:**
- LIME local interpretation
- Neighborhood sampling
- Linear approximation
- Feature contribution breakdown

#### 3. Train Router (`/ml/train`)

**POST `/ml/train/bootstrap`:**
- Initializes FOHEM with synthetic data
- Trains all 4 layer models
- Saves to disk
- Returns training metrics

**POST `/ml/train/incremental`:**
- Update models with new observations
- Partial fit on recent data
- Validates performance
- Auto-rollback if accuracy drops

#### 4. Data Router (`/ml/data`)

**POST `/ml/data/ingest/sensor`:**
- IoT sensor data ingestion
- InfluxDB integration
- Time-series storage
- Validation and cleaning

**POST `/ml/data/ingest/manual`:**
- Manual observation entry
- Field data collection
- Mobile-friendly input

**POST `/ml/data/ingest/climate`:**
- Weather API integration
- Historical climate data
- Automatic daily sync

**GET `/ml/data/health/{farm_id}`:**
- Data quality assessment
- Completeness percentage
- Last update timestamp
- Missing field warnings

#### 5. Optimize Router (`/ml/optimize`)

**POST `/ml/optimize/full`:**
- Full genetic algorithm run
- Multi-objective optimization:
  - Maximize yield
  - Maximize profit
  - Minimize risk
  - Minimize water use
- Population: 100, Generations: 50
- Returns Pareto front (top 10 solutions)

**POST `/ml/optimize/quick`:**
- Fast heuristic optimization
- Rule-based recommendations
- < 1 second response time
- Good for mobile/low-latency needs

### Physics-Based Modeling

**1. Beer-Lambert Light Model:**
```python
I = I₀ × exp(-k × LAI)
```
- Calculates light penetration through canopy
- Layer-by-layer attenuation
- Adjusts for solar angle

**2. Root Architecture Model:**
```python
overlap = π × (r₁ + r₂)² / spacing²
```
- 3D root zone overlap calculation
- Depth-based competition factors
- Exponential root density decay

**3. Water Balance Model:**
- Penman-Monteith ET calculation
- Crop coefficient per species
- Rainfall-irrigation balance
- Soil water holding capacity

**4. Nutrient Uptake Model:**
- Michaelis-Menten kinetics
- Inter-root competition
- Spatial nutrient depletion
- N-P-K demand by growth stage

### Feature Engineering

**Automated Feature Generation:**
1. **Spatial Features:**
   - Nearest neighbor distance
   - Local density
   - Edge effects

2. **Temporal Features:**
   - Day of year
   - Growing degree days (cumulative)
   - Days since planting

3. **Interaction Features:**
   - LAI × k_coeff (light capture)
   - Root depth × VWC (water access)
   - N × P × K (nutrient interactions)

4. **Derived Features:**
   - Shade gradient across layers
   - Competition index (multi-layer)
   - Resource efficiency ratio

### Model Explainability

**SHAP (SHapley Additive exPlanations):**
- TreeExplainer for RF and CatBoost
- KernelExplainer for ELM
- Global feature importance
- Local prediction explanations
- Force plots, waterfall plots

**LIME (Local Interpretable Model-agnostic Explanations):**
- Samples neighborhood of prediction
- Fits linear model locally
- Returns feature weights
- Text-based explanations

**Natural Language Explanations:**
- Claude 4.5 generates plain English
- Uses SHAP values as context
- Multi-language support
- Farmer-friendly terminology

---

## UI Components & Buttons

### Button Component (components/buttons/Button.tsx)

**Variants:**
- **primary:** Green gradient, white text, shadow
  - `bg-primary-500 hover:bg-primary-600`
  - Use for: Main CTAs, submit actions
  
- **secondary:** Surface color, border
  - `bg-surface hover:bg-surface-hover`
  - Use for: Secondary actions, cancel

- **outline:** Transparent with border
  - `bg-transparent border-primary-500/50`
  - Use for: Tertiary actions, toggles

- **ghost:** No background, subtle hover
  - `bg-transparent hover:bg-surface-hover`
  - Use for: Icon buttons, navigation

- **danger:** Red theme for destructive actions
  - `bg-red-500 hover:bg-red-600`
  - Use for: Delete, reset, remove

- **success:** Green theme for positive actions
  - `bg-green-500 hover:bg-green-600`
  - Use for: Save, confirm, apply

**Sizes:**
- **xs:** `px-2 py-1 text-xs` (12px height)
- **sm:** `px-3 py-1.5 text-sm` (16px height)
- **md:** `px-4 py-2 text-base` (20px height) - default
- **lg:** `px-6 py-3 text-lg` (24px height)
- **xl:** `px-8 py-4 text-xl` (28px height)

**Props:**
- `leftIcon` / `rightIcon`: Lucide icon components
- `loading`: Shows spinner, disables button
- `disabled`: Visual + functional disable
- `fullWidth`: `w-full` class
- `href`: Renders as Link component
- `external`: Opens in new tab
- `className`: Custom styles override

**Animation:**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.1 }}
>
```

### Badge Component (components/buttons/Badge.tsx)

**Variants:**
- **solid:** Filled background
- **soft:** Translucent background (15% opacity)
- **outline:** Border only
- **dot:** Small indicator dot before text

**Colors:**
- default (gray), primary (blue), success (green)
- warning (yellow), error (red), accent (purple)

**Sizes:**
- sm: `text-[10px]`
- md: `text-xs`
- lg: `text-sm`

**Usage:**
```tsx
<Badge variant="soft" color="success" size="md">
  Beginner
</Badge>
```

### Card Components (components/cards/)

**GlassCard:**
```tsx
<GlassCard className="...">
  <GlassCardHeader>Title</GlassCardHeader>
  <GlassCardContent>Content</GlassCardContent>
</GlassCard>
```
- Glass morphism effect: `bg-white/5 backdrop-blur-md`
- Border: `border border-white/10`
- Subtle shadow

**FeatureCard:**
- Icon at top
- Title, description
- Optional "Learn More" link
- Hover animation

**Panel:**
- Solid background variant
- Higher contrast
- Better for nested content

### Chart Components (components/charts/)

**MetricCard:**
```tsx
<MetricCard
  title="Total Area"
  value={2.5}
  unit="ha"
  icon={Map}
  trend={{ value: 12, direction: 'up' }}
  color="success"
/>
```
- Large value display
- Icon with color theme
- Optional trend indicator
- Animated counter

**AreaChart:**
- Time-series data visualization
- Smooth gradients
- Tooltip on hover
- Responsive scaling

**BarChart:**
- Comparative data display
- Color-coded bars
- Axis labels
- Legend

**DonutChart:**
- Percentage breakdown
- Center label with total
- Interactive segments
- Color themes

**Sparkline:**
- Miniature line chart
- No axes (space efficient)
- Use in metric cards

### Navigation Components (components/navigation/)

**Sidebar:**
- Collapsible drawer
- Route highlighting
- Icon + label
- Badge for notifications

**Breadcrumbs:**
- Path navigation
- Auto-generated from route
- Home icon for root

**Tabs:**
- Horizontal tab bar
- Active indicator
- Keyboard navigation

### Form Components (components/forms/)

**Input:**
- Text, number, email types
- Label + helper text
- Error state styling
- Icon support

**Select:**
- Dropdown menu
- Search/filter option
- Multi-select mode
- Custom option renderer

**Textarea:**
- Multi-line input
- Auto-resize
- Character counter

**Checkbox/Radio:**
- Custom styled
- Group variants
- Indeterminate state

**Toggle:**
- On/off switch
- Color themes
- Label positioning

### Overlay Components (components/overlays/)

**Modal:**
```tsx
<Modal isOpen={...} onClose={...}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>Actions</ModalFooter>
</Modal>
```
- Backdrop blur
- Escape to close
- Focus trap
- Animated entrance

**Tooltip:**
- Hover/focus activated
- Positioning: top, right, bottom, left
- Arrow pointer
- Delay config

**Popover:**
- Click activated
- Rich content support
- Portal rendering

**Toast:**
- Notification system
- Auto-dismiss
- Action buttons
- Stack positioning

### Three.js Components (components/three/)

**FlyoverCamera:**
- Cinematic camera animation
- Automatic farm overview
- Smooth transitions

**PlantModel:**
- Instanced mesh rendering
- LOD system
- Shadow casting

**SeasonalGrowth:**
- Animated growth stages
- Morphing geometry
- Texture transitions

---

## API Endpoints

### Core Endpoints

**GET `/`**
- Redirects to `/docs` (OpenAPI)

**GET/HEAD `/health`**
- Status check
- Returns: `{ status: "ok", version: "2.0.0" }`

**GET `/presets`**
- Returns 6 regional preset models
- Same as `/api/presets`

### Crop Management

**POST `/api/crops/`**
- Create new crop
- Body: `{ name, stratum_id, ... }`
- Returns: Crop object

**GET `/api/crops/`**
- List all crops
- Query params: `skip`, `limit`
- Returns: Crop[]

### Plot Management

**POST `/api/plots/`**
- Create new plot
- Body: `{ name, area_ha, ... }`
- Returns: Plot object

**GET `/api/plots/{plot_id}`**
- Get plot by ID
- Returns: Plot with crops

**POST `/api/plots/{plot_id}/crops`**
- Add crop to plot
- Body: `{ crop_id, quantity, spacing }`
- Returns: PlotCrop association

**GET `/api/plots/{plot_id}/analyze`**
- Analyze plot configuration
- Returns: Compatibility analysis, recommendations

### AI Planning

**POST `/api/ai/plan`**
- Generate full farm plan
- Body: `{ acres, soil_type, budget_inr, goal }`
- Returns: Recommended model, tiers, budget, revenue

**POST `/api/ai/analyze`**
- Analyze crop configuration
- Body: `{ name, crops: [{ name, stratum }] }`
- Returns: Compatibility score, advice

### NLP Endpoints (see Backend Features for details)
- `/api/nlp/health`
- `/api/nlp/ask`
- `/api/nlp/chat`
- `/api/nlp/extract-parameters`
- `/api/nlp/explain-prediction`
- `/api/nlp/parse-soil-card`
- `/api/nlp/planting-advice`
- `/api/nlp/languages`

### ML Endpoints (conditional on dependencies)
- `/ml/predict`
- `/ml/explain/{id}`
- `/ml/explain/{id}/lime`
- `/ml/train/bootstrap`
- `/ml/train/incremental`
- `/ml/data/ingest/sensor`
- `/ml/data/ingest/manual`
- `/ml/data/ingest/climate`
- `/ml/data/health/{farm_id}`
- `/ml/optimize/full`
- `/ml/optimize/quick`

---

## Developer Features

### Testing
- **Unit Tests:** Pytest for Python backend
- **Component Tests:** Vitest for React components
- **E2E Tests:** Playwright for full user flows
- **ML Tests:** `multisow/tests/test_fohem.py`, `test_pipelines.py`
- **Coverage:** Vitest coverage reports

### Build & Deploy
- **Development:** `npm run dev` (Next.js + FastAPI concurrent)
- **Production Build:** `npm run build` (Next.js static export)
- **Backend:** `uvicorn backend.main:app --reload`
- **Docker:** `docker-compose up` (full stack)

### Code Quality
- **ESLint:** TypeScript linting
- **Prettier:** Code formatting
- **TypeScript:** Strict type checking
- **Python Type Hints:** mypy compatible

### Environment Variables
```env
ANTHROPIC_API_KEY=sk-...
MULTISOW_INFLUXDB_URL=http://localhost:8086
MULTISOW_INFLUXDB_TOKEN=...
MULTISOW_INFLUXDB_ORG=multisow
MULTISOW_INFLUXDB_BUCKET=sensor_data
MULTISOW_FOHEM_BOOTSTRAP_ON_STARTUP=false
```

### Documentation
- **OpenAPI:** Auto-generated at `/docs`
- **Redoc:** Alternative UI at `/redoc`
- **Component Storybook:** (Future feature)

---

## Feature Status Summary

| Feature | Status | Notes |
|---------|--------|-------|
| 3D Farm Designer | ✅ Complete | 741 lines, full-featured |
| FOHEM ML Prediction | ✅ Complete | Graceful degradation without deps |
| NLP Advisor | ✅ Complete | Fallback mode without API key |
| Genetic Optimizer | ✅ Complete | Multi-objective GA |
| 6 Regional Presets | ✅ Complete | With 3D previews |
| Compatibility Checker | ✅ Complete | Allelopathy + competition |
| AI Plan Generator | ✅ Complete | Deterministic, no LLM needed |
| Dashboard | ✅ Complete | Metrics + AI tools + data health |
| Yield Charts | ✅ Complete | Area, bar, donut, sparkline |
| SHAP/LIME Explainability | ✅ Complete | Optional ML dependency |
| User Authentication | ⚠️ Placeholder | Login/signup pages exist |
| Research Module | ⚠️ Placeholder | Coming soon |
| Mobile App | ❌ Planned | Future release |
| Multi-Language UI | ⚠️ Partial | NLP supports 7 languages |

---

**End of Feature Report**  
Total Features: 100+  
Total UI Components: 50+  
Total API Endpoints: 35+  
Total Pages: 18  
Total Doc Length: 1000+ lines  

For technical architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)  
For product requirements, see [PRD.md](./PRD.md)  
For technology stack, see [TRD.md](./TRD.md)
