import { 
  PRODUCT_TOUR_STEPS, 
  isTourCompleted, 
  markTourCompleted, 
  resetTourState 
} from "../productTour";

// Mock localStorage for Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, "window", {
  value: { localStorage: localStorageMock },
  writable: true
});
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true
});

describe("productTour module", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should contain 6 structured tour steps", () => {
    expect(PRODUCT_TOUR_STEPS.length).toBe(6);
    expect(PRODUCT_TOUR_STEPS[0].targetElementId).toBe("#aws-account-selector");
    expect(PRODUCT_TOUR_STEPS[5].targetElementId).toBe("#webhook-simulator-card");
  });

  it("should correctly handle tour completed state in localStorage", () => {
    expect(isTourCompleted()).toBe(false);
    
    markTourCompleted();
    expect(isTourCompleted()).toBe(true);

    resetTourState();
    expect(isTourCompleted()).toBe(false);
  });

  it("should have valid target selectors and badge text for each tour step", () => {
    PRODUCT_TOUR_STEPS.forEach((step) => {
      expect(step.id).toBeGreaterThan(0);
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.targetElementId.startsWith("#")).toBe(true);
      expect(step.badgeText.length).toBeGreaterThan(0);
    });
  });
});
