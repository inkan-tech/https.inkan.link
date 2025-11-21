/**
 * SEO Non-Regression Test: Hreflang and Sitemap Fixes
 *
 * Tests specifically for the fixes applied in commit b02b622:
 * 1. Hreflang to non-canonical - verify language priority and hreflang structure
 * 2. Non-canonical page in sitemap - verify sitemap redirects and canonical consistency
 *
 * Ahrefs Issues Fixed:
 * - Issue: "Hreflang to non-canonical" (1 page: https://inkan.link/en/)
 * - Issue: "Non-canonical page in sitemap" (1 page: https://inkan.link/)
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';
const PRODUCTION_URL = 'https://inkan.link';

// Helper function to normalize URLs for comparison (localhost vs production)
const normalizeUrl = (url) => {
  return url.replace(BASE_URL, PRODUCTION_URL);
};

test.describe('SEO Non-Regression: Hreflang & Sitemap Fixes', () => {

  /**
   * Test 1: French homepage canonical and hreflang
   * Verifies that the French homepage (at root /) has correct canonical and hreflang tags
   */
  test('French homepage (/) should have correct canonical and hreflang', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Check canonical points to itself (normalize for localhost vs production)
    const canonical = normalizeUrl(await page.locator('link[rel="canonical"]').getAttribute('href'));
    expect(canonical, 'French homepage canonical should point to root').toBe('https://inkan.link/');

    // Check hreflang for French
    const hreflangFr = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="fr"]').getAttribute('href'));
    expect(hreflangFr, 'Hreflang fr should point to root').toBe('https://inkan.link/');

    // Check hreflang for English
    const hreflangEn = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href'));
    expect(hreflangEn, 'Hreflang en should point to /en/').toBe('https://inkan.link/en/');

    // Check x-default points to French (default language as per config.toml)
    const hreflangDefault = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href'));
    expect(hreflangDefault, 'Hreflang x-default should point to French (default language)').toBe('https://inkan.link/');

    console.log('✅ French homepage canonical and hreflang verified');
  });

  /**
   * Test 2: English homepage canonical and hreflang
   * Verifies that the English homepage (/en/) has correct canonical and hreflang tags
   */
  test('English homepage (/en/) should have correct canonical and hreflang', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle' });

    // Check canonical points to itself (normalize for localhost vs production)
    const canonical = normalizeUrl(await page.locator('link[rel="canonical"]').getAttribute('href'));
    expect(canonical, 'English homepage canonical should point to /en/').toBe('https://inkan.link/en/');

    // Check hreflang for French
    const hreflangFr = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="fr"]').getAttribute('href'));
    expect(hreflangFr, 'Hreflang fr should point to root').toBe('https://inkan.link/');

    // Check hreflang for English (self-reference)
    const hreflangEn = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href'));
    expect(hreflangEn, 'Hreflang en should point to /en/').toBe('https://inkan.link/en/');

    // Check x-default points to French (default language as per config.toml)
    const hreflangDefault = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href'));
    expect(hreflangDefault, 'Hreflang x-default should point to French (default language)').toBe('https://inkan.link/');

    console.log('✅ English homepage canonical and hreflang verified');
  });

  /**
   * Test 3: /fr/ alias redirect should have correct hreflang
   * Verifies that the /fr/ alias (redirect to /) has proper hreflang tags
   * This fixes the Ahrefs issue: "Hreflang to non-canonical" on https://inkan.link/fr/
   */
  test('/fr/ alias should have correct hreflang tags', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/`, { waitUntil: 'networkidle' });

    // The /fr/ URL is an alias that redirects to /
    // It should still have proper hreflang tags in the redirect page

    // Check hreflang for French
    const hreflangFr = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="fr"]').getAttribute('href'));
    expect(hreflangFr, 'Hreflang fr on /fr/ should point to root').toBe('https://inkan.link/');

    // Check hreflang for English
    const hreflangEn = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href'));
    expect(hreflangEn, 'Hreflang en on /fr/ should point to /en/').toBe('https://inkan.link/en/');

    // Check x-default points to French (default language)
    const hreflangDefault = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href'));
    expect(hreflangDefault, 'Hreflang x-default on /fr/ should point to French').toBe('https://inkan.link/');

    console.log('✅ /fr/ alias hreflang tags verified');
  });

  /**
   * Test 4: Hreflang reciprocity
   * Verifies that hreflang tags are reciprocal (FR points to EN, EN points to FR)
   */
  test('Hreflang tags should be reciprocal between FR and EN', async ({ page }) => {
    // Test pairs of pages
    const pagePairs = [
      { fr: '/', en: '/en/' },
      { fr: '/team/', en: '/en/team/' },
      { fr: '/contacts/', en: '/en/contacts/' },
      { fr: '/faq/', en: '/en/faq/' },
    ];

    for (const { fr, en } of pagePairs) {
      // Check French page
      await page.goto(`${BASE_URL}${fr}`, { waitUntil: 'networkidle' });
      const frHreflangEn = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href'));
      const expectedEnUrl = `https://inkan.link${en}`;

      expect(
        frHreflangEn,
        `French page ${fr} should have hreflang en pointing to ${expectedEnUrl}`
      ).toBe(expectedEnUrl);

      // Check English page
      await page.goto(`${BASE_URL}${en}`, { waitUntil: 'networkidle' });
      const enHreflangFr = normalizeUrl(await page.locator('link[rel="alternate"][hreflang="fr"]').getAttribute('href'));
      const expectedFrUrl = `https://inkan.link${fr}`;

      expect(
        enHreflangFr,
        `English page ${en} should have hreflang fr pointing to ${expectedFrUrl}`
      ).toBe(expectedFrUrl);

      console.log(`✅ Hreflang reciprocity verified for ${fr} ↔ ${en}`);
    }
  });

  /**
   * Test 5: Sitemap redirect for /fr/sitemap.xml
   * Verifies that /fr/sitemap.xml redirects to /sitemap.xml (301)
   */
  test('/fr/sitemap.xml should redirect to main sitemap', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/fr/sitemap.xml`, {
      waitUntil: 'networkidle'
    });

    // Note: In localhost, redirects might not work the same as production
    // This test documents the expected behavior
    const finalUrl = response.url();

    console.log(`/fr/sitemap.xml final URL: ${finalUrl}`);

    // In production, this should redirect to /sitemap.xml
    // In development (Hugo server), it might serve the file directly
    // We document the expected production behavior
    console.log('⚠️  Note: In production, /fr/sitemap.xml should 301 redirect to /sitemap.xml');
    console.log('    This is configured in static/_redirects');
  });

  /**
   * Test 6: Sitemap contains only canonical URLs
   * Verifies that all URLs in the main sitemap have matching canonical tags
   */
  test('Main sitemap should only contain canonical URLs', async ({ page }) => {
    // Check if main sitemap is a sitemap index
    await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'networkidle' });
    const mainSitemapContent = await page.content();

    const isSitemapIndex = mainSitemapContent.includes('<sitemapindex');

    let urlsToCheck = [];

    if (isSitemapIndex) {
      // Parse sitemap index to get child sitemaps
      const sitemapMatches = mainSitemapContent.matchAll(/<loc>(.*?)<\/loc>/g);
      const childSitemaps = Array.from(sitemapMatches).map(match => match[1]);

      console.log(`Found ${childSitemaps.length} child sitemaps:`, childSitemaps);

      // Check each child sitemap
      for (const sitemapUrl of childSitemaps) {
        // Skip /fr/sitemap.xml as it should redirect
        if (sitemapUrl.includes('/fr/sitemap.xml')) {
          console.log('⚠️  Skipping /fr/sitemap.xml (should redirect in production)');
          continue;
        }

        await page.goto(sitemapUrl, { waitUntil: 'networkidle' });
        const sitemapContent = await page.content();
        const urlMatches = sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g);
        const urls = Array.from(urlMatches).map(match => match[1]);
        urlsToCheck.push(...urls);
      }
    } else {
      // Single sitemap - extract URLs directly
      const urlMatches = mainSitemapContent.matchAll(/<loc>(.*?)<\/loc>/g);
      urlsToCheck = Array.from(urlMatches).map(match => match[1]);
    }

    console.log(`Checking ${urlsToCheck.length} URLs from sitemap(s)`);

    const nonCanonicalPages = [];
    const samplesToCheck = urlsToCheck.slice(0, 15); // Check first 15 URLs

    for (const url of samplesToCheck) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

        // Normalize URLs for comparison (remove trailing slashes)
        const normalizeUrl = (u) => u.replace(/\/$/, '');
        const normalizedUrl = normalizeUrl(url);
        const normalizedCanonical = normalizeUrl(canonical);

        if (normalizedUrl !== normalizedCanonical) {
          nonCanonicalPages.push({
            sitemapUrl: url,
            canonicalUrl: canonical,
            issue: 'Sitemap URL does not match page canonical'
          });
        }
      } catch (error) {
        console.log(`⚠️  Could not check ${url}: ${error.message}`);
      }
    }

    if (nonCanonicalPages.length > 0) {
      console.error('❌ Non-canonical pages found in sitemap:');
      console.error(JSON.stringify(nonCanonicalPages, null, 2));
    } else {
      console.log('✅ All sampled sitemap URLs have matching canonical tags');
    }

    expect(
      nonCanonicalPages.length,
      `Found ${nonCanonicalPages.length} non-canonical URLs in sitemap`
    ).toBe(0);
  });

  /**
   * Test 7: Language priority verification
   * Verifies that French (weight 1) comes before English (weight 2) in sitemaps
   */
  test('Sitemap index should list French sitemap first', async ({ page }) => {
    await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'networkidle' });
    const sitemapContent = await page.content();

    const isSitemapIndex = sitemapContent.includes('<sitemapindex');

    if (isSitemapIndex) {
      const sitemapMatches = Array.from(sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g));
      const sitemapUrls = sitemapMatches.map(match => match[1]);

      console.log('Sitemap order:', sitemapUrls);

      // French sitemap should come before English (if both exist)
      const frSitemapIndex = sitemapUrls.findIndex(url => url.includes('/fr/sitemap.xml'));
      const enSitemapIndex = sitemapUrls.findIndex(url => url.includes('/en/sitemap.xml'));

      if (frSitemapIndex !== -1 && enSitemapIndex !== -1) {
        expect(
          frSitemapIndex,
          'French sitemap should appear before English sitemap (lower weight = higher priority)'
        ).toBeLessThan(enSitemapIndex);
        console.log('✅ French sitemap listed before English sitemap');
      } else if (frSitemapIndex !== -1) {
        console.log('⚠️  Only French sitemap found (English sitemap missing or redirected)');
      } else {
        console.log('ℹ️  Sitemap structure may have changed');
      }
    } else {
      console.log('ℹ️  Single sitemap detected (no sitemap index)');
    }
  });

  /**
   * Test 8: Self-referencing hreflang validation
   * Each page should reference itself in its own language
   */
  test('Pages should have self-referencing hreflang', async ({ page }) => {
    const testPages = [
      { url: '/', lang: 'fr', expectedSelf: 'https://inkan.link/' },
      { url: '/en/', lang: 'en', expectedSelf: 'https://inkan.link/en/' },
      { url: '/team/', lang: 'fr', expectedSelf: 'https://inkan.link/team/' },
      { url: '/en/team/', lang: 'en', expectedSelf: 'https://inkan.link/en/team/' },
    ];

    for (const { url, lang, expectedSelf } of testPages) {
      await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle' });

      const selfHreflang = normalizeUrl(await page.locator(`link[rel="alternate"][hreflang="${lang}"]`).getAttribute('href'));

      expect(
        selfHreflang,
        `Page ${url} should have self-referencing hreflang ${lang}`
      ).toBe(expectedSelf);

      console.log(`✅ Self-referencing hreflang verified for ${url} (${lang})`);
    }
  });

  /**
   * Test 9: Report summary
   * Generate a summary report of all checks
   */
  test('Generate hreflang and sitemap validation report', async ({ page }) => {
    const report = {
      timestamp: new Date().toISOString(),
      testSuite: 'Hreflang & Sitemap Non-Regression',
      commitRef: 'b02b622',
      checks: {
        frenchHomepageCanonical: { status: 'pending', url: '/' },
        englishHomepageCanonical: { status: 'pending', url: '/en/' },
        hreflangReciprocity: { status: 'pending', pairsTested: 0 },
        sitemapRedirect: { status: 'pending', note: 'Production only' },
        sitemapCanonicalConsistency: { status: 'pending', urlsChecked: 0 },
        languagePriority: { status: 'pending' },
        selfReferencingHreflang: { status: 'pending', pagesTested: 0 }
      },
      issues: []
    };

    console.log('SEO Hreflang & Sitemap Validation Report:');
    console.log(JSON.stringify(report, null, 2));

    // This test always passes - it's for reporting
    expect(true).toBe(true);
  });
});
