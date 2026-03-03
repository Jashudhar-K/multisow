(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/three/FlyoverCamera.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlyoverCamera",
    ()=>FlyoverCamera
]);
/**
 * Flyover Camera Animation
 * Animates camera in a cinematic arc around the farm after preset load
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function FlyoverCamera({ active, farmCenter = [
    0,
    0,
    0
], farmRadius = 50, duration = 4, onComplete }) {
    _s();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const timeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const completedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Reset when active changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlyoverCamera.useEffect": ()=>{
            if (active) {
                timeRef.current = 0;
                completedRef.current = false;
            }
        }
    }["FlyoverCamera.useEffect"], [
        active
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "FlyoverCamera.useFrame": (state, delta)=>{
            if (!active || completedRef.current) return;
            timeRef.current += delta;
            const t = Math.min(timeRef.current / duration, 1);
            if (t >= 1) {
                // Animation complete
                completedRef.current = true;
                onComplete?.();
                return;
            }
            // Ease in-out cubic
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            // Start position: high bird's eye view
            const startHeight = farmRadius * 2.5;
            const startDist = farmRadius * 1.8;
            // End position: comfortable viewing angle
            const endHeight = farmRadius * 0.8;
            const endDist = farmRadius * 1.5;
            // Interpolate height and distance
            const height = startHeight + (endHeight - startHeight) * eased;
            const dist = startDist + (endDist - startDist) * eased;
            // Rotate 360° around farm
            const angle = eased * Math.PI * 2;
            // Position camera
            const x = farmCenter[0] + Math.cos(angle) * dist;
            const z = farmCenter[2] + Math.sin(angle) * dist;
            const y = farmCenter[1] + height;
            camera.position.set(x, y, z);
            camera.lookAt(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...farmCenter));
        }
    }["FlyoverCamera.useFrame"]);
    return null;
}
_s(FlyoverCamera, "e2GYo1eV3l35s4o/gzHWUA2TUI4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = FlyoverCamera;
var _c;
__turbopack_context__.k.register(_c, "FlyoverCamera");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/farm/FarmScene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FarmScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Grid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$PerspectiveCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/PerspectiveCamera.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Sky$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Sky.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$three$2f$FlyoverCamera$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/three/FlyoverCamera.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// ============================================================================
// SPECIES NAME TO ID MAPPING
// ============================================================================
const speciesNameToId = {
    'coconut palm': 'coconut',
    'coconut': 'coconut',
    'banana': 'banana',
    'ginger': 'ginger',
    'turmeric': 'turmeric',
    'black pepper': 'coconut',
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
    'cocoa': 'banana'
};
function getSpeciesByIdOrName(speciesId, layer) {
    const safeSpeciesId = String(speciesId ?? '').trim();
    // Try direct ID match
    if (safeSpeciesId && defaultSpecies[safeSpeciesId]) {
        return defaultSpecies[safeSpeciesId];
    }
    // Try name mapping (case-insensitive)
    const normalizedName = safeSpeciesId.toLowerCase();
    const mappedId = speciesNameToId[normalizedName];
    if (mappedId && defaultSpecies[mappedId]) {
        return defaultSpecies[mappedId];
    }
    // Fall back based on layer
    const layerDefaults = {
        'canopy': 'coconut',
        'middle': 'banana',
        'understory': 'ginger',
        'root': 'turmeric'
    };
    const fallbackId = layerDefaults[layer] || 'coconut';
    return defaultSpecies[fallbackId] || defaultSpecies.coconut;
}
// ============================================================================
// DEFAULT SPECIES DATA (for visualization)
// ============================================================================
const defaultSpecies = {
    coconut: {
        id: 'coconut',
        name: 'Coconut',
        scientificName: 'Cocos nucifera',
        commonNames: [
            'Coconut Palm'
        ],
        layer: 'canopy',
        heightRange: [
            15,
            25
        ],
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
        color: '#166534'
    },
    banana: {
        id: 'banana',
        name: 'Banana',
        scientificName: 'Musa',
        commonNames: [
            'Plantain'
        ],
        layer: 'middle',
        heightRange: [
            3,
            6
        ],
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
        color: '#15803d'
    },
    ginger: {
        id: 'ginger',
        name: 'Ginger',
        scientificName: 'Zingiber officinale',
        commonNames: [
            'Ginger Root'
        ],
        layer: 'understory',
        heightRange: [
            0.5,
            1
        ],
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
        color: '#14532d'
    },
    turmeric: {
        id: 'turmeric',
        name: 'Turmeric',
        scientificName: 'Curcuma longa',
        commonNames: [
            'Yellow Ginger'
        ],
        layer: 'root',
        heightRange: [
            0.3,
            0.6
        ],
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
        color: '#a16207'
    }
};
function Tree({ position, species, maturityStage = 1, isSelected, onClick }) {
    _s();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [trunkHeight, canopyRadius, canopyHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Tree.useMemo": ()=>{
            const baseHeight = (species.heightRange[0] + species.heightRange[1]) / 2;
            const height = baseHeight * maturityStage;
            const radius = species.canopyDiameter / 2 * maturityStage;
            return [
                height * 0.3,
                radius,
                height * 0.7
            ];
        }
    }["Tree.useMemo"], [
        species,
        maturityStage
    ]);
    // Gentle sway animation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "Tree.useFrame": (state)=>{
            if (meshRef.current) {
                meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.02;
            }
        }
    }["Tree.useFrame"]);
    const canopyColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](species.color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: meshRef,
        position: position,
        onClick: onClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    trunkHeight / 2,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.15 * maturityStage,
                            0.25 * maturityStage,
                            trunkHeight,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#5D4037",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            species.layer === 'canopy' ? // Palm-like with multiple cones
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    trunkHeight,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            canopyHeight * 0.3,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                                args: [
                                    canopyRadius,
                                    canopyHeight * 0.6,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/farm/FarmScene.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: canopyColor,
                                roughness: 0.7
                            }, void 0, false, {
                                fileName: "[project]/components/farm/FarmScene.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            canopyHeight * 0.5,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                                args: [
                                    canopyRadius * 0.7,
                                    canopyHeight * 0.4,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/farm/FarmScene.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: canopyColor.clone().multiplyScalar(1.1),
                                roughness: 0.7
                            }, void 0, false, {
                                fileName: "[project]/components/farm/FarmScene.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this) : species.layer === 'middle' ? // Rounded canopy
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    trunkHeight + canopyRadius,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            canopyRadius,
                            12,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: canopyColor,
                        roughness: 0.6
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this) : // Low shrub
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    trunkHeight + canopyRadius * 0.5,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            canopyRadius,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: canopyColor,
                        roughness: 0.7
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 222,
                columnNumber: 9
            }, this),
            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.1,
                    0
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ringGeometry", {
                        args: [
                            canopyRadius * 1.2,
                            canopyRadius * 1.4,
                            32
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#22c55e",
                        transparent: true,
                        opacity: 0.8
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 230,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
_s(Tree, "wabIitN8ifjXUl0YkUengVPtRIc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = Tree;
// ============================================================================
// GROUND PLANE WITH GRADIENT
// ============================================================================
function Ground({ size = 100, position = [
    0,
    0,
    0
] }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        rotation: [
            -Math.PI / 2,
            0,
            0
        ],
        position: [
            position[0],
            -0.01,
            position[2]
        ],
        receiveShadow: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                args: [
                    size,
                    size,
                    32,
                    32
                ]
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                color: "#2d4a1e",
                roughness: 1,
                metalness: 0
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_c1 = Ground;
function NutrientHeatmap({ width, depth, resolution = 32 }) {
    _s1();
    const canvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NutrientHeatmap.useMemo[canvas]": ()=>{
            const c = document.createElement('canvas');
            c.width = resolution;
            c.height = resolution;
            const ctx = c.getContext('2d');
            // Create gradient heatmap
            for(let x = 0; x < resolution; x++){
                for(let y = 0; y < resolution; y++){
                    const value = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5 + 0.5;
                    const r = Math.floor(value < 0.5 ? 255 : (1 - value) * 2 * 255);
                    const g = Math.floor(value > 0.5 ? 255 : value * 2 * 255);
                    ctx.fillStyle = `rgba(${r}, ${g}, 0, 0.5)`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
            return c;
        }
    }["NutrientHeatmap.useMemo[canvas]"], [
        resolution
    ]);
    const texture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NutrientHeatmap.useMemo[texture]": ()=>{
            const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
            tex.needsUpdate = true;
            return tex;
        }
    }["NutrientHeatmap.useMemo[texture]"], [
        canvas
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        rotation: [
            -Math.PI / 2,
            0,
            0
        ],
        position: [
            0,
            0.02,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                args: [
                    width,
                    depth
                ]
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                map: texture,
                transparent: true,
                opacity: 0.6
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
_s1(NutrientHeatmap, "fB19VWKXCu56rVUg8iqGwkytTic=");
_c2 = NutrientHeatmap;
function PlantingRowViz({ start, end, spacing, speciesId, layer }) {
    _s2();
    const species = defaultSpecies[speciesId] || defaultSpecies.coconut;
    const plants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PlantingRowViz.useMemo[plants]": ()=>{
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const length = Math.sqrt(dx * dx + dy * dy);
            const count = Math.floor(length / spacing);
            const positions = [];
            for(let i = 0; i <= count; i++){
                const t = count > 0 ? i / count : 0;
                const x = start[0] + dx * t;
                const z = start[1] + dy * t;
                positions.push([
                    x,
                    0,
                    z
                ]);
            }
            return positions;
        }
    }["PlantingRowViz.useMemo[plants]"], [
        start,
        end,
        spacing
    ]);
    const linePoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PlantingRowViz.useMemo[linePoints]": ()=>[
                [
                    start[0],
                    0.1,
                    start[1]
                ],
                [
                    end[0],
                    0.1,
                    end[1]
                ]
            ]
    }["PlantingRowViz.useMemo[linePoints]"], [
        start,
        end
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: linePoints,
                color: "#22c55e",
                lineWidth: 2
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            plants.map((pos, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tree, {
                    position: pos,
                    species: species,
                    maturityStage: 0.8 + Math.random() * 0.2
                }, i, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 344,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 338,
        columnNumber: 5
    }, this);
}
_s2(PlantingRowViz, "ERatwxOr+Pk4ICksQDBfQHVoeHQ=");
_c3 = PlantingRowViz;
function LightRays({ intensity, show = true }) {
    _s3();
    if (!show) return null;
    const rays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LightRays.useMemo[rays]": ()=>{
            const positions = [];
            for(let x = -40; x <= 40; x += 10){
                for(let z = -40; z <= 40; z += 10){
                    positions.push([
                        x,
                        50,
                        z
                    ]);
                }
            }
            return positions;
        }
    }["LightRays.useMemo[rays]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: rays.map((pos, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: pos,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.1,
                            0.5,
                            50,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#fef08a",
                        transparent: true,
                        opacity: intensity * 0.1
                    }, void 0, false, {
                        fileName: "[project]/components/farm/FarmScene.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 380,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 378,
        columnNumber: 5
    }, this);
}
_s3(LightRays, "elH2OVVbSoq3wM3evqZng8KG7/4=");
_c4 = LightRays;
function StatsOverlay({ metrics, position = [
    -45,
    30,
    -45
] }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
        position: position,
        distanceFactor: 100,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-black/80 backdrop-blur-md rounded-xl p-4 text-white min-w-[200px] border border-green-500/30",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: "text-green-400 font-bold text-sm mb-3",
                    children: "Farm Metrics"
                }, void 0, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-neutral-400",
                                    children: "Total Trees"
                                }, void 0, false, {
                                    fileName: "[project]/components/farm/FarmScene.tsx",
                                    lineNumber: 413,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono",
                                    children: metrics.trees
                                }, void 0, false, {
                                    fileName: "[project]/components/farm/FarmScene.tsx",
                                    lineNumber: 414,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/farm/FarmScene.tsx",
                            lineNumber: 412,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-neutral-400",
                                    children: "LER"
                                }, void 0, false, {
                                    fileName: "[project]/components/farm/FarmScene.tsx",
                                    lineNumber: 417,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-green-400",
                                    children: metrics.ler.toFixed(2)
                                }, void 0, false, {
                                    fileName: "[project]/components/farm/FarmScene.tsx",
                                    lineNumber: 418,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/farm/FarmScene.tsx",
                            lineNumber: 416,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-neutral-400",
                                    children: "Canopy Cover"
                                }, void 0, false, {
                                    fileName: "[project]/components/farm/FarmScene.tsx",
                                    lineNumber: 421,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono",
                                    children: [
                                        metrics.coverage,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/farm/FarmScene.tsx",
                                    lineNumber: 422,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/farm/FarmScene.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 411,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/farm/FarmScene.tsx",
            lineNumber: 409,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 408,
        columnNumber: 5
    }, this);
}
_c5 = StatsOverlay;
// ============================================================================
// CAMERA CONTROLLER
// ============================================================================
function CameraController({ target }) {
    _s4();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "CameraController.useFrame": ()=>{
            if (target) {
                camera.lookAt(target[0], target[1], target[2]);
            }
        }
    }["CameraController.useFrame"]);
    return null;
}
_s4(CameraController, "K6LkdZnP8OJ6UK0tVtTtxiafG3Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c6 = CameraController;
function FarmSceneContent({ plants = [], rows = [], showGrid = true, showNutrients = false, showLightRays = false, showStats = true, fieldSize = 100, onPlantClick, selectedPlantId, flyoverActive = false, farmBounds = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
} }) {
    _s5();
    const [flyoverComplete, setFlyoverComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const totalTrees = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FarmSceneContent.useMemo[totalTrees]": ()=>{
            let count = plants.length;
            rows.forEach({
                "FarmSceneContent.useMemo[totalTrees]": (row)=>{
                    if (!Array.isArray(row.start) || !Array.isArray(row.end) || row.spacing <= 0) {
                        return;
                    }
                    const dx = row.end[0] - row.start[0];
                    const dy = row.end[1] - row.start[1];
                    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
                        return;
                    }
                    const length = Math.sqrt(dx * dx + dy * dy);
                    count += Math.floor(length / row.spacing) + 1;
                }
            }["FarmSceneContent.useMemo[totalTrees]"]);
            return count;
        }
    }["FarmSceneContent.useMemo[totalTrees]"], [
        plants,
        rows
    ]);
    // Calculate farm center and radius for flyover
    const [farmCenter, farmRadius] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FarmSceneContent.useMemo": ()=>{
            const centerX = farmBounds.x + farmBounds.width / 2;
            const centerY = farmBounds.y + farmBounds.height / 2;
            const radius = Math.max(farmBounds.width, farmBounds.height) / 2;
            return [
                [
                    centerX,
                    0,
                    centerY
                ],
                radius
            ];
        }
    }["FarmSceneContent.useMemo"], [
        farmBounds
    ]);
    // Calculate camera position based on farm size
    const cameraPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FarmSceneContent.useMemo[cameraPosition]": ()=>{
            const size = Math.max(farmBounds.width, farmBounds.height);
            const distance = size * 1.2;
            const height = size * 0.8;
            // Position camera at an angle for better 3D perspective
            return [
                farmCenter[0] + distance * 0.7,
                height,
                farmCenter[2] + distance * 0.7
            ];
        }
    }["FarmSceneContent.useMemo[cameraPosition]"], [
        farmCenter,
        farmBounds
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$PerspectiveCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"], {
                makeDefault: true,
                position: cameraPosition,
                fov: 50,
                near: 0.1,
                far: 2000
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 528,
                columnNumber: 7
            }, this),
            flyoverActive && !flyoverComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$three$2f$FlyoverCamera$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlyoverCamera"], {
                active: true,
                farmCenter: farmCenter,
                farmRadius: farmRadius,
                onComplete: ()=>setFlyoverComplete(true)
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 538,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
                enablePan: true,
                enableZoom: true,
                enableRotate: true,
                minDistance: 10,
                maxDistance: farmRadius * 5,
                maxPolarAngle: Math.PI / 2.1,
                target: farmCenter
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 545,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                intensity: 0.6
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 557,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hemisphereLight", {
                intensity: 0.5,
                color: "#87CEEB",
                groundColor: "#3a5f0b"
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 558,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    100,
                    150,
                    50
                ],
                intensity: 1.5,
                castShadow: true,
                "shadow-mapSize-width": 2048,
                "shadow-mapSize-height": 2048,
                "shadow-camera-far": 300,
                "shadow-camera-left": -150,
                "shadow-camera-right": 150,
                "shadow-camera-top": 150,
                "shadow-camera-bottom": -150
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 559,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Sky$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sky"], {
                distance: 450000,
                sunPosition: [
                    100,
                    50,
                    100
                ],
                inclination: 0.6,
                azimuth: 0.25
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 573,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Ground, {
                size: fieldSize,
                position: farmCenter
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 581,
                columnNumber: 7
            }, this),
            showGrid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                args: [
                    fieldSize,
                    fieldSize
                ],
                cellSize: 5,
                cellThickness: 0.5,
                cellColor: "#22c55e",
                sectionSize: 10,
                sectionThickness: 1,
                sectionColor: "#15803d",
                fadeDistance: fieldSize,
                fadeStrength: 1,
                position: [
                    farmCenter[0],
                    0.01,
                    farmCenter[2]
                ]
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 585,
                columnNumber: 9
            }, this),
            showNutrients && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NutrientHeatmap, {
                width: fieldSize,
                depth: fieldSize
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 601,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LightRays, {
                intensity: 0.8,
                show: showLightRays
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 605,
                columnNumber: 7
            }, this),
            plants.filter((plant)=>{
                const x = plant?.position?.x;
                const y = plant?.position?.y;
                return Number.isFinite(x) && Number.isFinite(y);
            }).map((plant)=>{
                const { x, y } = plant.position;
                const species = getSpeciesByIdOrName(plant.speciesId, plant.layer);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tree, {
                    position: [
                        x,
                        0,
                        y
                    ],
                    species: species,
                    isSelected: plant.id === selectedPlantId,
                    onClick: ()=>onPlantClick?.(plant.id)
                }, plant.id, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 616,
                    columnNumber: 11
                }, this);
            }),
            rows.filter((row)=>{
                if (!Array.isArray(row.start) || !Array.isArray(row.end)) {
                    return false;
                }
                const [sx, sy] = row.start;
                const [ex, ey] = row.end;
                return Number.isFinite(sx) && Number.isFinite(sy) && Number.isFinite(ex) && Number.isFinite(ey) && row.spacing > 0;
            }).map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlantingRowViz, {
                    start: row.start,
                    end: row.end,
                    spacing: row.spacing,
                    speciesId: row.speciesId,
                    layer: row.layer
                }, row.id, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 636,
                    columnNumber: 9
                }, this)),
            showStats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsOverlay, {
                metrics: {
                    trees: totalTrees,
                    ler: 2.1 + Math.random() * 0.5,
                    coverage: Math.min(95, Math.floor(totalTrees * 0.8))
                },
                position: [
                    farmCenter[0] - farmRadius * 0.8,
                    farmRadius * 0.5,
                    farmCenter[2] - farmRadius * 0.8
                ]
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 648,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s5(FarmSceneContent, "c6Ox2PF1iSTsMAlJf2WtrPCALN8=");
_c7 = FarmSceneContent;
// Loading fallback
function LoadingFallback() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex items-center justify-center bg-[#0A0F0A]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 mx-auto rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 666,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-green-400 text-sm",
                    children: "Loading 3D Scene..."
                }, void 0, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 667,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/farm/FarmScene.tsx",
            lineNumber: 665,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 664,
        columnNumber: 5
    }, this);
}
_c8 = LoadingFallback;
function FarmScene(props) {
    const { className, cameraPosition, ...sceneProps } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full h-full ${className || ''}`,
        style: {
            minHeight: '400px'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingFallback, {}, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 678,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                shadows: true,
                gl: {
                    antialias: true,
                    alpha: false
                },
                camera: {
                    position: cameraPosition || [
                        50,
                        40,
                        50
                    ],
                    fov: 60
                },
                style: {
                    width: '100%',
                    height: '100%'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FarmSceneContent, {
                    ...sceneProps
                }, void 0, false, {
                    fileName: "[project]/components/farm/FarmScene.tsx",
                    lineNumber: 685,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/farm/FarmScene.tsx",
                lineNumber: 679,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/farm/FarmScene.tsx",
            lineNumber: 678,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/farm/FarmScene.tsx",
        lineNumber: 677,
        columnNumber: 5
    }, this);
}
_c9 = FarmScene;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Tree");
__turbopack_context__.k.register(_c1, "Ground");
__turbopack_context__.k.register(_c2, "NutrientHeatmap");
__turbopack_context__.k.register(_c3, "PlantingRowViz");
__turbopack_context__.k.register(_c4, "LightRays");
__turbopack_context__.k.register(_c5, "StatsOverlay");
__turbopack_context__.k.register(_c6, "CameraController");
__turbopack_context__.k.register(_c7, "FarmSceneContent");
__turbopack_context__.k.register(_c8, "LoadingFallback");
__turbopack_context__.k.register(_c9, "FarmScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/farm/FarmScene.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/farm/FarmScene.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_13cc28ae._.js.map