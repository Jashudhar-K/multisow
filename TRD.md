# Technical Requirements Document (TRD)

## Component Tree Diagram

- App
  - Layout
    - Navbar
    - Footer
    - Main Page
      - HeroSection
      - HowItWorksSection
      - MetricsSection
      - PresetsSection
      - TrustSection
      - CTASection
      - FohemSection
      - StrataSection
      - ExplainSection
    - Designer Page
      - FarmMap
      - FarmScene
      - RowLayoutTools
      - MetricsDashboard
      - ShapExplanationChart
    - UI Components
      - Card
      - Splite
      - Spotlight

## API Contracts

### Backend Endpoints (OpenAPI-style)

#### POST /api/advisor
- **Request:** { farmData: object }
- **Response:** { recommendations: array, explanation: object }

#### GET /api/metrics?scenarioId=ID
- **Response:** { yield: number, resources: object, risk: object }

#### POST /api/scenario
- **Request:** { scenario: object }
- **Response:** { scenarioId: string }

#### GET /api/scenario/:id
- **Response:** { scenario: object }

#### POST /api/auth/login
- **Request:** { username: string, password: string }
- **Response:** { token: string, role: string }

#### POST /api/auth/signup
- **Request:** { username: string, password: string, role: string }
- **Response:** { token: string, role: string }

#### POST /api/data/import
- **Request:** { file: CSV/JSON }
- **Response:** { status: string, errors?: array }

#### GET /api/data/export?format=csv|json
- **Response:** { file: CSV/JSON }

## Data Model Definitions (TypeScript)

### Farm
```ts
export type Farm = {
  id: string;
  name: string;
  fields: Field[];
};

export type Field = {
  id: string;
  name: string;
  crop: string;
  area: number;
  metrics: Metrics;
};

export type Metrics = {
  yield: number;
  waterUse: number;
  risk: number;
};
```

### Scenario
```ts
export type Scenario = {
  id: string;
  name: string;
  farmId: string;
  arrangement: Arrangement[];
  metrics: Metrics;
};

export type Arrangement = {
  fieldId: string;
  crop: string;
};
```

### User
```ts
export type User = {
  id: string;
  username: string;
  role: 'farmer' | 'agronomist' | 'researcher';
};
```

## State Management Architecture
- Use React Context for global user/session state
- Use component state/hooks for local UI state
- Backend state managed via PostgreSQL (farm, scenario, user tables)

## Performance Budget
- **Main Page:** < 1.5s TTI, < 150KB JS
- **Designer Page:** < 2s TTI, < 200KB JS
- **API Response:** < 500ms for all endpoints

## Testing Strategy
- **Unit Tests:** 90%+ coverage for backend and frontend logic
- **Integration Tests:** All API endpoints, scenario flows
- **E2E Tests:** Key user journeys (login, scenario design, AI advice)
- **Tools:** Jest, React Testing Library, Pytest, Playwright

## Deployment Architecture Diagram

- User (Web/Mobile)
  -|
  - CDN (static assets)
  -|
  - Next.js Frontend (Vercel/Docker)
  -|
  - FastAPI Backend (Docker)
  -|
  - PostgreSQL DB

## Known Risks & Mitigations
- **AI Model Bias:** Regularly retrain and audit models
- **Data Privacy:** Encrypt all PII, follow GDPR
- **Mobile Performance:** Optimize images, code splitting
- **API Downtime:** Use health checks, auto-restart containers
