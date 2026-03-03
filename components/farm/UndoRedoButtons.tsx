/**
 * Undo/Redo Toolbar Buttons Component
 */

interface UndoRedoButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  onUndo: () => void;
  onRedo: () => void;
}

export function UndoRedoButtons({
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  onUndo,
  onRedo,
}: UndoRedoButtonsProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md border border-gray-200">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
          canUndo
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title={`Undo (Ctrl+Z) — ${undoCount} steps`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Undo
        {undoCount > 0 && <span className="text-xs opacity-70">({undoCount})</span>}
      </button>
      
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
          canRedo
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title={`Redo (Ctrl+Y) — ${redoCount} steps`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
        Redo
        {redoCount > 0 && <span className="text-xs opacity-70">({redoCount})</span>}
      </button>
      
      <div className="ml-2 text-xs text-gray-500 border-l pl-3">
        Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+Z</kbd> / <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+Y</kbd>
      </div>
    </div>
  );
}
