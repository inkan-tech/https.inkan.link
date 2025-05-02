const { configureAxe, toHaveNoViolations } = require('jest-axe');
require('@testing-library/jest-dom');

// Add the custom matcher
expect.extend(toHaveNoViolations);

// Configure axe for testing
const axe = configureAxe({
  rules: {
    // Include specific rules or disable some
    'color-contrast': { enabled: true }
  }
});

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Setup the navigation menu HTML for testing
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

  test('Navigation menu should not have accessibility violations', async () => {
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  test('Navigation buttons should have accessible text', () => {
    const articlesButton = document.getElementById('articles-button');
    const languagesButton = document.getElementById('languages-button');
    const aboutButton = document.getElementById('about-button');
    
    expect(articlesButton).toHaveTextContent('Articles');
    expect(languagesButton).toHaveTextContent('Languages');
    expect(aboutButton).toHaveTextContent('A propos');
  });

  test('Focus states should be visible for keyboard navigation', () => {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
      // Check that focus styles are applied
      expect(button.classList.contains('focus:outline-none')).toBeTruthy();
      expect(button.classList.contains('focus:shadow-outline')).toBeTruthy();
      expect(button.classList.contains('focus:bg-primary-600')).toBeTruthy();
      expect(button.classList.contains('focus:text-white')).toBeTruthy();
    });
  });
});
