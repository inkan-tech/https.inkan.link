import { test, expect } from '@playwright/test';

test.describe('Blog Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a consistent viewport size for visual testing
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('blog homepage visual test', async ({ page }) => {
    await page.goto('/posts/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('blog-homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Blog list section
    await expect(page.locator('.mx-auto.max-w-6xl')).toHaveScreenshot('blog-list-section.png');
  });

  test('individual blog post visual test', async ({ page }) => {
    // Navigate to a specific blog post
    await page.goto('/posts/blog-fraude-au-pdg-5milliards-an/');
    
    await page.waitForLoadState('networkidle');
    
    // Full article screenshot
    await expect(page).toHaveScreenshot('blog-post-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Header section
    await expect(page.locator('header')).toHaveScreenshot('blog-post-header.png');
    
    // Featured image
    const featuredImage = page.locator('.aspect-\\[16\\/10\\]').first();
    if (await featuredImage.isVisible()) {
      await expect(featuredImage).toHaveScreenshot('featured-image.png');
    }
    
    // CTA section
    await expect(page.locator('.border-t.border-neutral-200')).toHaveScreenshot('cta-section.png');
  });

  test('mobile blog visual test', async ({ page }) => {
    // iPhone 12 viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('blog-mobile-homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Navigate to blog post on mobile
    await page.goto('/posts/blog-fraude-au-pdg-5milliards-an/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('blog-mobile-post.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('dark mode visual test', async ({ page }) => {
    await page.goto('/posts/');
    
    // Toggle dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(500); // Wait for transition
    
    await expect(page).toHaveScreenshot('blog-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('blog typography hierarchy', async ({ page }) => {
    await page.goto('/posts/blog-fraude-au-pdg-5milliards-an/');
    await page.waitForLoadState('networkidle');
    
    // Check title is sentence case
    const title = await page.locator('h1').textContent();
    const hasProperCase = title && !title.split(' ').every(word => 
      word.length <= 3 || word[0] === word[0].toUpperCase()
    );
    
    expect(hasProperCase).toBeTruthy();
    
    // Screenshot of typography elements
    await expect(page.locator('.prose')).toHaveScreenshot('typography-hierarchy.png');
  });
});