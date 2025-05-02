// Import jest-dom utilities
require('@testing-library/jest-dom');

// Setup any global configuration or mocks
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Create a mock for localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Alpine.js
global.Alpine = {
  store: jest.fn(),
  data: jest.fn()
};
