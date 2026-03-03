/**
 * Undo/Redo System
 * Manages state history with Ctrl+Z and Ctrl+Y support
 */

import { useReducer, useEffect, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

type HistoryAction<T> = 
  | { type: 'SET'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; payload: T };

function historyReducer<T>(
  state: HistoryState<T>,
  action: HistoryAction<T>
): HistoryState<T> {
  switch (action.type) {
    case 'SET': {
      // Add current state to past and update present
      const newPast = [...state.past, state.present].slice(-50); // Keep last 50
      return {
        past: newPast,
        present: action.payload,
        future: [],
      };
    }
    
    case 'UNDO': {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    
    case 'REDO': {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    
    case 'RESET': {
      return {
        past: [],
        present: action.payload,
        future: [],
      };
    }
    
    default:
      return state;
  }
}

export function useUndoRedo<T>(initialState: T) {
  const [state, dispatch] = useReducer(historyReducer<T>, {
    past: [],
    present: initialState,
    future: [],
  });
  
  const set = useCallback((newState: T) => {
    dispatch({ type: 'SET', payload: newState });
  }, []);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const reset = useCallback((newState: T) => {
    dispatch({ type: 'RESET', payload: newState });
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
  
  return {
    state: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undoCount: state.past.length,
    redoCount: state.future.length,
  };
}

