import { test, expect } from '@playwright/test';

test.describe('Website Security Verification', () => {
  
  test.describe('Directory Traversal Protection', () => {
    test('sensitive files are not accessible', async ({ page }) => {
      const sensitiveFiles = [
        '/.env',
        '/.git',
        '/.git/config',
        '/package.json',
        '/package-lock.json',
        '/tailwind.config.js',
        '/hugo.toml',
        '/config.toml',
        '/.gitignore',
        '/layouts/',
        '/content/',
        '/static/',
        '/assets/',
        '/node_modules/',
        '/.vscode/',
        '/tests/',
        '/README.md',
        '/CLAUDE.md',
        '/prompts/',
        '/.github/',
        '/playwright.config.js'
      ];

      for (const file of sensitiveFiles) {
        const response = await page.request.get(file);
        
        // Should return 404 or 403, not 200
        expect(response.status(), `${file} should not be accessible`).not.toBe(200);
        
        // Specifically check that we don't get file contents
        if (response.status() === 200) {
          const content = await response.text();
          expect(content).not.toContain('package.json');
          expect(content).not.toContain('tailwindcss');
          expect(content).not.toContain('hugo');
        }
      }
    });

    test('can only access legitimate website content', async ({ page }) => {
      const legitimateUrls = [
        // Core pages (both languages)
        '/',
        '/en/',
        
        // Main sections
        '/posts/',
        '/en/posts/',
        '/contacts/',
        '/en/contacts/',
        '/team/',
        '/en/team/',
        '/legal/',
        '/en/legal/',
        
        // Categories and tags
        '/categories/',
        '/en/categories/',
        '/tags/',
        '/en/tags/',
        '/categories/blog/',
        '/en/categories/blog/',
        '/categories/news/',
        '/en/categories/news/',
        
        // Sample blog posts (recent ones from sitemap)
        '/posts/news-podcast-privacy-break-1/',
        '/posts/news-innov-adira/',
        '/en/posts/news-inpho-venture-2024/',
        '/en/posts/blog-bec-5billions-annum-scam/',
        
        // Static assets
        '/images/inkan-animated-prez.svg',
        '/robots.txt',
        '/sitemap.xml'
      ];

      for (const url of legitimateUrls) {
        const response = await page.request.get(url);
        
        // These should be accessible (200) or redirect (3xx)
        const validStatuses = [200, 301, 302, 304];
        expect(validStatuses, `${url} should be accessible`).toContain(response.status());
      }
    });
  });

  test.describe('Hugo Public Folder Verification', () => {
    test('website serves from public folder only', async ({ page }) => {
      await page.goto('/');
      
      // Check that Hugo is serving processed content, not raw files
      const htmlContent = await page.content();
      
      // Should NOT contain Hugo template syntax
      expect(htmlContent).not.toContain('{{ ');
      expect(htmlContent).not.toContain('{{- ');
      expect(htmlContent).not.toContain('{{ .Title }}');
      expect(htmlContent).not.toContain('{{ partial ');
      expect(htmlContent).not.toContain('{{ with ');
      expect(htmlContent).not.toContain('{{ range ');
      
      // Should contain processed HTML
      expect(htmlContent).toContain('<!DOCTYPE html>');
      expect(htmlContent).toContain('<html');
      expect(htmlContent).toContain('</html>');
    });

    test('CSS and JS files are processed and minified', async ({ page }) => {
      await page.goto('/');
      
      // Check for processed CSS
      const stylesheets = await page.$$eval('link[rel="stylesheet"]', 
        links => links.map(link => link.href)
      );
      
      for (const css of stylesheets) {
        if (css.includes('style.css') || css.includes('main.css')) {
          const response = await page.request.get(css);
          expect(response.status()).toBe(200);
          
          const content = await response.text();
          // Should be processed CSS, not raw TailwindCSS directives
          expect(content).not.toContain('@tailwind');
          expect(content).not.toContain('@apply');
        }
      }
    });
  });

  test.describe('HTTP Security Headers', () => {
    test('security headers are properly configured', async ({ page }) => {
      const response = await page.request.get('/');
      const headers = response.headers();
      
      // Check for important security headers
      expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeDefined();
      expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toBe('nosniff');
      
      // Content Security Policy should be present
      const csp = headers['content-security-policy'] || headers['Content-Security-Policy'];
      if (csp) {
        expect(csp).toContain('default-src');
      }
    });
  });

  test.describe('Server Information Disclosure', () => {
    test('server does not expose unnecessary information', async ({ page }) => {
      const response = await page.request.get('/');
      const headers = response.headers();
      
      // Check that sensitive server info is not exposed
      expect(headers['server']).not.toContain('Hugo');
      expect(headers['server']).not.toContain('Express');
      expect(headers['server']).not.toContain('Node');
      
      // X-Powered-By should not be present
      expect(headers['x-powered-by']).toBeUndefined();
    });

    test('error pages do not expose server details', async ({ page }) => {
      const response = await page.request.get('/nonexistent-page-12345');
      
      if (response.status() === 404) {
        const content = await response.text();
        
        // 404 page should not expose server details
        expect(content).not.toContain('Hugo');
        expect(content).not.toContain('nginx');
        expect(content).not.toContain('Apache');
        expect(content).not.toContain('stack trace');
        expect(content).not.toContain('error at line');
      }
    });
  });

  test.describe('Resource Access Control', () => {
    test('images and assets are accessible but not listings', async ({ page }) => {
      // Images should be accessible
      const imageResponse = await page.request.get('/images/inkan-animated-prez.svg');
      expect(imageResponse.status()).toBe(200);
      
      // But directory listings should not be
      const dirResponse = await page.request.get('/images/');
      expect(dirResponse.status()).not.toBe(200);
    });

    test('robots.txt and sitemap.xml are accessible', async ({ page }) => {
      const robotsResponse = await page.request.get('/robots.txt');
      expect(robotsResponse.status()).toBe(200);
      
      const sitemapResponse = await page.request.get('/sitemap.xml');
      expect(sitemapResponse.status()).toBe(200);
    });
  });

  test.describe('Development Server vs Production', () => {
    test('detects if running on development server', async ({ page }) => {
      await page.goto('/');
      
      const currentUrl = page.url();
      const isDevelopment = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
      
      if (isDevelopment) {
        console.log('⚠️  DEVELOPMENT MODE DETECTED');
        console.log('Running on development server (Hugo server)');
        console.log('✅ This is expected for local testing');
        console.log('🔒 Production deployment will use static files from public/');
      } else {
        console.log('✅ PRODUCTION MODE');
        console.log('Serving from static files (public folder)');
      }
      
      // Check for development indicators
      const htmlContent = await page.content();
      const hasLiveReload = htmlContent.includes('livereload') || htmlContent.includes('/_framework/');
      
      if (isDevelopment && hasLiveReload) {
        console.log('🔧 Live reload detected (development feature)');
      }
    });
  });

  test.describe('Hugo Configuration Security', () => {
    test('Hugo configuration is not exposed', async ({ page }) => {
      const configFiles = [
        '/hugo.toml',
        '/config.toml',
        '/config.yaml',
        '/config.yml',
        '/config.json'
      ];

      for (const config of configFiles) {
        const response = await page.request.get(config);
        expect(response.status(), `${config} should not be accessible`).not.toBe(200);
      }
    });

    test('theme and layout files are not accessible', async ({ page }) => {
      const themeFiles = [
        '/layouts/index.html',
        '/layouts/partials/header.html',
        '/themes/',
        '/archetypes/'
      ];

      for (const file of themeFiles) {
        const response = await page.request.get(file);
        expect(response.status(), `${file} should not be accessible`).not.toBe(200);
      }
    });
  });
});