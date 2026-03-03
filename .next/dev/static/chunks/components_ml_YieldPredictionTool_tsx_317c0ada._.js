(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ml/YieldPredictionTool.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>YieldPredictionTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/leaf.js [app-client] (ecmascript) <export default as Leaf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================================
// LAYER DEFAULTS
// ============================================================================
const LAYER_DEFAULTS = {
    canopy: {
        crop_species: 'coconut',
        LAI: 4.5,
        k_coeff: 0.5,
        row_spacing_m: 8.0,
        root_depth_cm: 200,
        root_radius_cm: 150,
        canopy_height_m: 20.0,
        shade_fraction: 0.0
    },
    middle: {
        crop_species: 'banana',
        LAI: 3.5,
        k_coeff: 0.65,
        row_spacing_m: 3.0,
        root_depth_cm: 60,
        root_radius_cm: 80,
        canopy_height_m: 4.0,
        shade_fraction: 0.3
    },
    understory: {
        crop_species: 'turmeric',
        LAI: 2.5,
        k_coeff: 0.4,
        row_spacing_m: 0.5,
        root_depth_cm: 30,
        root_radius_cm: 20,
        canopy_height_m: 0.8,
        shade_fraction: 0.5
    },
    belowground: {
        crop_species: 'ginger',
        LAI: 1.5,
        k_coeff: 0.3,
        row_spacing_m: 0.3,
        root_depth_cm: 25,
        root_radius_cm: 15,
        canopy_height_m: 0.5,
        shade_fraction: 0.6
    }
};
function makeDefault(layer) {
    const d = LAYER_DEFAULTS[layer] ?? {};
    return {
        layer: layer,
        crop_species: d.crop_species ?? '',
        LAI: d.LAI ?? 3.0,
        k_coeff: d.k_coeff ?? 0.5,
        row_spacing_m: d.row_spacing_m ?? 2.0,
        soil_N: 200,
        soil_P: 25,
        soil_K: 150,
        soil_pH: 6.5,
        VWC: 0.3,
        GDD: 3000,
        rainfall_7d: 50,
        solar_elevation_deg: 45,
        root_depth_cm: d.root_depth_cm ?? 50,
        root_radius_cm: d.root_radius_cm ?? 30,
        canopy_height_m: d.canopy_height_m ?? 5.0,
        path_width_m: 1.0,
        crop_density: 0.5,
        shade_fraction: d.shade_fraction ?? 0.0,
        root_length_density: 1.0
    };
}
// ============================================================================
// LAYER COLORS
// ============================================================================
const LAYER_COLORS = {
    canopy: {
        text: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30'
    },
    middle: {
        text: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30'
    },
    understory: {
        text: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30'
    },
    belowground: {
        text: 'text-amber-600',
        bg: 'bg-amber-600/10',
        border: 'border-amber-600/30'
    }
};
// ============================================================================
// SUB-COMPONENTS
// ============================================================================
function LayerInputCard({ data, onChange, onRemove, expanded, onToggle }) {
    const c = LAYER_COLORS[data.layer] ?? LAYER_COLORS.canopy;
    const upd = (key, val)=>onChange({
            ...data,
            [key]: typeof val === 'string' ? val : Number(val)
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        layout: true,
        className: `glass border ${c.border} rounded-xl overflow-hidden`,
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between w-full px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggle,
                        className: "flex items-center justify-between flex-1 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                        className: `w-4 h-4 ${c.text}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                        lineNumber: 182,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `font-semibold capitalize ${c.text}`,
                                        children: data.layer
                                    }, void 0, false, {
                                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-neutral-400 text-sm",
                                        children: [
                                            "— ",
                                            data.crop_species || 'no crop'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                className: "w-4 h-4 text-neutral-400"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 186,
                                columnNumber: 23
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "w-4 h-4 text-neutral-400"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 186,
                                columnNumber: 76
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onRemove,
                        className: "text-red-400 text-xs hover:text-red-300 px-2 py-1 rounded ml-2",
                        children: "Remove"
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        height: 0,
                        opacity: 0
                    },
                    animate: {
                        height: 'auto',
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0
                    },
                    className: "px-4 pb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Crop Species",
                                value: data.crop_species,
                                onChange: (v)=>upd('crop_species', v),
                                type: "text"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 205,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "LAI",
                                value: data.LAI,
                                onChange: (v)=>upd('LAI', v),
                                step: 0.1,
                                min: 0,
                                max: 10
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 206,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "k Coeff",
                                value: data.k_coeff,
                                onChange: (v)=>upd('k_coeff', v),
                                step: 0.05,
                                min: 0.2,
                                max: 0.8
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 207,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Row Spacing (m)",
                                value: data.row_spacing_m,
                                onChange: (v)=>upd('row_spacing_m', v),
                                step: 0.1,
                                min: 0.3,
                                max: 10
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 208,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Soil N (mg/kg)",
                                value: data.soil_N,
                                onChange: (v)=>upd('soil_N', v),
                                min: 0
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 209,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Soil P (mg/kg)",
                                value: data.soil_P,
                                onChange: (v)=>upd('soil_P', v),
                                min: 0
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 210,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Soil K (cmol/kg)",
                                value: data.soil_K,
                                onChange: (v)=>upd('soil_K', v),
                                min: 0
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Soil pH",
                                value: data.soil_pH,
                                onChange: (v)=>upd('soil_pH', v),
                                step: 0.1,
                                min: 3,
                                max: 11
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 212,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "VWC",
                                value: data.VWC,
                                onChange: (v)=>upd('VWC', v),
                                step: 0.01,
                                min: 0,
                                max: 0.6
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 213,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "GDD",
                                value: data.GDD,
                                onChange: (v)=>upd('GDD', v),
                                min: 0
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Rainfall 7d (mm)",
                                value: data.rainfall_7d,
                                onChange: (v)=>upd('rainfall_7d', v),
                                min: 0
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 215,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Solar Elev (°)",
                                value: data.solar_elevation_deg,
                                onChange: (v)=>upd('solar_elevation_deg', v),
                                min: 0,
                                max: 90
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 216,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Root Depth (cm)",
                                value: data.root_depth_cm,
                                onChange: (v)=>upd('root_depth_cm', v),
                                min: 1,
                                max: 300
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 217,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Root Radius (cm)",
                                value: data.root_radius_cm,
                                onChange: (v)=>upd('root_radius_cm', v),
                                min: 1,
                                max: 300
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 218,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Canopy Ht (m)",
                                value: data.canopy_height_m,
                                onChange: (v)=>upd('canopy_height_m', v),
                                step: 0.1,
                                min: 0.1,
                                max: 30
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 219,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Path Width (m)",
                                value: data.path_width_m,
                                onChange: (v)=>upd('path_width_m', v),
                                step: 0.1,
                                min: 0.1,
                                max: 10
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 220,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Crop Density",
                                value: data.crop_density,
                                onChange: (v)=>upd('crop_density', v),
                                step: 0.05,
                                min: 0,
                                max: 1
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Shade Fraction",
                                value: data.shade_fraction,
                                onChange: (v)=>upd('shade_fraction', v),
                                step: 0.05,
                                min: 0,
                                max: 1
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 222,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 204,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                    lineNumber: 198,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_c = LayerInputCard;
function Field({ label, value, onChange, type = 'number', step, min, max }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-xs text-neutral-400 mb-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: type,
                value: value,
                onChange: (e)=>onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value),
                step: step,
                min: min,
                max: max,
                title: label,
                placeholder: label,
                className: "w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-green-500/50 focus:outline-none transition"
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 249,
        columnNumber: 5
    }, this);
}
_c1 = Field;
// Results components
function ShapMiniChart({ features }) {
    if (!features.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-neutral-500 text-xs",
        children: "No SHAP data"
    }, void 0, false, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 269,
        columnNumber: 32
    }, this);
    const maxAbs = Math.max(...features.map((f)=>Math.abs(f.shap_value)), 0.01);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5 mt-2",
        children: features.map((f, i)=>{
            const pct = Math.abs(f.shap_value) / maxAbs * 100;
            const positive = f.shap_value >= 0;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-28 text-neutral-400 truncate text-right",
                        title: f.feature,
                        children: f.feature
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 278,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-3 rounded ${positive ? 'bg-green-500' : 'bg-red-500'}`,
                            style: {
                                width: `${Math.max(pct, 4)}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                            lineNumber: 280,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 279,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `w-14 text-right ${positive ? 'text-green-400' : 'text-red-400'}`,
                        children: [
                            f.shap_value > 0 ? '+' : '',
                            f.shap_value.toFixed(3)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 285,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 277,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 272,
        columnNumber: 5
    }, this);
}
_c2 = ShapMiniChart;
function FISScores({ scores }) {
    const entries = Object.entries(scores);
    if (!entries.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-neutral-500 text-xs",
        children: "No FIS data"
    }, void 0, false, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 297,
        columnNumber: 31
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-2 mt-2",
        children: entries.map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-2 py-1 rounded bg-white/5 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-neutral-400 truncate",
                        title: k,
                        children: k.replace(/_/g, ' ')
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 302,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: v > 0.6 ? 'text-red-400 font-semibold' : v > 0.3 ? 'text-yellow-400' : 'text-green-400',
                        children: v.toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this)
                ]
            }, k, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 301,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 299,
        columnNumber: 5
    }, this);
}
_c3 = FISScores;
function LayerResultCard({ layerName, pred, onExplain }) {
    _s();
    const c = LAYER_COLORS[layerName] ?? LAYER_COLORS.canopy;
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overview');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `glass border ${c.border} rounded-xl p-4`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: `font-semibold capitalize ${c.text}`,
                        children: [
                            layerName,
                            " Layer"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this),
                    onExplain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onExplain(layerName),
                        className: "text-xs text-green-400 hover:text-green-300 underline",
                        children: "Explain →"
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 326,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-3xl font-bold text-white",
                        children: pred.predicted_yield_t_ha
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-neutral-400",
                        children: "t/ha predicted yield"
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-neutral-500 mt-1",
                        children: [
                            "80% CI: [",
                            pred.ci_80_low,
                            " — ",
                            pred.ci_80_high,
                            "]"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 border-b border-white/10 mb-3",
                children: [
                    'overview',
                    'shap',
                    'fis'
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(t),
                        className: `text-xs px-3 py-1.5 capitalize ${tab === t ? 'text-green-400 border-b-2 border-green-400' : 'text-neutral-400 hover:text-neutral-200'}`,
                        children: t === 'fis' ? 'FIS Stress' : t
                    }, t, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 350,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            tab === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs space-y-1 text-neutral-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Weights used"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 365,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white",
                                children: [
                                    "[",
                                    pred.weights_used.map((w)=>w.toFixed(2)).join(', '),
                                    "]"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "SHAP features"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white",
                                children: pred.top_shap_features.length
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 370,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 368,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "FIS scores"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white",
                                children: Object.keys(pred.fis_stress_scores).length
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 374,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 363,
                columnNumber: 9
            }, this),
            tab === 'shap' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShapMiniChart, {
                features: pred.top_shap_features
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 378,
                columnNumber: 26
            }, this),
            tab === 'fis' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FISScores, {
                scores: pred.fis_stress_scores
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 379,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 325,
        columnNumber: 5
    }, this);
}
_s(LayerResultCard, "nIsn5bCYYbpVG2fHLShQtfpQ2pQ=");
_c4 = LayerResultCard;
function YieldPredictionTool({ onExplain }) {
    _s1();
    const [farmId, setFarmId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('farm-001');
    const [layers, setLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        makeDefault('canopy'),
        makeDefault('middle'),
        makeDefault('understory')
    ]);
    const [expandedIdx, setExpandedIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const addLayer = (layer)=>{
        if (layers.some((l)=>l.layer === layer)) return;
        setLayers([
            ...layers,
            makeDefault(layer)
        ]);
        setExpandedIdx(layers.length);
    };
    const removeLayer = (idx)=>{
        setLayers(layers.filter((_, i)=>i !== idx));
        setExpandedIdx(null);
    };
    const handlePredict = async ()=>{
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await fetch('/ml/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    farm_id: farmId,
                    layers
                })
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.detail || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err.message ?? 'Prediction failed');
        } finally{
            setLoading(false);
        }
    };
    const unusedLayers = [
        'canopy',
        'middle',
        'understory',
        'belowground'
    ].filter((l)=>!layers.some((ld)=>ld.layer === l));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-white flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "w-5 h-5 text-green-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                        lineNumber: 448,
                                        columnNumber: 13
                                    }, this),
                                    "Yield Prediction"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-neutral-400 mt-1",
                                children: "Run FOHEM prediction for multi-layer intercropping — per-layer yield, confidence intervals, SHAP, and FIS."
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 451,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 446,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs text-neutral-400 block mb-1",
                                children: "Farm ID"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: farmId,
                                onChange: (e)=>setFarmId(e.target.value),
                                title: "Farm ID",
                                placeholder: "Enter farm ID",
                                className: "px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-green-500/50 focus:outline-none"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 457,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: layers.map((ld, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LayerInputCard, {
                        data: ld,
                        onChange: (d)=>{
                            const next = [
                                ...layers
                            ];
                            next[i] = d;
                            setLayers(next);
                        },
                        onRemove: ()=>removeLayer(i),
                        expanded: expandedIdx === i,
                        onToggle: ()=>setExpandedIdx(expandedIdx === i ? null : i)
                    }, ld.layer, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 470,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 468,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                    unusedLayers.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>addLayer(l),
                            className: "text-xs px-3 py-1.5 border border-dashed border-white/20 rounded-lg text-neutral-400 hover:text-green-400 hover:border-green-400/40 transition capitalize",
                            children: [
                                "+ ",
                                l
                            ]
                        }, l, true, {
                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                            lineNumber: 488,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handlePredict,
                            disabled: loading || layers.length === 0,
                            className: "px-6 py-2.5 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2",
                            children: [
                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-4 h-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 502,
                                    columnNumber: 24
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 502,
                                    columnNumber: 71
                                }, this),
                                loading ? 'Predicting…' : 'Run Prediction'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                            lineNumber: 497,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 496,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 486,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-5 h-5 text-red-400 mt-0.5"
                    }, void 0, false, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 511,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 font-medium text-sm",
                                children: "Prediction Failed"
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 513,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-neutral-400 text-xs mt-1",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                lineNumber: 514,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                        lineNumber: 512,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 510,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass rounded-xl p-5 border border-green-500/20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-6 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-neutral-400",
                                                    children: "System LER"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                                    lineNumber: 532,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-2xl font-bold ${result.system_LER >= 1 ? 'text-green-400' : 'text-red-400'}`,
                                                    children: result.system_LER
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                            lineNumber: 531,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-neutral-400",
                                                    children: "Model"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-white",
                                                    children: result.model_version
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                            lineNumber: 537,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-neutral-400",
                                                    children: "Prediction ID"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                                    lineNumber: 542,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-white font-mono",
                                                    children: [
                                                        result.prediction_id.slice(0, 8),
                                                        "…"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                            lineNumber: 541,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 530,
                                    columnNumber: 15
                                }, this),
                                result.optimal_geometry_recommendation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-neutral-300 flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
                                            className: "w-4 h-4 text-green-400 mt-0.5 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                            lineNumber: 548,
                                            columnNumber: 19
                                        }, this),
                                        result.optimal_geometry_recommendation
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 547,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                            lineNumber: 529,
                            columnNumber: 13
                        }, this),
                        result.nlp_explanation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass border border-cyan-500/20 rounded-xl p-5 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                            lineNumber: 558,
                                            columnNumber: 19
                                        }, this),
                                        "AI Summary"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 557,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-neutral-200 leading-relaxed",
                                    children: result.nlp_explanation
                                }, void 0, false, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 561,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                            lineNumber: 556,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                            children: Object.entries(result.layers).map(([name, pred])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LayerResultCard, {
                                    layerName: name,
                                    pred: pred,
                                    onExplain: onExplain ? (layer)=>onExplain(result.prediction_id, layer) : undefined
                                }, name, false, {
                                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                                    lineNumber: 568,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                            lineNumber: 566,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                    lineNumber: 522,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ml/YieldPredictionTool.tsx",
                lineNumber: 520,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ml/YieldPredictionTool.tsx",
        lineNumber: 443,
        columnNumber: 5
    }, this);
}
_s1(YieldPredictionTool, "tjQjKOsOLgKrBAX2EqVMIJ/qPyM=");
_c5 = YieldPredictionTool;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "LayerInputCard");
__turbopack_context__.k.register(_c1, "Field");
__turbopack_context__.k.register(_c2, "ShapMiniChart");
__turbopack_context__.k.register(_c3, "FISScores");
__turbopack_context__.k.register(_c4, "LayerResultCard");
__turbopack_context__.k.register(_c5, "YieldPredictionTool");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ml/YieldPredictionTool.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/ml/YieldPredictionTool.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_ml_YieldPredictionTool_tsx_317c0ada._.js.map