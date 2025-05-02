irequire('@testing-library/jest-dom');
const { fireEvent } = require('@testing-library/dom');

describe('Dark Mode Toggle', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Setup the DOM
    document.body.innerHTML = `
      <button id="theme-toggle" type="button">
        <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5"></svg>
        <svg id="theme-toggle-light-icon" class="hidden w-5 h-5"></svg>
      </button>
    `;
    
    // Reset document classes
    document.documentElement.classList.remove('dark');
    
    // Load the darkmode.js file dynamically
    jest.isolateModules(() => {
      require('../../assets/js/darkmode.js');
    });
  });
  
  test('should default to light mode when no preference is set', () => {
    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
    expect(document.getElementById('theme-toggle-dark-icon').classList.contains('hidden')).toBeFalsy();
    expect(document.getElementById('theme-toggle-light-icon').classList.contains('hidden')).toBeTruthy();
  });
  
  test('should toggle to dark mode when clicked in light mode', () => {
    const button = document.getElementById('theme-toggle');
    
    // Initial state is light
    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
    
    // Click the button to toggle to dark
    fireEvent.click(button);
    
    // Check if dark mode is enabled
    expect(document.documentElement.classList.contains('dark')).toBeTruthy();
    expect(localStorage.getItem('color-theme')).toBe('dark');
    expect(document.getElementById('theme-toggle-dark-icon').classList.contains('hidden')).toBeTruthy();
    expect(document.getElementById('theme-toggle-light-icon').classList.contains('hidden')).toBeFalsy();
  });
  
  test('should toggle back to light mode when clicked in dark mode', () => {
    // Set initial state to dark
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
    document.getElementById('theme-toggle-dark-icon').classList.add('hidden');
    document.getElementById('theme-toggle-light-icon').classList.remove('hidden');
    
    const button = document.getElementById('theme-toggle');
    
    // Click the button to toggle back to light
    fireEvent.click(button);
    
    // Check if light mode is enabled
    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
    expect(localStorage.getItem('color-theme')).toBe('light');
    expect(document.getElementById('theme-toggle-dark-icon').classList.contains('hidden')).toBeFalsy();
    expect(document.getElementById('theme-toggle-light-icon').classList.contains('hidden')).toBeTruthy();
  });
  
  test('should respect system preference for dark mode', () => {
    // Mock the window.matchMedia to simulate dark mode preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true, // Simulate dark mode preference
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
    
    // Reset the DOM and reload the script to pick up the new matchMedia
    document.body.innerHTML = `
      <button id="theme-toggle" type="button">
        <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5"></svg>
        <svg id="theme-toggle-light-icon" class="hidden w-5 h-5"></svg>
      </button>
    `;
    
    // Reload the script
    jest.isolateModules(() => {
      require('../../assets/js/darkmode.js');
    });
    
    // Initial state should use system preference (dark)
    expect(document.getElementById('theme-toggle-light-icon').classList.contains('hidden')).toBeFalsy();
  });
});
