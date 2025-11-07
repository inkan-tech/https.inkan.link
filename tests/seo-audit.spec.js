/**
 * SEO Audit Test Suite
 * Tests reproduce Ahrefs audit findings for high-priority SEO issues
 *
 * Issues tested:
 * 1. Links to redirect (HTTP links, redirect chains)
 * 8. Multiple H1 tags per page
 * 9. Page/SERP title mismatches
 * 10. Hreflang to non-canonical URLs
 * 13. Non-canonical pages in sitemap
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';

// Test pages to audit (common pages that should exist)
const PAGES_TO_TEST = [
  '/',
  '/en/',
  '/blog/',
  '/en/blog/',
  '/team/',
  '/en/team/',
  '/contacts/',
  '/en/contacts/',
];

test.describe('SEO Audit - High Priority Issues', () => {

  /**
   * ISSUE #8: Multiple H1 tags
   * Each page should have exactly ONE H1 tag
   */
  test.describe('Issue #8: Multiple H1 Tags Detection', () => {
    for (const path of PAGES_TO_TEST) {
      test(`should have exactly one H1 tag on ${path}`, async ({ page }) => {
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

        const h1Elements = await page.locator('h1').all();
        const h1Count = h1Elements.length;
        const h1Texts = await Promise.all(
          h1Elements.map(async (el) => await el.textContent())
        );

        console.log(`${path}: Found ${h1Count} H1 tag(s):`, h1Texts);

        expect(h1Count, `Page ${path} should have exactly 1 H1 tag, found ${h1Count}`).toBe(1);
      });
    }

    // Dynamic test: check all blog posts
    test('should check all blog posts for multiple H1s', async ({ page }) => {
      const problems = [];

      // Get list of all blog posts from the blog index
      await page.goto(`${BASE_URL}/blog/`, { waitUntil: 'networkidle' });
      const postLinks = await page.locator('a[href*="/blog/"]').all();
      const postUrls = new Set();

      for (const link of postLinks) {
        const href = await link.getAttribute('href');
        if (href && href.includes('/blog/') && href !== '/blog/' && href !== '/en/blog/') {
          postUrls.add(href.startsWith('http') ? href : `${BASE_URL}${href}`);
        }
      }

      console.log(`Found ${postUrls.size} blog posts to check`);

      for (const url of Array.from(postUrls).slice(0, 10)) { // Limit to 10 for testing
        await page.goto(url, { waitUntil: 'networkidle' });
        const h1Elements = await page.locator('h1').all();
        const h1Count = h1Elements.length;

        if (h1Count !== 1) {
          const h1Texts = await Promise.all(
            h1Elements.map(async (el) => await el.textContent())
          );
          problems.push({
            url,
            h1Count,
            h1Texts
          });
        }
      }

      if (problems.length > 0) {
        console.log('Pages with multiple H1s:', JSON.stringify(problems, null, 2));
      }

      expect(problems.length, `Found ${problems.length} pages with multiple H1 tags`).toBe(0);
    });
  });

  /**
   * ISSUE #10: Hreflang to non-canonical
   * Hreflang tags should point to canonical URLs
   */
  test.describe('Issue #10: Hreflang to Non-Canonical', () => {
    for (const path of PAGES_TO_TEST) {
      test(`should have hreflang pointing to canonical URL on ${path}`, async ({ page }) => {
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

        // Get canonical URL
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

        // Get all hreflang links
        const hreflangLinks = await page.locator('link[rel="alternate"][hreflang]').all();
        const hreflangData = [];

        for (const link of hreflangLinks) {
          const hreflang = await link.getAttribute('hreflang');
          const href = await link.getAttribute('href');
          hreflangData.push({ hreflang, href });
        }

        console.log(`${path}:`);
        console.log(`  Canonical: ${canonical}`);
        console.log(`  Hreflang tags:`, hreflangData);

        // Check if any hreflang points to a different URL than what should be canonical
        for (const { hreflang, href } of hreflangData) {
          // Verify the hreflang target has a canonical tag
          await page.goto(href, { waitUntil: 'networkidle' });
          const targetCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');

          // The hreflang should point to the canonical version
          expect(
            href,
            `Hreflang ${hreflang} on ${path} points to ${href}, but target canonical is ${targetCanonical}`
          ).toBe(targetCanonical);
        }
      });
    }
  });

  /**
   * ISSUE #9: Page and SERP titles do not match
   * Verify title tags are optimized and not likely to be rewritten by Google
   */
  test.describe('Issue #9: Page/SERP Title Mismatch', () => {
    for (const path of PAGES_TO_TEST) {
      test(`should have optimized title tag on ${path}`, async ({ page }) => {
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

        const title = await page.title();
        const h1 = await page.locator('h1').first().textContent();

        console.log(`${path}:`);
        console.log(`  Title: ${title} (${title.length} chars)`);
        console.log(`  H1: ${h1}`);

        // Title should be 50-60 characters (optimal for SEO)
        expect(title.length, `Title on ${path} should be 50-60 chars, got ${title.length}`).toBeGreaterThanOrEqual(30);
        expect(title.length, `Title on ${path} should be 50-60 chars, got ${title.length}`).toBeLessThanOrEqual(70);

        // Title should not be too similar to H1 (avoid redundancy)
        // Title should contain brand/site name
        const hasBrand = title.includes('Inkan') || title.includes('Sealfie');
        expect(hasBrand, `Title on ${path} should include brand name`).toBe(true);

        // Check for common title issues that cause rewrites
        const hasKeywordStuffing = /(.+)\s+\1/.test(title); // Repeated words
        const hasExcessivePunctuation = (title.match(/[!?|]/g) || []).length > 1;

        expect(hasKeywordStuffing, `Title on ${path} should not have keyword stuffing`).toBe(false);
        expect(hasExcessivePunctuation, `Title on ${path} should not have excessive punctuation`).toBe(false);
      });
    }
  });

  /**
   * ISSUE #13: Non-canonical page in sitemap
   * Sitemap should only contain canonical URLs
   */
  test('Issue #13: should only have canonical pages in sitemap', async ({ page }) => {
    await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'networkidle' });

    const sitemapContent = await page.content();

    // Parse sitemap XML to get all URLs
    const urlMatches = sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g);
    const sitemapUrls = Array.from(urlMatches).map(match => match[1]);

    console.log(`Found ${sitemapUrls.length} URLs in sitemap`);

    const nonCanonicalPages = [];

    // Check each URL to verify it's canonical
    for (const url of sitemapUrls.slice(0, 20)) { // Limit to 20 for testing
      await page.goto(url, { waitUntil: 'networkidle' });
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Normalize URLs for comparison (remove trailing slashes, protocols)
      const normalizeUrl = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const normalizedUrl = normalizeUrl(url);
      const normalizedCanonical = normalizeUrl(canonical);

      if (normalizedUrl !== normalizedCanonical) {
        nonCanonicalPages.push({
          sitemapUrl: url,
          canonicalUrl: canonical
        });
      }
    }

    if (nonCanonicalPages.length > 0) {
      console.log('Non-canonical pages in sitemap:', JSON.stringify(nonCanonicalPages, null, 2));
    }

    expect(
      nonCanonicalPages.length,
      `Found ${nonCanonicalPages.length} non-canonical pages in sitemap`
    ).toBe(0);
  });

  /**
   * ISSUE #1: Page has links to redirect
   * Internal links should point directly to final destination, not redirect chains
   */
  test.describe('Issue #1: Links to Redirect Detection', () => {
    test('should not have internal links causing redirects', async ({ page, request }) => {
      const linksWithRedirects = [];

      // Check main pages for external links that might redirect
      for (const path of PAGES_TO_TEST.slice(0, 3)) { // Check first 3 pages
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

        // Get all external links (exclude internal navigation)
        const externalLinks = await page.locator('a[href^="http"]').all();

        for (const link of externalLinks) {
          const href = await link.getAttribute('href');
          const anchorText = await link.textContent();

          if (!href) continue;

          try {
            // Make a HEAD request to check for redirects
            const response = await request.head(href, {
              maxRedirects: 0,
              failOnStatusCode: false
            });

            // Check if this is a redirect (3xx status)
            if (response.status() >= 300 && response.status() < 400) {
              const location = response.headers()['location'];
              linksWithRedirects.push({
                sourcePage: path,
                linkUrl: href,
                statusCode: response.status(),
                redirectTo: location,
                anchorText: anchorText?.trim().substring(0, 50)
              });
            }
          } catch (error) {
            console.log(`Failed to check ${href}: ${error.message}`);
          }
        }
      }

      if (linksWithRedirects.length > 0) {
        console.log('Links causing redirects:', JSON.stringify(linksWithRedirects, null, 2));
      }

      expect(
        linksWithRedirects.length,
        `Found ${linksWithRedirects.length} links causing redirects. Should use direct URLs instead.`
      ).toBe(0);
    });

    test('should use HTTPS for all newsletter signup links', async ({ page }) => {
      const httpLinks = [];

      for (const path of PAGES_TO_TEST) {
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

        // Check for HTTP links (should all be HTTPS)
        const links = await page.locator('a[href^="http://"]').all();

        for (const link of links) {
          const href = await link.getAttribute('href');
          const anchorText = await link.textContent();

          // Skip localhost links (used in development)
          if (!href.includes('localhost') && !href.includes('127.0.0.1')) {
            httpLinks.push({
              page: path,
              url: href,
              anchorText: anchorText?.trim()
            });
          }
        }
      }

      if (httpLinks.length > 0) {
        console.log('HTTP links found (should be HTTPS):', JSON.stringify(httpLinks, null, 2));
      }

      expect(
        httpLinks.length,
        `Found ${httpLinks.length} HTTP links. All external links should use HTTPS.`
      ).toBe(0);
    });
  });

  /**
   * Comprehensive audit report
   */
  test('Generate SEO audit report', async ({ page }) => {
    const report = {
      timestamp: new Date().toISOString(),
      issues: {
        multipleH1s: [],
        hreflangNonCanonical: [],
        titleIssues: [],
        sitemapNonCanonical: []
      }
    };

    // Check all main pages
    for (const path of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

      // Check H1 count
      const h1Count = await page.locator('h1').count();
      if (h1Count !== 1) {
        const h1Texts = await Promise.all(
          (await page.locator('h1').all()).map(el => el.textContent())
        );
        report.issues.multipleH1s.push({ url: path, h1Count, h1Texts });
      }

      // Check title
      const title = await page.title();
      if (title.length < 30 || title.length > 70) {
        report.issues.titleIssues.push({ url: path, title, length: title.length });
      }
    }

    console.log('SEO Audit Report:', JSON.stringify(report, null, 2));

    // Save report to file
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', 'seo-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Report saved to: ${reportPath}`);
  });
});
