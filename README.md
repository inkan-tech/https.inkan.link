# Inkan.link Website

This repository contains the Hugo-based website for Inkan.link.

## Building and Running

Run the development server with:

```bash
npm start
```

This will start Hugo server in watch mode and compile Tailwind CSS.

## Testing

The project includes unit tests for UI components, accessibility, and JavaScript functionality. Tests are implemented using Jest, Testing Library, and jest-axe for accessibility testing.

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode (useful during development):

```bash
npm run test:watch
```

Generate a coverage report:

```bash
npm run test:coverage
```

View the coverage report in `coverage/lcov-report/index.html`.

### Test Structure

- `__tests__/components/` - Component tests
  - `navigation.test.js` - Tests for navigation menu
  - `darkmode.test.js` - Tests for dark mode toggle functionality
- `__tests__/accessibility/` - Accessibility tests
  - `a11y.test.js` - Tests for WCAG compliance and accessibility features

### Adding New Tests

1. Create a new test file in the appropriate directory
2. Import required testing utilities:
   ```javascript
   const { screen, fireEvent } = require('@testing-library/dom');
   require('@testing-library/jest-dom');
   ```
3. For accessibility tests, also import:
   ```javascript
   const { configureAxe, toHaveNoViolations } = require('jest-axe');
   ```
4. Write your test following the Jest format

### Mocks

Mock files are located in `__mocks__/`:
- `styleMock.js` - Mock for CSS imports
- `fileMock.js` - Mock for image/asset imports

## Deployment

The site is deployed via GitHub Actions. The workflow:
1. Runs all tests
2. Builds the site with Hugo and Tailwind CSS
3. Deploys to GitHub Pages

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
