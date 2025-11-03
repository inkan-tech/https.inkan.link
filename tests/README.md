# Playwright Testing Suite for Hugo Site

This directory contains comprehensive browser automation tests for visual regression, console monitoring, accessibility, and screenshot capture.

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install
```

## Available Test Commands

### Visual Testing
```bash
# Run visual regression tests
npm run test:visual

# Update visual snapshots
npm run test:update
```

### Console Monitoring
```bash
# Check for console errors and warnings
npm run test:console
```

### Accessibility Testing
```bash
# Run WCAG compliance tests
npm run test:a11y
```

### Screenshot Capture
```bash
# Capture screenshots for analysis
npm run test:screenshots
```

### Combined Testing
```bash
# Run all tests
npm run test:all

# Interactive UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

## Test Structure

- **visual/** - Visual regression tests comparing against baseline screenshots
- **console-monitor.spec.js** - Monitors console errors, warnings, and performance
- **accessibility.spec.js** - WCAG 2.1 AA compliance testing
- **screenshot-capture.spec.js** - Captures screenshots for Claude Code analysis

## Screenshot Analysis Workflow

1. Run screenshot capture:
   ```bash
   npm run test:screenshots
   ```

2. Screenshots are saved in `tests/screenshots/session-[timestamp]/`

3. Share screenshots with Claude Code for visual analysis:
   - Design consistency review
   - Typography and spacing analysis
   - Color contrast verification
   - Mobile responsiveness check

## Visual Regression Testing

The visual tests create baseline screenshots on first run. Subsequent runs compare against these baselines:

- Blog homepage (light/dark modes)
- Individual blog posts
- Mobile views
- Interactive states

To update baselines after intentional design changes:
```bash
npm run test:update
```

## Console Error Monitoring

The console monitor checks for:
- JavaScript errors
- Failed resource loads
- Mixed content warnings
- Performance metrics

## Accessibility Testing

Tests include:
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- ARIA labels and roles
- Color contrast
- Touch target sizes on mobile

## Configuration

See `playwright.config.js` for test configuration including:
- Multiple browser testing (Chrome, Firefox, Safari)
- Mobile device emulation
- Automatic Hugo server startup
- Test retries and timeouts