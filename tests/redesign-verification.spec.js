import { test, expect } from '@playwright/test';

test.describe('INKAN UI Redesign Plan Verification', () => {
  
  test.describe('Phase 1: Messaging & Content Enhancement', () => {
    test('hero messaging focuses on validation over detection', async ({ page }) => {
      await page.goto('/');
      
      // Check for validation-focused messaging
      const heroContent = await page.locator('.text-lg.leading-7').allTextContents();
      const heroText = heroContent.join(' ').toLowerCase();
      
      // Verify key messages from the plan
      expect(heroText).toContain('detection isn\'t enough');
      expect(heroText).toContain('validate');
      expect(heroText).toContain('when it matters');
      
      // Check for CEO fraud statistics
      expect(heroText).toMatch(/\$5\.5\s*billion|5\.5\s*milliards/);
      
      // Verify NO fake testimonials or certifications
      const pageContent = await page.content();
      expect(pageContent).not.toContain('certification');
      expect(pageContent).not.toContain('testimonial');
    });

    test('French version has updated validation messaging', async ({ page }) => {
      await page.goto('/fr/');
      
      const heroContent = await page.locator('.text-lg.leading-7').allTextContents();
      const heroText = heroContent.join(' ').toLowerCase();
      
      // Verify French validation messaging
      expect(heroText).toContain('valide');
      expect(heroText).toMatch(/5\s*milliards/);
    });
  });

  test.describe('Phase 2: Metrics Section', () => {
    test('metrics section exists with real performance data', async ({ page }) => {
      await page.goto('/');
      
      // Look for metrics section
      const metricsSection = page.locator('text="Real Performance, Not Promises"').first();
      await expect(metricsSection).toBeVisible();
      
      // Check for "No certifications to hide behind" message
      const noCertMessage = page.locator('text="No certifications to hide behind"');
      await expect(noCertMessage).toBeVisible();
      
      // Verify metrics cards exist
      const metricCards = page.locator('.grid.md\\:grid-cols-4 .flex.flex-col');
      await expect(metricCards).toHaveCount(4);
      
      // Check specific metrics
      await expect(page.locator('text="99.7%"')).toBeVisible();
      await expect(page.locator('text="<20s"')).toBeVisible();
      await expect(page.locator('text="$0"')).toBeVisible();
      await expect(page.locator('text="24/7"')).toBeVisible();
      
      // Verify descriptions
      await expect(page.locator('text="Validation Accuracy"')).toBeVisible();
      await expect(page.locator('text="Validation Time"')).toBeVisible();
      await expect(page.locator('text="Fraud After Deploy"')).toBeVisible();
      await expect(page.locator('text="Always Available"')).toBeVisible();
    });
  });

  test.describe('Color Palette Verification', () => {
    test('modern Japanese colors are implemented', async ({ page }) => {
      await page.goto('/');
      
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
      await page.goto('/');
      
      // Enable dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      
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
    test('navigation maintains standard labels (not validation-focused)', async ({ page }) => {
      await page.goto('/');
      
      // Check navigation labels remain standard
      const nav = page.locator('nav');
      
      // Verify standard labels are maintained
      await expect(nav.locator('text="Product"')).toBeVisible();
      await expect(nav.locator('text="Articles"')).toBeVisible();
      await expect(nav.locator('text="About"')).toBeVisible();
      
      // Verify NO fake validation messaging in nav
      await expect(nav.locator('text="Validation Solution"')).not.toBeVisible();
      await expect(nav.locator('text="How Validation Works"')).not.toBeVisible();
      await expect(nav.locator('text="Why Not Detection"')).not.toBeVisible();
      
      // Verify NO fake live indicators
      await expect(nav.locator('text="Validating live"')).not.toBeVisible();
      await expect(nav.locator('.validation-active')).not.toBeVisible();
    });
  });

  test.describe('Problem/Solution Clarity', () => {
    test('problem/solution messaging is clear', async ({ page }) => {
      await page.goto('/');
      
      // Look for problem/solution content
      const pageContent = await page.content();
      
      // Check for detection vs validation messaging
      expect(pageContent).toMatch(/detection.*fail|fail.*detection/i);
      expect(pageContent).toContain('validation');
      
      // Verify ransomware comparison if present
      if (pageContent.includes('ransomware')) {
        expect(pageContent).toMatch(/48x.*more|criminals.*gain/i);
      }
    });
  });

  test.describe('Visual Polish', () => {
    test('enterprise CSS enhancements are applied', async ({ page }) => {
      await page.goto('/');
      
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
      await page.goto('/');
      
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
    test('follows website best practices structure', async ({ page }) => {
      await page.goto('/');
      
      // Check for logical flow of sections
      const sections = await page.$$eval('section, div[class*="py-12"], div[class*="py-16"]', 
        elements => elements.map(el => ({
          text: el.textContent?.substring(0, 100),
          classes: el.className
        }))
      );
      
      // Verify multiple sections exist
      expect(sections.length).toBeGreaterThan(4);
      
      // Check for progressive disclosure
      const hasMultipleSections = sections.length > 5;
      expect(hasMultipleSections).toBeTruthy();
    });

    test('CTAs use action-oriented language', async ({ page }) => {
      await page.goto('/');
      
      // Check for updated CTA text
      const ctaTexts = [
        'See Validation Demo',
        'Start Validating', 
        'Schedule Demo',
        'Validate in 20 Seconds'
      ];
      
      let foundUpdatedCTA = false;
      for (const text of ctaTexts) {
        const cta = page.locator(`text="${text}"`);
        if (await cta.count() > 0) {
          foundUpdatedCTA = true;
          break;
        }
      }
      
      // At least one updated CTA should be present
      expect(foundUpdatedCTA).toBeTruthy();
    });
  });

  test.describe('Mobile Optimization', () => {
    test('mobile experience is optimized', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');
      
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
      await page.goto('/');
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        };
      });
      
      // Performance should not degrade
      expect(metrics.loadTime).toBeLessThan(5000); // 5 seconds max
      expect(metrics.domContentLoaded).toBeLessThan(3000); // 3 seconds max
    });
  });
});