import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog listing accessibility', async ({ page }) => {
    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Log violations if any
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations:', 
        accessibilityScanResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length
        }))
      );
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog post accessibility', async ({ page }) => {
    await page.goto('/posts/blog-fraude-au-pdg-5milliards-an/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.prose code') // Exclude code blocks from color contrast checks
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/posts/');
    
    // Start from top of page
    await page.keyboard.press('Tab');
    
    // Check if skip links are available
    const skipLink = await page.locator(':focus');
    const skipLinkText = await skipLink.textContent();
    expect(skipLinkText).toContain('Skip');
    
    // Tab through blog cards
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus');
      const tagName = await focused.evaluate(el => el.tagName);
      // Should focus on interactive elements
      expect(['A', 'BUTTON', 'INPUT']).toContain(tagName);
    }
  });

  test('color contrast in dark mode', async ({ page }) => {
    await page.goto('/posts/');
    
    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(500);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('.mx-auto.max-w-6xl')
      .analyze();
    
    const colorContrastViolations = accessibilityScanResults.violations
      .filter(v => v.id === 'color-contrast');
    
    expect(colorContrastViolations).toHaveLength(0);
  });

  test('ARIA labels and roles', async ({ page }) => {
    await page.goto('/posts/');
    
    // Check navigation has proper ARIA
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label', /.+/);
    
    // Check images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check headings hierarchy
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', 
      elements => elements.map(el => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent
      }))
    );
    
    // Verify heading hierarchy (no skipping levels)
    let previousLevel = 0;
    for (const heading of headings) {
      expect(heading.level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = heading.level;
    }
  });

  test('mobile accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/posts/');
    
    // Check touch targets are large enough
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const box = await link.boundingBox();
      if (box) {
        // WCAG 2.1 requires 44x44 minimum
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('form accessibility (if applicable)', async ({ page }) => {
    await page.goto('/');
    
    // Check if there are any forms
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Check form labels
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          await expect(label).toBeVisible();
        }
      }
    }
  });
});