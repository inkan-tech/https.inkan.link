# SEO Audit System with Ahrefs Integration - Inkan.link

This guide explains how to use the SEO audit system for inkan.link with Ahrefs integration via browsermcp.

## 🎯 Overview

We have implemented a comprehensive SEO audit system that combines:
1. **Ahrefs Site Audit** - Industry-leading SEO platform with detailed crawl data
2. **browsermcp** - MCP server to programmatically access Ahrefs web interface
3. **Lighthouse** - Google's open-source SEO audit tool for validation
4. **Automated Testing** - Playwright tests to prevent regressions

## 📋 Prerequisites

### 1. Ahrefs Access
- Active Ahrefs subscription with Site Audit feature
- Inkan.link project set up in Ahrefs Site Audit
- Access credentials for https://app.ahrefs.com/

### 2. browsermcp MCP Server
The browsermcp server should be configured in your VSCode `mcp.json`:

```json
{
  "servers": {
    "browsermcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

### 3. Optional: Lighthouse CLI
```bash
npm install -g lighthouse
```

## 🚀 Quick Start

### Method 1: Use the Slash Command (Recommended)

```
/seo-audit-ahrefs
```

This will:
1. Prompt you to use browsermcp to access Ahrefs
2. Guide you through extracting issue data
3. Run Lighthouse audit for validation
4. Triage and prioritize all issues
5. Provide step-by-step fix instructions

### Method 2: Activate the SEO Expert Agent

In Claude Code, say:
```
Activate the SEO expert agent for inkan.link using Ahrefs data
```

The agent will autonomously:
1. Request browsermcp access to Ahrefs
2. Extract all site audit issues
3. Run Lighthouse for comparison
4. Triage by priority (P0-P3)
5. Fix critical and high-priority issues
6. Create automated tests for each fix
7. Validate improvements
8. Provide comprehensive report

## 📊 How to Use browsermcp with Ahrefs

### Step 1: Initial Data Extraction

Ask Claude Code:
```
Use browsermcp to navigate to https://app.ahrefs.com/site-audit/ and:
1. Open the inkan.link project
2. Extract the site health score
3. Get the top 20 errors from the "All issues" tab
4. For each error, extract:
   - Issue name
   - Number of affected pages
   - First 5 affected URLs
   - Ahrefs recommended fix
5. Format as markdown table
```

### Step 2: Detailed Issue Investigation

For specific issues:
```
Use browsermcp to navigate to Ahrefs site audit for inkan.link and:
1. Click on the "[specific issue name]" issue
2. Export the full list of affected URLs
3. Get the detailed explanation and fix recommendation from Ahrefs
4. Take a screenshot of the issue details page
```

### Step 3: Post-Fix Validation

After implementing fixes:
```
Use browsermcp to check Ahrefs site audit for inkan.link and verify:
1. Has the health score improved?
2. How many instances of "[issue name]" remain?
3. Are there any new issues introduced?
4. Take a screenshot of the updated dashboard
```

## 🏗️ Typical Workflow

### Phase 1: Discovery (30 minutes)
1. Run `/seo-audit-ahrefs` command
2. Use browsermcp to extract Ahrefs data
3. Run local Lighthouse audit: `lighthouse https://inkan.link/ --view`
4. Create unified issue list combining both sources

### Phase 2: Triage (15 minutes)
1. Categorize issues by priority (P0-P3)
2. Estimate effort for each fix
3. Create fix plan prioritizing high-impact, low-effort items
4. Document current state with screenshots from Ahrefs

### Phase 3: Implementation (2-4 hours)
For each prioritized issue:
1. Document current state (Ahrefs screenshot + description)
2. Implement fix following best practices
3. Test locally
4. Create Playwright test to prevent regression
5. Verify with Lighthouse

### Phase 4: Validation (30 minutes)
1. Re-run Lighthouse: `npm run seo:audit`
2. Use browsermcp to check Ahrefs (may need to wait for recrawl)
3. Run automated tests: `npx playwright test tests/seo/`
4. Generate before/after report

### Phase 5: Monitoring (Ongoing)
1. Schedule Ahrefs recrawl (if manual crawl available)
2. Monitor health score trend over 1 week
3. Set up alerts for score drops
4. Plan next audit in 30 days

## 🔧 Common Issue Patterns

### Issue: Missing Meta Descriptions (Ahrefs Error)

**How browsermcp helps:**
```
Use browsermcp to show me all URLs from Ahrefs that are missing meta descriptions for inkan.link
```

**Fix:**
```html
<meta name="description" content="Compelling description (120-160 chars) with target keywords">
```

**Test:**
```javascript
// tests/seo/meta-descriptions.spec.js
test('all pages have meta descriptions', async ({ page }) => {
  const pages = ['/', '/pricing', '/about'];
  for (const url of pages) {
    await page.goto(`https://inkan.link${url}`);
    const meta = await page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /.{120,160}/);
  }
});
```

### Issue: Broken Internal Links (Ahrefs Warning)

**How browsermcp helps:**
```
Use browsermcp to export the list of broken internal links from Ahrefs site audit for inkan.link, including:
- Source URL
- Destination URL (404)
- Anchor text
```

**Fix:**
```javascript
// Option 1: Fix the link
<a href="/correct-url">Text</a>

// Option 2: Add redirect
// In server config or .htaccess:
Redirect 301 /old-url /new-url
```

**Test:**
```javascript
// tests/seo/no-broken-links.spec.js
test('no broken internal links', async ({ page }) => {
  await page.goto('https://inkan.link/');
  const links = await page.locator('a[href^="/"]').all();

  for (const link of links) {
    const href = await link.getAttribute('href');
    const response = await page.request.get(`https://inkan.link${href}`);
    expect(response.status()).toBeLessThan(400);
  }
});
```

### Issue: Redirect Chains (Ahrefs Warning)

**How browsermcp helps:**
```
Use browsermcp to show me all redirect chains (3+ redirects) from Ahrefs site audit for inkan.link
```

**Fix:**
```javascript
// Before: URL A → URL B → URL C → URL D
// After: Direct redirects
Redirect 301 /url-a /url-d
Redirect 301 /url-b /url-d
Redirect 301 /url-c /url-d
```

### Issue: Images Without Alt Text (Ahrefs Warning)

**How browsermcp helps:**
```
Use browsermcp to get the list of images missing alt text from Ahrefs, with their URLs and pages
```

**Fix:**
```html
<!-- Before -->
<img src="/product.jpg">

<!-- After -->
<img src="/product.jpg" alt="Inkan.link digital signature product interface showing document signing flow">
```

**Test:**
```javascript
// tests/seo/image-alt-text.spec.js
test('all images have alt text', async ({ page }) => {
  await page.goto('https://inkan.link/');
  const images = await page.locator('img').all();

  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt.length).toBeGreaterThan(5);
  }
});
```

## 📈 Success Metrics

### Ahrefs Metrics (Primary)
- **Health Score**: Target ≥ 90%
- **Errors**: Target = 0
- **Warnings**: Target < 10
- **Notices**: Target < 20

### Lighthouse Metrics (Secondary)
- **SEO Score**: Target = 100/100
- **Performance**: Target ≥ 90/100
- **Accessibility**: Target ≥ 95/100
- **Best Practices**: Target ≥ 95/100

### Business Impact
- Organic traffic increase: Track in Google Analytics
- Search rankings: Track top 10 target keywords
- Click-through rate: Monitor in Google Search Console

## 🎯 Priority Guidelines

### P0 - Critical (Fix Immediately)
**From Ahrefs Errors:**
- Pages blocked by robots.txt that should be crawled
- 5xx server errors on important pages
- Missing H1 tags
- Missing title tags
- Missing meta descriptions (on key pages)
- Orphan pages (not linked from anywhere)

### P1 - High (Fix This Week)
**From Ahrefs Warnings:**
- Redirect chains (3+ redirects)
- Slow load times (>3s) on key pages
- Broken internal links
- Duplicate title/meta tags
- Images without alt text (on key pages)
- Missing canonical tags

### P2 - Medium (Fix This Month)
**From Ahrefs Notices:**
- Suboptimal title/description length
- Missing Open Graph/Twitter Cards
- Unoptimized images
- Low internal linking
- Missing structured data

### P3 - Low (Nice to Have)
- Minor accessibility issues
- Image format optimization
- Advanced performance tuning

## 🔄 Ahrefs Recrawl Timing

**Important**: After fixing issues, you need to wait for Ahrefs to recrawl the site.

### Recrawl Schedule
- **Automatic**: Varies by Ahrefs plan (daily to weekly)
- **Manual**: Available on higher-tier plans

### Validation Strategy
1. **Immediate**: Validate with Lighthouse (instant feedback)
2. **Short-term**: Check Ahrefs in 24-48 hours for automatic recrawl
3. **Verification**: Use browsermcp to monitor issue count trend

### What to Check Post-Recrawl
```
Use browsermcp to verify in Ahrefs after recrawl:
1. Health score changed from X% to Y%
2. "[Issue name]" count decreased from X to Y
3. Affected pages for "[issue]" now show as resolved
4. No new issues introduced in last crawl
```

## 📝 Report Template

Use this template when completing audits:

```markdown
# SEO Audit Report - Inkan.link
**Date**: [Current Date]
**Auditor**: [Your Name/Agent Name]

## Executive Summary
- **Ahrefs Health Score**: Before X% → After Y% (ΔZ%)
- **Lighthouse SEO**: Before X/100 → After Y/100 (ΔZ)
- **Issues Fixed**: X/Y
- **Tests Created**: X new tests

## Data Sources
- **Ahrefs Site Audit**: Last crawl [date]
- **Lighthouse**: [date/time]
- **browsermcp Session**: [session details]

## Issues Resolved

### Critical (P0) - X Fixed
1. **[Issue Name]**
   - Affected: X pages
   - Fix: [Description]
   - Test: `tests/seo/[filename].spec.js`
   - Verification: [Ahrefs screenshot]

[Repeat for each issue]

## Metrics Comparison
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Ahrefs Health | X% | Y% | +Z% |
| Total Errors | X | Y | -Z |
| Lighthouse SEO | X | Y | +Z |

## Next Steps
1. Monitor Ahrefs recrawl for confirmation
2. [Specific recommendations]
3. Schedule next audit: [Date]
```

## 🛠️ Troubleshooting

### browsermcp Not Working
1. Check VSCode MCP configuration
2. Verify `@browsermcp/mcp` is accessible: `npx @browsermcp/mcp --version`
3. Restart VSCode to reload MCP servers
4. Check Claude Code output logs for errors

### Ahrefs Shows Different Issues Than Lighthouse
- **Expected**: Different tools have different checks
- **Action**: Fix issues found in BOTH tools first
- **Strategy**: Use Ahrefs for comprehensive crawl data, Lighthouse for validation

### Fixes Not Showing in Ahrefs
- **Reason**: Awaiting recrawl
- **Action**: Wait 24-48 hours for automatic recrawl
- **Validation**: Use Lighthouse to confirm fix immediately
- **Monitoring**: Use browsermcp to check Ahrefs daily

## 📚 Additional Resources

- **Ahrefs Academy**: https://ahrefs.com/academy
- **Lighthouse Docs**: https://developer.chrome.com/docs/lighthouse/
- **browsermcp**: https://github.com/browsermcp/mcp
- **Playwright Testing**: https://playwright.dev/

## 🤝 Getting Help

If you encounter issues:
1. Check this guide first
2. Review Ahrefs documentation for specific issues
3. Use `/seo-audit-ahrefs` command for guided workflow
4. Activate SEO expert agent for autonomous fixes

---

**Last Updated**: November 2025
**Maintained By**: SEO Team @ Inkan.link
