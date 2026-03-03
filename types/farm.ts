/**
 * Farm Designer Types
 * Comprehensive type definitions for interactive farm mapping, 
 * multi-tier crop layouts, and 3D visualization
 */

// ============================================================================
// GEOSPATIAL TYPES
// ============================================================================

export interface Coordinate {
  lat: number
  lng: number
}

export interface LocalCoordinate {
  x: number
  y: number
}

export interface BoundingBox {
  north: number
  south: number
  east: number
  west: number
}

export interface GeoPolygon {
  id: string
  name: string
  coordinates: Coordinate[]
  area: number // in hectares
  centroid: Coordinate
}

export interface FieldBoundary extends GeoPolygon {
  soilType?: string
  elevation?: number
  slope?: number
  aspect?: number // compass direction of slope
}

// ============================================================================
// CROP & SPECIES TYPES
// ============================================================================

export type StrataLayerId = 'canopy' | 'middle' | 'understory' | 'root'

export interface Species {
  id: string
  name: string
  scientificName: string
  commonNames: string[]
  layer: StrataLayerId
  heightRange: [number, number] // [min, max] in meters
  canopyDiameter: number // meters
  rootDepth: number // meters
  rootSpread: number // meters
  shadeTolerance: 'full-sun' | 'partial-shade' | 'shade-tolerant'
  waterNeeds: 'low' | 'medium' | 'high'
  growthRate: 'slow' | 'medium' | 'fast'
  maturityYears: number
  yieldPerTree: number // kg/year at maturity
  pricePerKg: number
  extinctionCoefficient: number // Beer-Lambert k value
  leafAreaIndex: number // typical LAI
  nitrogenFixing: boolean
  icon?: string
  modelPath?: string // path to 3D model (GLTF)
  color: string // hex color for visualization
}

export interface CropTemplate {
  id: string
  name: string
  region: string
  climate: string
  species: {
    layerId: StrataLayerId
    speciesId: string
    spacing: number // meters
    rowPattern: 'straight' | 'staggered' | 'contour'
  }[]
  expectedLER: number
  expectedRevenue: number
}

// ============================================================================
// PLANTING LAYOUT TYPES
// ============================================================================

export interface PlantInstance {
  id: string
  speciesId: string
  position: LocalCoordinate
  geoPosition?: Coordinate
  layer: StrataLayerId
  plantedDate?: Date
  currentHeight?: number
  currentCanopyDiameter?: number
  healthStatus?: 'healthy' | 'stressed' | 'diseased'
}

export interface PlantingRow {
  id: string
  speciesId: string
  layer: StrataLayerId
  startPoint: LocalCoordinate
  endPoint: LocalCoordinate
  spacing: number // meters between plants
  pattern: 'single' | 'double' | 'triple'
  mixedSpecies?: string[] // for in-row diversity
  plantCount: number
}

export interface RowGrid {
  id: string
  name: string
  orientation: number // degrees from north
  rowSpacing: number // meters between rows
  inRowSpacing: number // meters between plants in row
  headlandOffset: number // meters from boundary
  rows: PlantingRow[]
}

export type LayoutPattern = 
  | 'alley-cropping'
  | 'silvopasture'
  | 'contour-planting'
  | 'block-planting'
  | 'custom'

// ============================================================================
// 3D VISUALIZATION TYPES
// ============================================================================

export interface TreeModel {
  id: string
  speciesId: string
  position: [number, number, number] // x, y, z in local coords
  scale: [number, number, number]
  rotation: [number, number, number]
  maturityStage: number // 0-1, affects visual size
}

export interface FarmScene3D {
  id: string
  name: string
  terrain: {
    width: number
    depth: number
    heightMap?: Float32Array
    textureUrl?: string
  }
  trees: TreeModel[]
  camera: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
  }
  lighting: {
    sunPosition: [number, number, number]
    ambientIntensity: number
    shadowsEnabled: boolean
  }
}

export interface GrowthAnimation {
  targetYear: number
  currentYear: number
  isPlaying: boolean
  playbackSpeed: number // years per second
}

// ============================================================================
// METRICS & ANALYTICS TYPES
// ============================================================================

export interface LightInterceptionResult {
  layer: StrataLayerId
  parAbsorption: number // fraction absorbed
  parTransmission: number // fraction transmitted down
  effectiveLAI: number
}

export interface NutrientZone {
  x: number
  y: number
  radius: number
  nitrogenLevel: number // mg/kg
  phosphorusLevel: number
  potassiumLevel: number
  competitionIndex: number // 0-1
}

export interface FarmMetrics {
  totalArea: number // hectares
  plantedArea: number // hectares
  treeDensity: number // trees per hectare
  ler: number // Land Equivalent Ratio
  waterSavings: number // percentage vs monoculture
  carbonSequestration: number // tons CO2/year
  expectedYield: {
    speciesId: string
    yield: number
    unit: string
    revenue: number
  }[]
  totalRevenue: number
  roi: number // return on investment percentage
  rootOverlapIndex: number // 0-1, lower is better
  canopyCover: number // percentage
}

export interface YieldForecast {
  year: number
  yields: {
    speciesId: string
    yield: number
    revenue: number
  }[]
  totalRevenue: number
  cumulativeRevenue: number
}

// ============================================================================
// MAP & UI STATE TYPES
// ============================================================================

export type MapBasemap = 
  | 'satellite'
  | 'satellite-streets'
  | 'outdoors'
  | 'terrain'
  | 'soil'

export type MapOverlay = 
  | 'none'
  | 'soil-nutrients'
  | 'elevation'
  | 'slope'
  | 'ndvi'
  | 'water-stress'
  | 'root-competition'

export type DrawingTool =
  | 'select'
  | 'pan'
  | 'polygon'
  | 'rectangle'
  | 'row'
  | 'plant'
  | 'measure'
  | 'erase'

export interface MapViewState {
  center: Coordinate
  zoom: number
  bearing: number
  pitch: number
}

export interface FarmDesignerState {
  activeField?: FieldBoundary
  selectedTool: DrawingTool
  activeLayer: StrataLayerId | 'all'
  selectedSpecies?: Species
  plantInstances: PlantInstance[]
  rowGrids: RowGrid[]
  metrics: FarmMetrics
  viewMode: '2d' | '3d' | 'split'
  basemap: MapBasemap
  overlays: MapOverlay[]
  showLabels: boolean
  showGrid: boolean
  gridSize: number // meters
  isDrawing: boolean
  undoStack: FarmDesignerAction[]
  redoStack: FarmDesignerAction[]
}

export type FarmDesignerAction =
  | { type: 'ADD_PLANT'; payload: PlantInstance }
  | { type: 'REMOVE_PLANT'; payload: string }
  | { type: 'MOVE_PLANT'; payload: { id: string; position: LocalCoordinate } }
  | { type: 'ADD_ROW'; payload: PlantingRow }
  | { type: 'REMOVE_ROW'; payload: string }
  | { type: 'SET_FIELD'; payload: FieldBoundary }
  | { type: 'APPLY_TEMPLATE'; payload: CropTemplate }
  | { type: 'CLEAR_ALL' }

// ============================================================================
// AI & OPTIMIZATION TYPES
// ============================================================================

export interface FohemInput {
  fieldBoundary: FieldBoundary
  targetSpecies: string[]
  constraints: {
    maxTreeDensity?: number
    minRowSpacing?: number
    prioritize: 'yield' | 'biodiversity' | 'carbon' | 'balanced'
  }
  environmentalData?: {
    annualRainfall: number
    avgTemperature: number
    soilType: string
    soilPH: number
  }
}

export interface FohemOutput {
  optimizedLayout: {
    species: string
    layer: StrataLayerId
    spacing: number
    rowOrientation: number
    plantCount: number
  }[]
  predictedMetrics: FarmMetrics
  confidence: number
  explanations: ShapExplanation[]
}

export interface ShapExplanation {
  feature: string
  contribution: number // positive or negative
  importance: number // absolute importance
  description: string
  color: 'green' | 'red' | 'amber'
}

export interface GeneticOptimizerConfig {
  populationSize: number
  generations: number
  mutationRate: number
  crossoverRate: number
  fitnessWeights: {
    ler: number
    revenue: number
    carbon: number
    biodiversity: number
  }
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type ExportFormat = 
  | 'geojson'
  | 'kml'
  | 'shapefile'
  | 'csv'
  | 'pdf'
  | 'png'

export interface ExportOptions {
  format: ExportFormat
  includeMetrics: boolean
  includeCoordinates: boolean
  includeLegend: boolean
  resolution?: 'low' | 'medium' | 'high'
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface PredictionRequest {
  fieldId: string
  layers: {
    layerId: StrataLayerId
    speciesId: string
    spacing: number
    plantCount: number
  }[]
}

export interface PredictionResponse {
  predictedYield: number
  predictedRevenue: number
  ler: number
  lightInterception: LightInterceptionResult[]
  shapValues: ShapExplanation[]
}
