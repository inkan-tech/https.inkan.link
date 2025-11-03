# Setup Ahrefs-Based SEO Testing System

## Context
This prompt guides you to implement a comprehensive, generic SEO testing system based on Ahrefs Site Audit recommendations using Playwright.

## Objective
Create automated SEO tests that validate ALL pages on the site against Ahrefs best practices, preventing regressions and maintaining a 99-100% health score.

## Implementation Steps

### 1. Analyze Site Structure

First, understand the site's page structure:

```bash
# For Hugo sites
find public -name "index.html" -type f | sed 's|public||' | sed 's|/index.html||' | sort

# Or check sitemap
curl https://[your-domain]/sitemap.xml
```

Identify:
- Main pages (homepage, about, contact, etc.)
- Localized versions (EN, FR, etc.)
- Blog/post pages
- Utility pages (legal, privacy, etc.)

### 2. Create Page List

Build a comprehensive array of ALL pages to test:

```javascript
const ALL_PAGES = {
  root: [
    '/',
    '/contacts/',
    '/legal/',
    // ... all root pages
  ],
  en: [
    '/en/',
    '/en/contacts/',
    // ... all EN pages
  ],
  fr: [
    '/fr/',
    // ... all FR pages
  ]
};

const PAGES_TO_TEST = [...ALL_PAGES.root, ...ALL_PAGES.en, ...ALL_PAGES.fr];
```

### 3. Implement Generic Validation Rules

Create tests that apply to ALL pages, grouped by priority:

#### **P0 Critical (Must Pass for Every Page)**
- Returns 200 status (no 404s)
- Has outgoing internal links (not orphaned)
- Valid HTML lang attribute matching locale

#### **P1 High Priority (SEO Fundamentals)**
- Meta description 120-160 chars
- Unique, descriptive titles (30+ chars)
- Canonical URLs
- Proper hreflang tags (if multilingual)

#### **P2 Medium Priority (Rich Results)**
- Valid JSON-LD structured data
- WebPage schema minimum
- Content-specific schemas (Organization, ContactPage, Blog, etc.)
- Sufficient word count (250+)
- Exactly one H1 heading
- Proper heading hierarchy (H1 -> H2 -> H3)

#### **Accessibility**
- Descriptive alt text on all images (>3 chars)

#### **Infrastructure**
- Sitemap.xml accessible and contains all pages
- Robots.txt references sitemap
- IndexNow verification file (if configured)

#### **Performance & Best Practices**
- Open Graph tags for social sharing
- Twitter Card tags
- Favicon configured

### 4. Smart Exclusions

Exclude utility pages from certain requirements:

```javascript
// Exclude from structured data requirement
const pagesWithStructuredData = PAGES_TO_TEST.filter(p =>
  !p.includes('offline') &&
  !p.includes('privacy') &&
  !p.includes('terms')
);

// Exclude from word count requirement
if (pagePath.includes('offline') ||
    pagePath.includes('post-register') ||
    pagePath.includes('privacy') ||
    pagePath.includes('terms')) {
  continue; // skip word count check
}
```

### 5. Test File Structure

```javascript
/**
 * Ahrefs SEO Recommendations - Generic Page Verification Tests
 *
 * Run with: npx playwright test --grep @ahrefs
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://[your-production-domain]';

// Page list here...

test.describe('P0 Critical - Generic Page Health @ahrefs', () => {
  test('all pages should return 200 status (no 404 errors)', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      const response = await page.request.get(`${BASE_URL}${pagePath}`);
      expect(response.status(), `${pagePath} should return 200`).toBe(200);
    }
  });

  // ... more tests
});

// ... more test groups
```

### 6. Package.json Integration

Add test script:

```json
{
  "scripts": {
    "test:seo": "playwright test tests/seo/ --grep @ahrefs"
  }
}
```

### 7. Run and Validate

```bash
# Run all SEO tests
npm run test:seo

# Run on specific browser
npx playwright test --grep @ahrefs --project=chromium

# Run in UI mode for debugging
npx playwright test --grep @ahrefs --ui
```

## Key Principles

### 1. Generic Over Specific
❌ Bad: Individual tests for each page
```javascript
test('pricing page should have meta description', ...)
test('about page should have meta description', ...)
```

✅ Good: Generic rule applied to all pages
```javascript
test('all pages should have meta description', async ({ page }) => {
  for (const pagePath of PAGES_TO_TEST) {
    // validate meta description
  }
});
```

### 2. Automatic Coverage
When you add a new page to the site, it's automatically tested if you add it to `PAGES_TO_TEST`. No need to write new tests.

### 3. Intelligent Warnings vs Failures
```javascript
// Warn but don't fail for long titles
if (title.length > 60) {
  console.warn(`⚠️  ${pagePath} title is ${title.length} chars (optimal: 50-60)`);
}
```

### 4. Flexible Validation
```javascript
// Handle different JSON-LD formatting
expect(combinedSchema).toMatch(/"@type"\s*:\s*"Product"/);
// Instead of strict: expect(combinedSchema).toContain('"@type":"Product"');
```

## Expected Outcomes

After implementation:
- **100+ tests** across all browsers (generic rules × browser count)
- **Automatic regression prevention** on all pages
- **99-100% Ahrefs health score** maintenance
- **Single point of maintenance** (update one rule → affects all pages)

## Test Coverage Example

For a site with 17 pages (9 EN + 8 FR) and 23 generic rules:
- **Desktop**: Chromium (23 tests), WebKit (23 tests)
- **Mobile**: Mobile Chrome (23 tests), Mobile Safari (23 tests)
- **Tablet**: iPad (23 tests)
- **Total**: 115 test executions

## Validation Checklist

Before considering implementation complete:

- [ ] All main content pages included in `PAGES_TO_TEST`
- [ ] Localized versions (EN/FR/etc.) included
- [ ] BASE_URL set to production domain
- [ ] P0, P1, P2 tests implemented
- [ ] Smart exclusions for utility pages configured
- [ ] Structured data validation includes content-specific schemas
- [ ] Package.json has `test:seo` script
- [ ] All tests pass on production site
- [ ] Tests tagged with `@ahrefs` for filtering

## Common Adaptations

### For E-commerce Sites
Add product-specific schemas:
```javascript
'/products/': /"@type"\s*:\s*"Product"/,
'/products/[slug]': /"@type"\s*:\s*"Product"/,
```

### For Multi-language Sites
Adjust language detection:
```javascript
const expectedLang = pagePath.startsWith('/fr') ? 'fr' :
                     pagePath.startsWith('/de') ? 'de' :
                     pagePath.startsWith('/es') ? 'es' : 'en';
```

### For SPA/React Sites
Wait for client-side rendering:
```javascript
await page.goto(`${BASE_URL}${pagePath}`);
await page.waitForSelector('main'); // or your main content selector
```

## Maintenance

### When Adding New Pages
1. Add to `PAGES_TO_TEST` array
2. Run tests: `npm run test:seo`
3. Verify all tests pass
4. Commit changes

### When Ahrefs Reports New Issues
1. Identify if it's a site-wide or page-specific issue
2. If site-wide: add new generic validation rule
3. If page-specific: add to exclusion list or create specific test
4. Run tests to verify fix
5. Commit test changes alongside code fixes

### Regular Audits
```bash
# Weekly: Run full test suite
npm run test:seo

# Monthly: Compare with Ahrefs dashboard
# Check for new recommendations
# Update tests if needed
```

## Success Metrics

You've successfully implemented the system when:
1. ✅ All tests pass (115/115 or similar based on your page count)
2. ✅ Adding new pages automatically includes them in tests
3. ✅ Single rule update affects all relevant pages
4. ✅ Ahrefs health score maintained at 99-100%
5. ✅ Zero SEO regressions detected in production deployments

## Example Output

```
Running 115 tests using 4 workers

✓ P0 Critical - all pages should return 200 status (no 404 errors)
✓ P0 Critical - all pages should have at least one outgoing internal link
✓ P0 Critical - all pages should have valid HTML lang attribute
✓ P1 High Priority - all pages should have meta description in optimal range
✓ P1 High Priority - all pages should have unique, descriptive title tags
...

115 passed (1.2m)
⚠️  5 pages with long titles (65-83 chars) - may be truncated in search results
```

## Next Steps

After setting up this testing system:
1. Integrate into CI/CD pipeline
2. Run before each production deployment
3. Set up automated weekly reports
4. Track SEO metrics improvements over time
5. Share test results with team

---

**Note**: This testing approach is based on proven Ahrefs recommendations and has been successfully deployed on multiple production sites maintaining 99-100% health scores.
