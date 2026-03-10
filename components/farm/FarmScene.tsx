'use client'

import { useRef, useMemo, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Html,
  PerspectiveCamera,
  Sky,
  Plane,
  Line,
} from '@react-three/drei'
import * as THREE from 'three'
import type { StrataLayerId, PlantInstance, Species } from '@/types/farm'
import { FlyoverCamera } from '../three/FlyoverCamera'

// ============================================================================
// SPECIES NAME TO ID MAPPING
// ============================================================================

const speciesNameToId: Record<string, string> = {
  'coconut palm': 'coconut',
  'coconut': 'coconut',
  'banana': 'banana',
  'ginger': 'ginger',
  'turmeric': 'turmeric',
  'black pepper': 'coconut', // Use coconut as fallback for vertical vines
  'vanilla': 'coconut',
  'betel leaf': 'coconut',
  'passion fruit': 'coconut',
  'silver oak': 'coconut',
  'mango': 'coconut',
  'areca nut': 'coconut',
  'papaya': 'banana',
  'guava': 'banana',
  'jackfruit': 'banana',
  'cardamom': 'ginger',
  'pineapple': 'ginger',
  'cocoa': 'banana',
}

function getSpeciesByIdOrName(speciesId: string | null | undefined, layer: StrataLayerId): Species {
  const safeSpeciesId = String(speciesId ?? '').trim()

  // Try direct ID match
  if (safeSpeciesId && defaultSpecies[safeSpeciesId]) {
    return defaultSpecies[safeSpeciesId]
  }
  
  // Try name mapping (case-insensitive)
  const normalizedName = safeSpeciesId.toLowerCase()
  const mappedId = speciesNameToId[normalizedName]
  if (mappedId && defaultSpecies[mappedId]) {
    return defaultSpecies[mappedId]
  }
  
  // Fall back based on layer
  const layerDefaults: Record<StrataLayerId, string> = {
    'canopy': 'coconut',
    'middle': 'banana',
    'understory': 'ginger',
    'root': 'turmeric',
  }
  
  const fallbackId = layerDefaults[layer] || 'coconut'
  return defaultSpecies[fallbackId] || defaultSpecies.coconut
}

// ============================================================================
// DEFAULT SPECIES DATA (for visualization)
// ============================================================================

const defaultSpecies: Record<string, Species> = {
  coconut: {
    id: 'coconut',
    name: 'Coconut',
    scientificName: 'Cocos nucifera',
    commonNames: ['Coconut Palm'],
    layer: 'canopy',
    heightRange: [15, 25],
    canopyDiameter: 8,
    rootDepth: 2,
    rootSpread: 5,
    shadeTolerance: 'full-sun',
    waterNeeds: 'high',
    growthRate: 'medium',
    maturityYears: 6,
    yieldPerTree: 75,
    pricePerKg: 25,
    extinctionCoefficient: 0.52,
    leafAreaIndex: 4.8,
    nitrogenFixing: false,
    color: '#166534',
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa',
    commonNames: ['Plantain'],
    layer: 'middle',
    heightRange: [3, 6],
    canopyDiameter: 4,
    rootDepth: 0.5,
    rootSpread: 2,
    shadeTolerance: 'partial-shade',
    waterNeeds: 'high',
    growthRate: 'fast',
    maturityYears: 1,
    yieldPerTree: 25,
    pricePerKg: 30,
    extinctionCoefficient: 0.4,
    leafAreaIndex: 3.2,
    nitrogenFixing: false,
    color: '#15803d',
  },
  ginger: {
    id: 'ginger',
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    commonNames: ['Ginger Root'],
    layer: 'understory',
    heightRange: [0.5, 1],
    canopyDiameter: 0.5,
    rootDepth: 0.3,
    rootSpread: 0.3,
    shadeTolerance: 'shade-tolerant',
    waterNeeds: 'medium',
    growthRate: 'medium',
    maturityYears: 1,
    yieldPerTree: 2,
    pricePerKg: 100,
    extinctionCoefficient: 0.25,
    leafAreaIndex: 1.5,
    nitrogenFixing: false,
    color: '#14532d',
  },
  turmeric: {
    id: 'turmeric',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    commonNames: ['Yellow Ginger'],
    layer: 'root',
    heightRange: [0.3, 0.6],
    canopyDiameter: 0.4,
    rootDepth: 0.25,
    rootSpread: 0.2,
    shadeTolerance: 'shade-tolerant',
    waterNeeds: 'medium',
    growthRate: 'medium',
    maturityYears: 1,
    yieldPerTree: 1.5,
    pricePerKg: 120,
    extinctionCoefficient: 0.2,
    leafAreaIndex: 1.2,
    nitrogenFixing: false,
    color: '#a16207',
  },
}

// ============================================================================
// TREE COMPONENT (Procedural low-poly tree)
// ============================================================================

interface TreeProps {
  position: [number, number, number]
  species: Species
  maturityStage?: number
  isSelected?: boolean
  onClick?: () => void
}

function Tree({ position, species, maturityStage = 1, isSelected, onClick }: TreeProps) {
  const meshRef = useRef<THREE.Group>(null)
  
  const [trunkHeight, canopyRadius, canopyHeight] = useMemo(() => {
    const baseHeight = (species.heightRange[0] + species.heightRange[1]) / 2
    const height = baseHeight * maturityStage
    const radius = (species.canopyDiameter / 2) * maturityStage
    return [height * 0.3, radius, height * 0.7]
  }, [species, maturityStage])

  // Gentle sway animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.02
    }
  })

  const canopyColor = new THREE.Color(species.color)
  
  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15 * maturityStage, 0.25 * maturityStage, trunkHeight, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      
      {/* Canopy - different shapes based on layer */}
      {species.layer === 'canopy' ? (
        // Palm-like with multiple cones
        <group position={[0, trunkHeight, 0]}>
          <mesh position={[0, canopyHeight * 0.3, 0]} castShadow>
            <coneGeometry args={[canopyRadius, canopyHeight * 0.6, 8]} />
            <meshStandardMaterial color={canopyColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, canopyHeight * 0.5, 0]} castShadow>
            <coneGeometry args={[canopyRadius * 0.7, canopyHeight * 0.4, 8]} />
            <meshStandardMaterial color={canopyColor.clone().multiplyScalar(1.1)} roughness={0.7} />
          </mesh>
        </group>
      ) : species.layer === 'middle' ? (
        // Rounded canopy
        <mesh position={[0, trunkHeight + canopyRadius, 0]} castShadow>
          <sphereGeometry args={[canopyRadius, 12, 12]} />
          <meshStandardMaterial color={canopyColor} roughness={0.6} />
        </mesh>
      ) : (
        // Low shrub
        <mesh position={[0, trunkHeight + canopyRadius * 0.5, 0]} castShadow>
          <sphereGeometry args={[canopyRadius, 8, 8]} />
          <meshStandardMaterial color={canopyColor} roughness={0.7} />
        </mesh>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[canopyRadius * 1.2, canopyRadius * 1.4, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

// ============================================================================
// CENT GRID — gridlines labeled in cents (1 cent ≈ 40.47 m²)
// ============================================================================

const CENT_SIDE_M = Math.sqrt(40.4686) // ≈ 6.36 m per cent side

function CentGrid({ fieldSize, center }: { fieldSize: number; center: [number, number, number] }) {
  const lines = useMemo(() => {
    const halfSize = fieldSize / 2
    const cx = center[0]
    const cz = center[2]
    const step = CENT_SIDE_M
    const pts: { start: [number, number, number]; end: [number, number, number]; major: boolean }[] = []

    // How many subdivisions in each direction
    const count = Math.ceil(halfSize / step)

    for (let i = -count; i <= count; i++) {
      const offset = i * step
      // Lines parallel to Z (varying X)
      pts.push({
        start: [cx + offset, 0.02, cz - halfSize],
        end: [cx + offset, 0.02, cz + halfSize],
        major: i % 10 === 0,
      })
      // Lines parallel to X (varying Z)
      pts.push({
        start: [cx - halfSize, 0.02, cz + offset],
        end: [cx + halfSize, 0.02, cz + offset],
        major: i % 10 === 0,
      })
    }
    return pts
  }, [fieldSize, center])

  // Labels at every 10-cent boundary
  const labels = useMemo(() => {
    const halfSize = fieldSize / 2
    const cx = center[0]
    const cz = center[2]
    const step = CENT_SIDE_M
    const count = Math.ceil(halfSize / step)
    const result: { pos: [number, number, number]; text: string }[] = []

    for (let i = -count; i <= count; i += 10) {
      if (i === 0) continue
      const offset = i * step
      const centVal = Math.abs(i)
      result.push({
        pos: [cx + offset, 0.1, cz - halfSize + 2],
        text: `${centVal}¢`,
      })
      result.push({
        pos: [cx - halfSize + 2, 0.1, cz + offset],
        text: `${centVal}¢`,
      })
    }
    // Origin label
    result.push({ pos: [cx - halfSize + 2, 0.1, cz - halfSize + 2], text: '0' })
    return result
  }, [fieldSize, center])

  return (
    <group>
      {lines.map((l, i) => (
        <Line key={i} points={[l.start, l.end]}
          color={l.major ? '#15803d' : '#22c55e'}
          lineWidth={l.major ? 1.5 : 0.5}
          transparent
          opacity={l.major ? 0.5 : 0.2}
        />
      ))}
      {labels.map((lb, i) => (
        <Html key={i} position={lb.pos} center distanceFactor={fieldSize * 0.8}>
          <span className="text-[10px] text-green-500/60 font-mono whitespace-nowrap select-none pointer-events-none">
            {lb.text}
          </span>
        </Html>
      ))}
    </group>
  )
}

// ============================================================================
// GROUND PLANE WITH GRADIENT
// ============================================================================

function Ground({ size = 100, position = [0, 0, 0] as [number, number, number] }: { size?: number; position?: [number, number, number] }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], -0.01, position[2]]} receiveShadow>
      <planeGeometry args={[size, size, 32, 32]} />
      <meshStandardMaterial
        color="#2d4a1e"
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

// ============================================================================
// SOIL NUTRIENT VISUALIZATION
// ============================================================================

interface NutrientHeatmapProps {
  width: number
  depth: number
  resolution?: number
}

function NutrientHeatmap({ width, depth, resolution = 32 }: NutrientHeatmapProps) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = resolution
    c.height = resolution
    const ctx = c.getContext('2d')!
    
    // Create gradient heatmap
    for (let x = 0; x < resolution; x++) {
      for (let y = 0; y < resolution; y++) {
        const value = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5 + 0.5
        const r = Math.floor(value < 0.5 ? 255 : (1 - value) * 2 * 255)
        const g = Math.floor(value > 0.5 ? 255 : value * 2 * 255)
        ctx.fillStyle = `rgba(${r}, ${g}, 0, 0.5)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
    return c
  }, [resolution])

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [canvas])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial map={texture} transparent opacity={0.6} />
    </mesh>
  )
}

// ============================================================================
// PLANTING ROW VISUALIZATION
// ============================================================================

interface PlantingRowVizProps {
  start: [number, number]
  end: [number, number]
  spacing: number
  speciesId: string
  layer: StrataLayerId
}

function PlantingRowViz({ start, end, spacing, speciesId, layer }: PlantingRowVizProps) {
  const species = defaultSpecies[speciesId] || defaultSpecies.coconut
  
  const plants = useMemo(() => {
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const length = Math.sqrt(dx * dx + dy * dy)
    const count = Math.floor(length / spacing)
    const positions: [number, number, number][] = []
    
    for (let i = 0; i <= count; i++) {
      const t = count > 0 ? i / count : 0
      const x = start[0] + dx * t
      const z = start[1] + dy * t
      positions.push([x, 0, z])
    }
    
    return positions
  }, [start, end, spacing])

  const linePoints = useMemo(() => [
    [start[0], 0.1, start[1]] as [number, number, number],
    [end[0], 0.1, end[1]] as [number, number, number]
  ], [start, end])

  return (
    <group>
      {/* Row line */}
      <Line points={linePoints} color="#22c55e" lineWidth={2} />
      
      {/* Plants along row */}
      {plants.map((pos, i) => (
        <Tree
          key={i}
          position={pos}
          species={species}
          maturityStage={0.8 + Math.random() * 0.2}
        />
      ))}
    </group>
  )
}

// ============================================================================
// LIGHT RAY VISUALIZATION (Beer-Lambert)
// ============================================================================

interface LightRayProps {
  intensity: number
  show?: boolean
}

function LightRays({ intensity, show = true }: LightRayProps) {
  if (!show) return null

  const rays = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let x = -40; x <= 40; x += 10) {
      for (let z = -40; z <= 40; z += 10) {
        positions.push([x, 50, z])
      }
    }
    return positions
  }, [])

  return (
    <group>
      {rays.map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.1, 0.5, 50, 8]} />
          <meshBasicMaterial
            color="#fef08a"
            transparent
            opacity={intensity * 0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================================
// STATS OVERLAY
// ============================================================================

interface StatsOverlayProps {
  metrics: {
    trees: number
    ler: number
    coverage: number
  }
  position?: [number, number, number]
}

function StatsOverlay({ metrics, position = [-45, 30, -45] }: StatsOverlayProps) {
  return (
    <Html position={position} distanceFactor={100}>
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 text-white min-w-[200px] border border-green-500/30">
        <h4 className="text-green-400 font-bold text-sm mb-3">Farm Metrics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Total Trees</span>
            <span className="font-mono">{metrics.trees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">LER</span>
            <span className="font-mono text-green-400">{metrics.ler.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Canopy Cover</span>
            <span className="font-mono">{metrics.coverage}%</span>
          </div>
        </div>
      </div>
    </Html>
  )
}

// ============================================================================
// CAMERA CONTROLLER
// ============================================================================

function CameraController({ target }: { target?: [number, number, number] }) {
  const { camera } = useThree()
  
  useFrame(() => {
    if (target) {
      camera.lookAt(target[0], target[1], target[2])
    }
  })
  
  return null
}

// ============================================================================
// MAIN FARM SCENE COMPONENT
// ============================================================================

export interface FarmSceneProps {
  plants?: PlantInstance[]
  rows?: {
    id: string
    start: [number, number]
    end: [number, number]
    spacing: number
    speciesId: string
    layer: StrataLayerId
  }[]
  showGrid?: boolean
  showNutrients?: boolean
  showLightRays?: boolean
  showStats?: boolean
  fieldSize?: number
  onPlantClick?: (plantId: string) => void
  selectedPlantId?: string
  cameraPosition?: [number, number, number]
  className?: string
  flyoverActive?: boolean
  farmBounds?: { x: number; y: number; width: number; height: number }
}

function FarmSceneContent({
  plants = [],
  rows = [],
  showGrid = true,
  showNutrients = false,
  showLightRays = false,
  showStats = true,
  fieldSize = 100,
  onPlantClick,
  selectedPlantId,
  flyoverActive = false,
  farmBounds = { x: 0, y: 0, width: 100, height: 100 },
}: Omit<FarmSceneProps, 'className' | 'cameraPosition'>) {
  
  const [flyoverComplete, setFlyoverComplete] = useState(false)

  const totalTrees = useMemo(() => {
    let count = plants.length
    rows.forEach(row => {
      if (!Array.isArray(row.start) || !Array.isArray(row.end) || row.spacing <= 0) {
        return
      }

      const dx = row.end[0] - row.start[0]
      const dy = row.end[1] - row.start[1]

      if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
        return
      }

      const length = Math.sqrt(dx * dx + dy * dy)
      count += Math.floor(length / row.spacing) + 1
    })
    return count
  }, [plants, rows])

  // Calculate farm center and radius for flyover
  const [farmCenter, farmRadius] = useMemo(() => {
    const centerX = farmBounds.x + farmBounds.width / 2
    const centerY = farmBounds.y + farmBounds.height / 2
    const radius = Math.max(farmBounds.width, farmBounds.height) / 2
    return [[centerX, 0, centerY] as [number, number, number], radius]
  }, [farmBounds])

  // Calculate camera position based on farm size
  const cameraPosition = useMemo((): [number, number, number] => {
    const size = Math.max(farmBounds.width, farmBounds.height)
    const distance = size * 1.2
    const height = size * 0.8
    // Position camera at an angle for better 3D perspective
    return [farmCenter[0] + distance * 0.7, height, farmCenter[2] + distance * 0.7]
  }, [farmCenter, farmBounds])

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={cameraPosition} 
        fov={50}
        near={0.1}
        far={2000}
      />
      
      {/* Conditionally render FlyoverCamera or OrbitControls */}
      {flyoverActive && !flyoverComplete ? (
        <FlyoverCamera
          active={true}
          farmCenter={farmCenter}
          farmRadius={farmRadius}
          onComplete={() => setFlyoverComplete(true)}
        />
      ) : (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={10}
          maxDistance={farmRadius * 5}
          maxPolarAngle={Math.PI / 2.1}
          target={farmCenter}
        />
      )}
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <hemisphereLight intensity={0.5} color="#87CEEB" groundColor="#3a5f0b" />
      <directionalLight
        position={[100, 150, 50]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 50, 100]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      {/* Ground */}
      <Ground size={fieldSize} position={farmCenter} />
      
      {/* Grid overlay — cent-labeled */}
      {showGrid && (
        <CentGrid fieldSize={fieldSize} center={farmCenter} />
      )}
      
      {/* Nutrient heatmap */}
      {showNutrients && (
        <NutrientHeatmap width={fieldSize} depth={fieldSize} />
      )}
      
      {/* Light rays */}
      <LightRays intensity={0.8} show={showLightRays} />
      
      {/* Individual plants */}
      {plants.filter((plant) => {
        const x = plant?.position?.x
        const y = plant?.position?.y
        return Number.isFinite(x) && Number.isFinite(y)
      }).map((plant) => {
        const { x, y } = plant.position
        const species = getSpeciesByIdOrName(plant.speciesId, plant.layer)
        return (
          <Tree
            key={plant.id}
            position={[x, 0, y]}
            species={species}
            isSelected={plant.id === selectedPlantId}
            onClick={() => onPlantClick?.(plant.id)}
          />
        )
      })}
      
      {/* Planting rows */}
      {rows.filter((row) => {
        if (!Array.isArray(row.start) || !Array.isArray(row.end)) {
          return false
        }

        const [sx, sy] = row.start
        const [ex, ey] = row.end
        return Number.isFinite(sx) && Number.isFinite(sy) && Number.isFinite(ex) && Number.isFinite(ey) && row.spacing > 0
      }).map((row) => (
        <PlantingRowViz
          key={row.id}
          start={row.start}
          end={row.end}
          spacing={row.spacing}
          speciesId={row.speciesId}
          layer={row.layer}
        />
      ))}
      
      {/* Stats overlay */}
      {showStats && (
        <StatsOverlay
          metrics={{
            trees: totalTrees,
            ler: 2.1 + Math.random() * 0.5,
            coverage: Math.min(95, Math.floor(totalTrees * 0.8)),
          }}
          position={[farmCenter[0] - farmRadius * 0.8, farmRadius * 0.5, farmCenter[2] - farmRadius * 0.8]}
        />
      )}
    </>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0A0F0A]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin" />
        <p className="mt-4 text-green-400 text-sm">Loading 3D Scene...</p>
      </div>
    </div>
  )
}

export default function FarmScene(props: FarmSceneProps) {
  const { className, cameraPosition, ...sceneProps } = props
  
  return (
    <div data-testid="farm-canvas" className={`w-full h-full ${className || ''}`} style={{ minHeight: '400px' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false }}
          camera={{ position: cameraPosition || [50, 40, 50], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <FarmSceneContent {...sceneProps} />
        </Canvas>
      </Suspense>
    </div>
  )
}
