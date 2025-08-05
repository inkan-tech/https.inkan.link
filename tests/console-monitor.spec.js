import { test, expect } from '@playwright/test';

test.describe('Console Error Monitoring', () => {
  const consoleMessages = [];
  const pageErrors = [];

  test.beforeEach(async ({ page }) => {
    // Clear arrays
    consoleMessages.length = 0;
    pageErrors.length = 0;

    // Monitor console messages
    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
      });
    });

    // Monitor page errors
    page.on('pageerror', (error) => {
      pageErrors.push({
        message: error.message,
        stack: error.stack,
      });
    });

    // Monitor failed requests
    page.on('requestfailed', (request) => {
      consoleMessages.push({
        type: 'error',
        text: `Request failed: ${request.url()} - ${request.failure()?.errorText}`,
      });
    });
  });

  test.afterEach(async () => {
    // Report console errors
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    if (errors.length > 0) {
      console.log('Console Errors Found:', errors);
    }

    // Report page errors
    if (pageErrors.length > 0) {
      console.log('Page Errors Found:', pageErrors);
    }
  });

  test('homepage console check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for console errors
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    expect(errors).toHaveLength(0);

    // Check for page errors
    expect(pageErrors).toHaveLength(0);

    // Check for warnings (optional)
    const warnings = consoleMessages.filter(msg => msg.type === 'warning');
    console.log(`Found ${warnings.length} warnings`);
  });

  test('blog pages console check', async ({ page }) => {
    const blogUrls = [
      '/posts/',
      '/posts/blog-fraude-au-pdg-5milliards-an/',
      '/posts/news-inpho-venture-2024/',
    ];

    for (const url of blogUrls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const errors = consoleMessages.filter(msg => msg.type === 'error');
      expect(errors, `Console errors on ${url}`).toHaveLength(0);
    }
  });

  test('check JavaScript functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check dark mode toggle works without errors
    const darkModeToggle = page.locator('[x-data*="darkMode"]').first();
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      
      // Check no errors after toggle
      const errors = consoleMessages.filter(msg => msg.type === 'error');
      expect(errors).toHaveLength(0);
      
      // Verify dark mode applied
      const isDark = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      expect(isDark).toBeTruthy();
    }
  });

  test('check resource loading', async ({ page }) => {
    const failedResources = [];
    
    page.on('response', (response) => {
      if (!response.ok() && response.status() !== 304) {
        failedResources.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');

    // Check no resources failed to load
    expect(failedResources, 'Failed resources').toHaveLength(0);
    
    // Check CSS loaded properly
    const bgColor = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have a background color
  });

  test('check for mixed content warnings', async ({ page }) => {
    await page.goto('/');
    
    // Check for mixed content warnings
    const mixedContentWarnings = consoleMessages.filter(msg => 
      msg.text.toLowerCase().includes('mixed content')
    );
    expect(mixedContentWarnings).toHaveLength(0);
  });

  test('performance metrics', async ({ page }) => {
    await page.goto('/posts/');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });
    
    console.log('Performance Metrics:', metrics);
    
    // Basic performance assertions (adjust thresholds as needed)
    expect(metrics.totalTime).toBeLessThan(5000); // Page loads in under 5 seconds
  });
});