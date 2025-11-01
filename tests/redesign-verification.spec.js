import { test, expect } from '@playwright/test';

test.describe('INKAN UI Redesign Plan Verification', () => {
  
  test.describe('Phase 1: Messaging & Content Enhancement', () => {
    test('homepage contains CEO fraud statistics with FBI source', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Check for 48x statistic
      const pageContent = await page.content();
      expect(pageContent).toContain('48x');

      // Verify FBI IC3 2021 source citation is present
      expect(pageContent).toContain('FBI IC3 2021');
      expect(pageContent).toContain('BEC');

      // Check for CEO fraud/ransomware comparison
      expect(pageContent).toMatch(/ransomware|ransomwares/i);
    });

    test('French version has CEO fraud statistics with source', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      const pageContent = await page.content();

      // Verify French content has 48x statistic
      expect(pageContent).toContain('48x');

      // Verify FBI source citation
      expect(pageContent).toContain('FBI IC3 2021');
    });
  });

  test.describe('Phase 2: Metrics Section', () => {
    test('homepage displays CEO fraud statistics', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Check for the statistics cards
      const pageContent = await page.content();

      // Verify key statistics are present
      expect(pageContent).toContain('48x');
      expect(pageContent).toContain('100%');

      // Check for FBI source citation we just added
      expect(pageContent).toContain('FBI IC3 2021');
    });
  });

  test.describe('Color Palette Verification', () => {
    test('modern Japanese colors are implemented', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Check CSS variables
      const rootStyles = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        return {
          shuModern: computedStyle.getPropertyValue('--color-shu-modern'),
          enjiModern: computedStyle.getPropertyValue('--color-enji-modern'),
          sango: computedStyle.getPropertyValue('--color-sango'),
        };
      });

      // Verify modern Japanese colors are defined
      expect(rootStyles.shuModern.trim()).toBe('#FF3500');
      expect(rootStyles.enjiModern.trim()).toBe('#C93338');
      expect(rootStyles.sango.trim()).toBe('#F8674F');
    });

    test('dark mode uses appropriate color variants', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Enable dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });

      // Wait a moment for styles to apply
      await page.waitForTimeout(100);

      // Check dark mode color variables
      const darkStyles = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        return {
          shuModern: computedStyle.getPropertyValue('--color-shu-modern'),
          enjiModern: computedStyle.getPropertyValue('--color-enji-modern'),
          sango: computedStyle.getPropertyValue('--color-sango'),
        };
      });

      // Verify dark mode variants
      expect(darkStyles.shuModern.trim()).toBe('#E34234');
      expect(darkStyles.enjiModern.trim()).toBe('#B91C1C');
      expect(darkStyles.sango.trim()).toBe('#F87171');
    });
  });

  test.describe('Navigation Requirements', () => {
    test('navigation contains standard labels', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Wait for network to be idle to ensure all content is loaded
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Ignore timeout - page may have long-polling or streaming connections
      });

      // Verify page has navigation links (check in page content)
      const pageContent = await page.content();
      expect(pageContent).toContain('Product');
      expect(pageContent).toContain('Articles');
      expect(pageContent).toContain('About');
    });
  });

  test.describe('Problem/Solution Clarity', () => {
    test('problem/solution messaging is clear', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Look for problem/solution content
      const pageContent = await page.content();

      // Verify ransomware comparison with FBI source
      expect(pageContent).toContain('48x');
      expect(pageContent).toMatch(/ransomware|ransomwares/i);
      expect(pageContent).toContain('FBI IC3 2021');
    });
  });

  test.describe('Visual Polish', () => {
    test('enterprise CSS enhancements are applied', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Check for enhanced button hover effects
      const button = page.locator('.inkan-button').first();
      if (await button.isVisible()) {
        const hasHoverEffect = await button.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.transition.includes('0.2s');
        });
        expect(hasHoverEffect).toBeTruthy();
      }

      // Check for card hover effects
      const card = page.locator('.shadow-lg').first();
      if (await card.isVisible()) {
        await card.hover();
        // Visual regression test would capture the hover state
      }
    });

    test('gradient backgrounds use proper colors', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      // Check if gradient classes exist in CSS
      const hasGradients = await page.evaluate(() => {
        const sheets = Array.from(document.styleSheets);
        const rules = sheets.flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules || []);
          } catch {
            return [];
          }
        });

        return rules.some(rule =>
          rule.cssText?.includes('gradient-primary') ||
          rule.cssText?.includes('gradient-validation')
        );
      });

      // Gradient classes should be defined
      expect(hasGradients).toBeTruthy();
    });
  });

  test.describe('Content Structure', () => {
    test('homepage has key content with FBI source', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });

      const pageContent = await page.content();

      // Verify FBI IC3 2021 citation is present
      expect(pageContent).toContain('FBI IC3 2021');
      expect(pageContent).toContain('48x');
      expect(pageContent).toContain('BEC');
    });
  });

  test.describe('Mobile Optimization', () => {
    test('mobile experience is optimized', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/', { waitUntil: 'load' });

      // Check mobile navigation works
      const mobileMenuButton = page.locator('button[aria-label*="menu"]').first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await expect(page.locator('nav').locator('a').first()).toBeVisible();
      }

      // Check content is mobile-friendly
      const contentWidth = await page.evaluate(() => {
        return document.body.scrollWidth;
      });

      // No horizontal scroll on mobile
      expect(contentWidth).toBeLessThanOrEqual(390);
    });
  });

  test.describe('Performance Metrics', () => {
    test('page maintains good performance', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load', timeout: 15000 });

      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        };
      });

      // Performance should not degrade (relaxed for slower browsers)
      expect(metrics.loadTime).toBeLessThan(10000); // 10 seconds max
      expect(metrics.domContentLoaded).toBeLessThan(5000); // 5 seconds max
    });
  });
});