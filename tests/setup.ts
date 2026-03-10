import '@testing-library/jest-dom';

// ResizeObserver is not available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// HTMLCanvasElement.getContext returns null in jsdom, which causes WebGL errors.
// Provide a minimal stub so Three.js / @react-three/fiber don't throw on import.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function () {
    return null;
  };
}
