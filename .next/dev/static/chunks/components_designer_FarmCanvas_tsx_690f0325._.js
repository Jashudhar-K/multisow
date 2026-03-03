(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/designer/FarmCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
'use client';
;
;
// Dynamic import for 3D scene (R3F)
const FarmScene = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/farm/FarmScene.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/farm/FarmScene.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = FarmScene;
// Main FarmCanvas - 3D Only
const FarmCanvas = ({ plants, rows, visibleLayers, flyoverActive = false, farmBounds = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
}, onPlantClick, selectedPlantId })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full bg-[#0A0F0A] rounded-2xl overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FarmScene, {
            plants: plants.filter((p)=>visibleLayers.includes(p.layer)),
            rows: rows.filter((r)=>visibleLayers.includes(r.layer)),
            showGrid: true,
            showStats: true,
            fieldSize: Math.max(farmBounds.width, farmBounds.height),
            flyoverActive: flyoverActive,
            farmBounds: farmBounds,
            onPlantClick: onPlantClick,
            selectedPlantId: selectedPlantId
        }, void 0, false, {
            fileName: "[project]/components/designer/FarmCanvas.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/designer/FarmCanvas.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = FarmCanvas;
const __TURBOPACK__default__export__ = FarmCanvas;
var _c, _c1;
__turbopack_context__.k.register(_c, "FarmScene");
__turbopack_context__.k.register(_c1, "FarmCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/designer/FarmCanvas.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/designer/FarmCanvas.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_designer_FarmCanvas_tsx_690f0325._.js.map