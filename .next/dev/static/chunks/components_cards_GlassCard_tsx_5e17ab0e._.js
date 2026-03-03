(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/cards/GlassCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlassCard",
    ()=>GlassCard,
    "GlassCardContent",
    ()=>GlassCardContent,
    "GlassCardDescription",
    ()=>GlassCardDescription,
    "GlassCardFooter",
    ()=>GlassCardFooter,
    "GlassCardHeader",
    ()=>GlassCardHeader,
    "GlassCardTitle",
    ()=>GlassCardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
/**
 * GlassCard Component
 * ===================
 * Glassmorphism card with blur, border, and gradient effects.
 */ 'use client';
;
;
;
;
const variantStyles = {
    default: 'bg-surface/80 backdrop-blur-xl border border-border-subtle',
    elevated: 'bg-surface/90 backdrop-blur-2xl border border-border-default shadow-glass',
    subtle: 'bg-surface/50 backdrop-blur-md border border-border-subtle/50',
    bordered: 'bg-surface/70 backdrop-blur-xl border-2 border-border-default'
};
const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8'
};
const glowColors = {
    primary: 'shadow-glow-soft',
    success: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
    warning: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
    error: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
    accent: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]'
};
const GlassCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ children, variant = 'default', padding = 'md', glow = false, glowColor = 'primary', hover = false, className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-2xl overflow-hidden transition-all duration-300', variantStyles[variant], paddingStyles[padding], glow && glowColors[glowColor], hover && 'hover:border-border-default hover:shadow-lg cursor-pointer', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/cards/GlassCard.tsx",
        lineNumber: 61,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = GlassCard;
GlassCard.displayName = 'GlassCard';
function GlassCardHeader({ children, className, actions }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center justify-between mb-4', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/cards/GlassCard.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: actions
            }, void 0, false, {
                fileName: "[project]/components/cards/GlassCard.tsx",
                lineNumber: 94,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cards/GlassCard.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c2 = GlassCardHeader;
function GlassCardTitle({ children, icon, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-lg font-semibold text-text-primary', className),
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-primary-400",
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/cards/GlassCard.tsx",
                lineNumber: 111,
                columnNumber: 16
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/cards/GlassCard.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
_c3 = GlassCardTitle;
function GlassCardDescription({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm text-text-secondary mt-1', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/components/cards/GlassCard.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_c4 = GlassCardDescription;
function GlassCardContent({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/components/cards/GlassCard.tsx",
        lineNumber: 142,
        columnNumber: 10
    }, this);
}
_c5 = GlassCardContent;
function GlassCardFooter({ children, className, bordered = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-4 pt-4 flex items-center justify-between', bordered && 'border-t border-border-subtle', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/components/cards/GlassCard.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
_c6 = GlassCardFooter;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "GlassCard$forwardRef");
__turbopack_context__.k.register(_c1, "GlassCard");
__turbopack_context__.k.register(_c2, "GlassCardHeader");
__turbopack_context__.k.register(_c3, "GlassCardTitle");
__turbopack_context__.k.register(_c4, "GlassCardDescription");
__turbopack_context__.k.register(_c5, "GlassCardContent");
__turbopack_context__.k.register(_c6, "GlassCardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_cards_GlassCard_tsx_5e17ab0e._.js.map