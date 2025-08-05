import { test } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

/**
 * Screenshot capture tool for Claude Code analysis
 * Captures various views and states for visual inspection
 */

const SCREENSHOT_DIR = 'tests/screenshots';

test.describe('Screenshot Capture for Analysis', () => {
  test.beforeAll(async () => {
    // Ensure screenshot directory exists
    await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  });

  test('capture all blog views', async ({ browser }) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sessionDir = path.join(SCREENSHOT_DIR, `session-${timestamp}`);
    await fs.mkdir(sessionDir, { recursive: true });

    // Define viewports
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'laptop', width: 1366, height: 768 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 },
    ];

    // Pages to capture
    const pages = [
      { url: '/', name: 'homepage' },
      { url: '/posts/', name: 'blog-listing' },
      { url: '/posts/blog-fraude-au-pdg-5milliards-an/', name: 'blog-post-fr' },
      { url: '/posts/blog-BEC-5billions-annum-scam/', name: 'blog-post-en' },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2, // High quality screenshots
      });
      const page = await context.newPage();

      for (const pageInfo of pages) {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');

        // Light mode
        await page.screenshot({
          path: path.join(sessionDir, `${pageInfo.name}-${viewport.name}-light.png`),
          fullPage: true,
        });

        // Dark mode
        await page.evaluate(() => {
          document.documentElement.classList.add('dark');
        });
        await page.waitForTimeout(300);

        await page.screenshot({
          path: path.join(sessionDir, `${pageInfo.name}-${viewport.name}-dark.png`),
          fullPage: true,
        });

        // Reset to light mode
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
        });
      }

      await context.close();
    }

    console.log(`Screenshots saved to: ${sessionDir}`);
  });

  test('capture interactive states', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const statesDir = path.join(SCREENSHOT_DIR, `states-${timestamp}`);
    await fs.mkdir(statesDir, { recursive: true });

    // Blog listing page
    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');

    // Hover states
    const firstBlogCard = page.locator('article').first();
    await firstBlogCard.hover();
    await page.screenshot({
      path: path.join(statesDir, 'blog-card-hover.png'),
    });

    // Focus states
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.screenshot({
      path: path.join(statesDir, 'keyboard-focus.png'),
    });

    // Mobile menu (if applicable)
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileMenuButton = page.locator('button[aria-label*="menu"]').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(statesDir, 'mobile-menu-open.png'),
      });
    }
  });

  test('capture specific components', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const componentsDir = path.join(SCREENSHOT_DIR, `components-${timestamp}`);
    await fs.mkdir(componentsDir, { recursive: true });

    // Blog post components
    await page.goto('/posts/blog-fraude-au-pdg-5milliards-an/');
    await page.waitForLoadState('networkidle');

    // Header
    await page.locator('header').screenshot({
      path: path.join(componentsDir, 'post-header.png'),
    });

    // Featured image
    const featuredImage = page.locator('.aspect-\\[16\\/10\\]').first();
    if (await featuredImage.isVisible()) {
      await featuredImage.screenshot({
        path: path.join(componentsDir, 'featured-image.png'),
      });
    }

    // Article content
    await page.locator('.prose').screenshot({
      path: path.join(componentsDir, 'article-content.png'),
    });

    // CTA section
    await page.locator('.border-t').last().screenshot({
      path: path.join(componentsDir, 'cta-section.png'),
    });

    // Blog listing components
    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');

    // Single blog card
    await page.locator('article').first().screenshot({
      path: path.join(componentsDir, 'blog-card.png'),
    });

    // Pagination (if visible)
    const pagination = page.locator('[class*="pagination"]').first();
    if (await pagination.isVisible()) {
      await pagination.screenshot({
        path: path.join(componentsDir, 'pagination.png'),
      });
    }
  });

  test('capture for design review', async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const designDir = path.join(SCREENSHOT_DIR, `design-review-${timestamp}`);
    await fs.mkdir(designDir, { recursive: true });

    // Capture full design system in action
    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');

    // Typography samples
    await page.goto('/posts/blog-fraude-au-pdg-5milliards-an/');
    await page.waitForLoadState('networkidle');
    
    await page.locator('.prose').screenshot({
      path: path.join(designDir, 'typography-system.png'),
    });

    // Color usage
    await page.screenshot({
      path: path.join(designDir, 'color-palette-in-use.png'),
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });

    // Spacing and alignment
    await page.goto('/posts/');
    await page.locator('.mx-auto.max-w-6xl').screenshot({
      path: path.join(designDir, 'spacing-alignment.png'),
    });

    // Create summary HTML
    const summaryHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Design Review - ${timestamp}</title>
  <style>
    body { font-family: system-ui; margin: 2rem; }
    .screenshot { margin: 2rem 0; border: 1px solid #ddd; }
    img { max-width: 100%; height: auto; }
    h2 { color: #333; margin-top: 3rem; }
  </style>
</head>
<body>
  <h1>Blog Redesign Screenshot Review</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  <h2>Typography System</h2>
  <div class="screenshot">
    <img src="typography-system.png" alt="Typography System">
  </div>
  
  <h2>Color Palette Usage</h2>
  <div class="screenshot">
    <img src="color-palette-in-use.png" alt="Color Palette">
  </div>
  
  <h2>Spacing and Alignment</h2>
  <div class="screenshot">
    <img src="spacing-alignment.png" alt="Spacing System">
  </div>
</body>
</html>
    `;

    await fs.writeFile(
      path.join(designDir, 'review.html'),
      summaryHtml
    );

    console.log(`Design review saved to: ${designDir}/review.html`);
  });
});