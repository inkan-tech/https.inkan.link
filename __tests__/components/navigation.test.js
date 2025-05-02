const { screen, fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

// Mock the document body with our navigation component HTML
describe('Navigation Menu', () => {
  beforeEach(() => {
    // Setup the navigation menu HTML
    document.body.innerHTML = `
      <div class="top-0 z-50 w-full text-white bg-primary-900 border-b-2 border-primary-700 md:sticky shadow-lg">
        <div>
          <nav>
            <div class="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 md:ml-4 hover:text-white focus:text-white hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:shadow-outline transition-colors duration-200">
              <a href="https://sealf.ie/" class="nav-link">Produit</a>
            </div>
            <div>
              <button id="articles-button" class="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-white text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 md:ml-4 hover:text-white focus:text-white hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:shadow-outline transition-colors duration-200">
                <span>Articles</span>
              </button>
            </div>
            <div>
              <button id="languages-button" class="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-white text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 md:ml-4 hover:text-white focus:text-white hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:shadow-outline transition-colors duration-200">
                <span>Languages</span>
              </button>
            </div>
            <div>
              <button id="about-button" class="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-white text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 md:ml-4 hover:text-white focus:text-white hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:shadow-outline transition-colors duration-200">
                <span>A propos</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    `;
  });

  test('navigation menu should be present', () => {
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  test('all navigation buttons should have the same hover/focus classes', () => {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
      // Check for hover classes
      expect(button.classList.contains('hover:text-white')).toBeTruthy();
      expect(button.classList.contains('hover:bg-primary-600')).toBeTruthy();
      
      // Check for focus classes
      expect(button.classList.contains('focus:text-white')).toBeTruthy();
      expect(button.classList.contains('focus:bg-primary-600')).toBeTruthy();
      expect(button.classList.contains('focus:outline-none')).toBeTruthy();
      expect(button.classList.contains('focus:shadow-outline')).toBeTruthy();
      
      // Check for transition classes
      expect(button.classList.contains('transition-colors')).toBeTruthy();
    });
  });

  test('product link should have proper styling', () => {
    const productLink = document.querySelector('a[href="https://sealf.ie/"]');
    
    expect(productLink.parentElement.classList.contains('hover:text-white')).toBeTruthy();
    expect(productLink.parentElement.classList.contains('hover:bg-primary-600')).toBeTruthy();
    expect(productLink.parentElement.classList.contains('focus:text-white')).toBeTruthy();
    expect(productLink.parentElement.classList.contains('focus:bg-primary-600')).toBeTruthy();
  });
});
