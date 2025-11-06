import { test, expect } from '@playwright/test';

/**
 * AEO (Answer Engine Optimization) Verification Tests
 *
 * Validates that AEO implementation is correct and prevents regressions.
 * Tests based on inkan-link-aeo-analysis.md findings.
 */

test.describe('AEO Technical Foundation', () => {

  test('robots.txt should allow all AI crawlers without Crawl-delay', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();

    const robotsTxt = await response.text();

    // CRITICAL: No Crawl-delay (causes 5-10% slower indexing)
    expect(robotsTxt).not.toContain('Crawl-delay');
    expect(robotsTxt).not.toContain('crawl-delay');

    // Verify all 11 AI crawlers are allowed
    const requiredCrawlers = [
      'GPTBot',           // OpenAI ChatGPT
      'ChatGPT-User',     // ChatGPT browse mode
      'OAI-SearchBot',    // OpenAI SearchGPT
      'Claude-Web',       // Anthropic Claude
      'anthropic-ai',     // Anthropic systems
      'PerplexityBot',    // Perplexity AI
      'GoogleOther',      // Google AI/Gemini
      'CCBot',            // Common Crawl
      'Applebot-Extended',// Apple Intelligence
      'Meta-ExternalAgent', // Meta AI
      'Bytespider'        // ByteDance/TikTok AI
    ];

    for (const crawler of requiredCrawlers) {
      expect(robotsTxt).toContain(`User-agent: ${crawler}`);
      // Verify it's not explicitly disallowed
      const crawlerSection = robotsTxt.split(`User-agent: ${crawler}`)[1]?.split('User-agent:')[0] || '';
      expect(crawlerSection).toContain('Allow: /');
    }

    // Verify sensitive paths are blocked
    expect(robotsTxt).toContain('Disallow: /admin/');
    expect(robotsTxt).toContain('Disallow: /api/');
    expect(robotsTxt).toContain('Disallow: /.env');

    // Verify sitemap references
    expect(robotsTxt).toContain('Sitemap: https://inkan.link/sitemap.xml');
    expect(robotsTxt).toContain('Sitemap: https://inkan.link/en/sitemap.xml');
  });

  test('llms.txt should exist and be comprehensive', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('text/plain');

    const llmsTxt = await response.text();

    // Verify minimum length (should be under 2,000 words but substantial)
    const wordCount = llmsTxt.split(/\s+/).length;
    expect(wordCount).toBeGreaterThan(1500);
    expect(wordCount).toBeLessThan(2500);

    // Verify required sections exist
    expect(llmsTxt).toContain('# Inkan.link');
    expect(llmsTxt).toContain('## About');
    expect(llmsTxt).toContain('## Products & Services');
    expect(llmsTxt).toContain('## Common Questions');
    expect(llmsTxt).toContain('## Contact');

    // Verify Sealfie is mentioned
    expect(llmsTxt).toContain('Sealfie');
    expect(llmsTxt).toContain('https://sealf.ie');

    // Verify pricing information
    expect(llmsTxt).toContain('€95');
    expect(llmsTxt).toContain('month');

    // Verify contact information
    expect(llmsTxt).toContain('contact@inkan.link');
    expect(llmsTxt).toContain('https://inkan.link');

    // Verify key topics are covered (for AI citation)
    expect(llmsTxt).toContain('Business Email Compromise');
    expect(llmsTxt).toContain('CEO fraud');
    expect(llmsTxt).toContain('deepfake');
    expect(llmsTxt).toContain('blockchain');
    expect(llmsTxt).toContain('biometric');

    // Verify FAQ count (should have 7-10 FAQs minimum)
    const faqCount = (llmsTxt.match(/###\s+/g) || []).length;
    expect(faqCount).toBeGreaterThanOrEqual(7);
    expect(faqCount).toBeLessThanOrEqual(15);
  });

  test('sitemap.xml should be accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('xml');

    const sitemap = await response.text();
    expect(sitemap).toContain('<?xml');
    expect(sitemap).toContain('urlset');
    expect(sitemap).toContain('https://inkan.link');
  });

  test('sitemap should include both French and English versions', async ({ request }) => {
    const frResponse = await request.get('/sitemap.xml');
    const enResponse = await request.get('/en/sitemap.xml');

    expect(frResponse.ok()).toBeTruthy();
    expect(enResponse.ok()).toBeTruthy();
  });
});

test.describe('AEO Schema Markup', () => {

  test('homepage should have Organization schema', async ({ page }) => {
    await page.goto('/');

    // Find Organization schema
    const orgSchema = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
      return scripts
        .map(s => {
          try { return JSON.parse(s.textContent); } catch { return null; }
        })
        .filter(s => s && (s['@type'] === 'Organization' || s['@graph']?.some(g => g['@type'] === 'Organization')));
    });

    expect(orgSchema.length).toBeGreaterThan(0);

    // Verify Organization has required fields
    const org = orgSchema[0]['@graph']
      ? orgSchema[0]['@graph'].find(g => g['@type'] === 'Organization')
      : orgSchema[0];

    expect(org.name).toBeDefined();
    expect(org.url).toBeDefined();
    expect(org.logo).toBeDefined();
  });

  test('homepage should have WebSite schema', async ({ page }) => {
    await page.goto('/');

    const websiteSchema = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
      return scripts
        .map(s => {
          try { return JSON.parse(s.textContent); } catch { return null; }
        })
        .filter(s => s && (s['@type'] === 'WebSite' || s['@graph']?.some(g => g['@type'] === 'WebSite')));
    });

    expect(websiteSchema.length).toBeGreaterThan(0);
  });

  test('blog posts should have Article schema', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/blog/');
    const firstPost = await page.locator('a[href*="/blog/"]').first();

    if (await firstPost.count() > 0) {
      await firstPost.click();

      const articleSchema = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
        return scripts
          .map(s => {
            try { return JSON.parse(s.textContent); } catch { return null; }
          })
          .filter(s => s && (
            s['@type'] === 'Article' ||
            s['@type'] === 'BlogPosting' ||
            s['@graph']?.some(g => g['@type'] === 'Article' || g['@type'] === 'BlogPosting')
          ));
      });

      expect(articleSchema.length).toBeGreaterThan(0);
    }
  });

  test('pages should have BreadcrumbList schema', async ({ page }) => {
    await page.goto('/blog/');

    const breadcrumbSchema = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
      return scripts
        .map(s => {
          try { return JSON.parse(s.textContent); } catch { return null; }
        })
        .filter(s => s && s['@type'] === 'BreadcrumbList');
    });

    expect(breadcrumbSchema.length).toBeGreaterThan(0);
  });

  test('all schema markup should be valid JSON-LD', async ({ page }) => {
    await page.goto('/');

    const allSchemas = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
      return scripts.map(s => {
        try {
          const parsed = JSON.parse(s.textContent);
          return { valid: true, content: parsed };
        } catch (e) {
          return { valid: false, error: e.message };
        }
      });
    });

    // All schemas should parse successfully
    const invalidSchemas = allSchemas.filter(s => !s.valid);
    expect(invalidSchemas.length).toBe(0);

    // All should have @context
    allSchemas.forEach(schema => {
      if (schema.valid) {
        expect(schema.content['@context']).toBeDefined();
      }
    });
  });
});

test.describe('AEO Content Structure', () => {

  test('homepage should have clear direct answer structure', async ({ page }) => {
    await page.goto('/');

    // Should have H1
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);

    // Should have multiple H2s for structure
    const h2s = await page.locator('h2').count();
    expect(h2s).toBeGreaterThanOrEqual(3);

    // Should have some bullet points (good for AI extraction)
    const lists = await page.locator('ul, ol').count();
    expect(lists).toBeGreaterThan(0);
  });

  test('content should have FAQ sections with proper markup', async ({ page }) => {
    await page.goto('/');

    // Check for FAQ schema
    const faqSchema = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
      return scripts
        .map(s => {
          try { return JSON.parse(s.textContent); } catch { return null; }
        })
        .filter(s => s && s['@type'] === 'FAQPage');
    });

    // If FAQ schema exists, verify structure
    if (faqSchema.length > 0) {
      expect(faqSchema[0].mainEntity).toBeDefined();
      expect(Array.isArray(faqSchema[0].mainEntity)).toBeTruthy();
      expect(faqSchema[0].mainEntity.length).toBeGreaterThan(0);

      // Verify each question has proper structure
      faqSchema[0].mainEntity.forEach(qa => {
        expect(qa['@type']).toBe('Question');
        expect(qa.name).toBeDefined();
        expect(qa.acceptedAnswer).toBeDefined();
        expect(qa.acceptedAnswer['@type']).toBe('Answer');
        expect(qa.acceptedAnswer.text).toBeDefined();
      });
    }
  });

  test('pages should have meta descriptions for AI context', async ({ page }) => {
    const pages = ['/', '/en/', '/blog/', '/en/blog/'];

    for (const url of pages) {
      await page.goto(url);
      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

      expect(metaDesc).toBeDefined();
      expect(metaDesc.length).toBeGreaterThan(50);
      expect(metaDesc.length).toBeLessThan(300);
    }
  });
});

test.describe('AEO Analytics Tracking', () => {

  test('Matomo should track AI referrals', async ({ page }) => {
    await page.goto('/');

    // Check if Matomo tracking code exists
    const matomoScript = await page.evaluate(() => {
      return window._paq !== undefined;
    });

    expect(matomoScript).toBeTruthy();

    // Check for AEO-specific tracking code
    const pageContent = await page.content();
    expect(pageContent).toContain('chatgpt.com');
    expect(pageContent).toContain('perplexity.ai');
    expect(pageContent).toContain('claude.ai');
    expect(pageContent).toContain('setCustomDimension');
    expect(pageContent).toContain('trackEvent');
    expect(pageContent).toContain('AEO');
  });

  test('AI crawler detection code should be present', async ({ page }) => {
    await page.goto('/');

    const pageContent = await page.content();

    // Check for AI crawler user-agent detection
    const aiCrawlers = ['GPTBot', 'Claude-Web', 'PerplexityBot', 'anthropic-ai', 'CCBot', 'Applebot'];

    for (const crawler of aiCrawlers) {
      expect(pageContent).toContain(crawler);
    }
  });
});

test.describe('AEO Regression Prevention', () => {

  test('robots.txt should never reintroduce Crawl-delay', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const robotsTxt = await response.text();

    // This test explicitly prevents the regression that happened
    expect(robotsTxt.toLowerCase()).not.toContain('crawl-delay');

    // Verify the warning comment exists
    expect(robotsTxt).toContain('CRITICAL');
    expect(robotsTxt).toContain('fast indexing');
  });

  test('all AI crawler allowances should remain present', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const robotsTxt = await response.text();

    // Count AI crawler entries
    const crawlerCount = (robotsTxt.match(/User-agent: GPTBot|User-agent: ChatGPT-User|User-agent: OAI-SearchBot|User-agent: Claude-Web|User-agent: anthropic-ai|User-agent: PerplexityBot|User-agent: GoogleOther|User-agent: CCBot|User-agent: Applebot-Extended|User-agent: Meta-ExternalAgent|User-agent: Bytespider/g) || []).length;

    expect(crawlerCount).toBeGreaterThanOrEqual(11);
  });

  test('llms.txt should not be deleted or become empty', async ({ request }) => {
    const response = await request.get('/llms.txt');

    expect(response.ok()).toBeTruthy();

    const content = await response.text();
    expect(content.length).toBeGreaterThan(1000);
  });

  test('schema markup should not be removed during updates', async ({ page }) => {
    await page.goto('/');

    const schemaCount = await page.locator('script[type="application/ld+json"]').count();

    // Should have at least 2 schemas on homepage (Organization + WebSite)
    expect(schemaCount).toBeGreaterThanOrEqual(2);
  });

  test('AEO analytics code should not be removed', async ({ page }) => {
    await page.goto('/');

    const pageContent = await page.content();

    // Core AEO tracking must remain
    expect(pageContent).toContain('AEO');
    expect(pageContent).toContain('AI Referral');
    expect(pageContent).toContain('AI Crawler');
  });
});

test.describe('AEO Performance', () => {

  test('llms.txt should load quickly', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/llms.txt');
    const loadTime = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(loadTime).toBeLessThan(500); // Should load in under 500ms
  });

  test('robots.txt should load instantly', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/robots.txt');
    const loadTime = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(loadTime).toBeLessThan(200); // Should load in under 200ms
  });

  test('schema markup should not significantly impact page load', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Page should load reasonably fast even with schema
    expect(loadTime).toBeLessThan(5000);
  });
});
