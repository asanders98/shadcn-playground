import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement these browser APIs that Radix primitives rely on.
// The shell mounts Sidebar / Select / Tooltip / Slider / Sheet, all of which
// touch one of these — polyfill them so render-smoke tests can mount the app.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Radix Select/Tooltip use pointer-capture + scrollIntoView in jsdom.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
