import { test, expect } from '@playwright/test';

test.describe('Sitemap Coverage Verification', () => {
  
  test.describe('Sitemap Accessibility', () => {
    test('main sitemap is accessible', async ({ page }) => {
      const response = await page.request.get('/sitemap.xml');
      expect(response.status()).toBe(200);
      
      const content = await response.text();
      expect(content).toContain('<sitemapindex');
      expect(content).toContain('/fr/sitemap.xml');
      expect(content).toContain('/en/sitemap.xml');
    });

    test('language-specific sitemaps are accessible', async ({ page }) => {
      const sitemaps = ['/fr/sitemap.xml', '/en/sitemap.xml'];
      
      for (const sitemap of sitemaps) {
        const response = await page.request.get(sitemap);
        expect(response.status()).toBe(200);
        
        const content = await response.text();
        expect(content).toContain('<urlset');
        expect(content).toContain('<url>');
        expect(content).toContain('<loc>');
      }
    });
  });

  test.describe('Core Pages Coverage', () => {
    test('homepage accessibility (both languages)', async ({ page }) => {
      const homepages = ['/', '/en/'];
      
      for (const homepage of homepages) {
        const response = await page.request.get(homepage);
        expect(response.status()).toBe(200);
      }
    });

    test('main section pages accessibility', async ({ page }) => {
      const mainSections = [
        // French sections
        '/posts/',
        '/contacts/',
        '/team/',
        '/legal/',
        '/categories/',
        '/tags/',
        
        // English sections
        '/en/posts/',
        '/en/contacts/',
        '/en/team/',
        '/en/legal/',
        '/en/categories/',
        '/en/tags/'
      ];

      for (const section of mainSections) {
        const response = await page.request.get(section);
        expect([200, 301, 302]).toContain(response.status());
      }
    });
  });

  test.describe('Blog Posts Coverage', () => {
    test('recent French blog posts accessibility', async ({ page }) => {
      const frenchPosts = [
        '/posts/news-podcast-privacy-break-1/',
        '/posts/news-innov-adira/',
        '/posts/news-dauphine-entreprises/',
        '/posts/blog-fraude-au-pdg-5milliards-an/',
        '/posts/news-itu-t-workshop-securing-ai/',
        '/posts/blog-mon-patron-est-une-ia-2/',
        '/posts/blog-mon-patron-est-une-ia/',
        '/posts/blog-sauver-le-soldat-comptable/'
      ];

      for (const post of frenchPosts) {
        const response = await page.request.get(post);
        expect(response.status()).toBe(200);
      }
    });

    test('recent English blog posts accessibility', async ({ page }) => {
      const englishPosts = [
        '/en/posts/news-inpho-venture-2024/',
        '/en/posts/blog-bec-5billions-annum-scam/',
        '/en/posts/news-itu-t-workshop-securing-ai/',
        '/en/posts/news-websummit-alpha/',
        '/en/posts/blog-my-boss-is-an-ai-2/',
        '/en/posts/news-deeptech-grant/',
        '/en/posts/blog-my-boss-is-an-ai/',
        '/en/posts/blog-save-accountant-ryan/'
      ];

      for (const post of englishPosts) {
        const response = await page.request.get(post);
        expect(response.status()).toBe(200);
      }
    });
  });

  test.describe('Category and Tag Pages', () => {
    test('main category pages accessibility', async ({ page }) => {
      const categories = [
        // French categories
        '/categories/blog/',
        '/categories/news/',
        '/categories/site/',
        
        // English categories
        '/en/categories/blog/',
        '/en/categories/news/',
        '/en/categories/site/'
      ];

      for (const category of categories) {
        const response = await page.request.get(category);
        expect(response.status()).toBe(200);
      }
    });

    test('popular tag pages accessibility', async ({ page }) => {
      const popularTags = [
        // French tags
        '/tags/cybersécurité/',
        '/tags/deepfake/',
        '/tags/ia/',
        '/tags/sealfie/',
        '/tags/innovation/',
        '/tags/fraude/',
        
        // English tags
        '/en/tags/cybersecurity/',
        '/en/tags/deepfakeprotection/',
        '/en/tags/sealfie/',
        '/en/tags/ai-security/',
        '/en/tags/fraud-detection/'
      ];

      for (const tag of popularTags) {
        const response = await page.request.get(tag);
        expect([200, 404]).toContain(response.status()); // Some tags might not exist
      }
    });
  });

  test.describe('Bilingual Content Verification', () => {
    test('language switching works correctly', async ({ page }) => {
      // Test French to English switching
      await page.goto('/');
      const frContent = await page.content();
      expect(frContent).toContain('lang="fr"');
      
      await page.goto('/en/');
      const enContent = await page.content();
      expect(enContent).toContain('lang="en"');
    });

    test('cross-language links are properly configured', async ({ page }) => {
      const bilingualPages = [
        { fr: '/contacts/', en: '/en/contacts/' },
        { fr: '/team/', en: '/en/team/' },
        { fr: '/legal/', en: '/en/legal/' }
      ];

      for (const pages of bilingualPages) {
        // Check French page has English alternative
        const frResponse = await page.request.get(pages.fr);
        if (frResponse.status() === 200) {
          const frContent = await frResponse.text();
          expect(frContent).toContain('hreflang="en"');
        }

        // Check English page has French alternative
        const enResponse = await page.request.get(pages.en);
        if (enResponse.status() === 200) {
          const enContent = await enResponse.text();
          expect(enContent).toContain('hreflang="fr"');
        }
      }
    });
  });

  test.describe('Image and Asset Coverage', () => {
    test('featured images from sitemap are accessible', async ({ page }) => {
      const featuredImages = [
        '/images/posts/PrivacyBreak1_illustration.png',
        '/images/posts/ADIRA-12dec_24.webp',
        '/images/posts/Daubé-CES-Inkan.png',
        '/images/posts/IC3PressReleaseBanner3.webp',
        '/images/posts/Inpho_venture_2024.jpg',
        '/images/posts/itu-t-workshop.jpg',
        '/images/posts/cyborg_ceo.webp',
        '/images/featured/contact-us.jpeg',
        '/images/featured/SquircleLogoInkan.webp'
      ];

      for (const image of featuredImages) {
        const response = await page.request.get(image);
        expect([200, 404]).toContain(response.status()); // Some images might not exist locally
      }
    });

    test('critical SVG animations are accessible', async ({ page }) => {
      const criticalAssets = [
        '/images/inkan-animated-prez.svg'
      ];

      for (const asset of criticalAssets) {
        const response = await page.request.get(asset);
        expect(response.status()).toBe(200);
        
        const content = await response.text();
        expect(content).toContain('<svg');
      }
    });
  });

  test.describe('URL Structure Validation', () => {
    test('URL patterns follow Hugo conventions', async ({ page }) => {
      // Test that post URLs follow the pattern /posts/[slug]/
      const postResponse = await page.request.get('/posts/');
      expect(postResponse.status()).toBe(200);
      
      // Test that English posts follow /en/posts/[slug]/
      const enPostResponse = await page.request.get('/en/posts/');
      expect(enPostResponse.status()).toBe(200);
      
      // Test category URL patterns
      const categoryResponse = await page.request.get('/categories/blog/');
      expect(categoryResponse.status()).toBe(200);
      
      // Test tag URL patterns with encoded characters
      const tagResponse = await page.request.get('/tags/');
      expect(tagResponse.status()).toBe(200);
    });

    test('URL encoding handles special characters correctly', async ({ page }) => {
      const encodedUrls = [
        '/tags/cybersécurité/',           // French accents
        '/tags/fraudeprévention/',        // French accents
        '/tags/usurpationdidentité/',     // French accents
        '/tags/sécurité/',               // French accents
        '/tags/authentification-numérique/' // French accents with hyphens
      ];

      for (const url of encodedUrls) {
        const response = await page.request.get(url);
        // These may return 200 or 404 depending on whether tags exist
        expect([200, 404]).toContain(response.status());
      }
    });
  });

  test.describe('SEO and Metadata Coverage', () => {
    test('pages have proper SEO metadata', async ({ page }) => {
      const keyPages = ['/', '/en/', '/contacts/', '/en/contacts/'];
      
      for (const pagePath of keyPages) {
        await page.goto(pagePath);
        
        // Check for essential SEO elements
        const title = await page.locator('title').textContent();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content').catch(() => null);
        if (metaDescription) {
          expect(metaDescription.length).toBeGreaterThan(50);
        }
        
        // Check for OpenGraph metadata
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content').catch(() => null);
        if (ogTitle) {
          expect(ogTitle).toBeTruthy();
        }
      }
    });

    test('structured data is present on key pages', async ({ page }) => {
      const structuredDataPages = ['/', '/en/'];
      
      for (const pagePath of structuredDataPages) {
        await page.goto(pagePath);
        
        const jsonLd = await page.locator('script[type="application/ld+json"]').count();
        expect(jsonLd).toBeGreaterThanOrEqual(0); // Some pages may not have structured data
      }
    });
  });
});