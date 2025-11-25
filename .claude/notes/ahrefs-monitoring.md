# Ahrefs SEO Monitoring

## Quick Access URL

**All Issues Dashboard:** https://app.ahrefs.com/site-audit/8667120/issues?current=25-11-2025T144534P0100

## How to Check Current Issues

Use browserMCP to navigate to the URL above and check what Ahrefs issues are currently in play.

```
Use browserMCP:
1. Navigate to: https://app.ahrefs.com/site-audit/8667120/issues
2. Wait for page load (3-4 seconds)
3. Take snapshot to see current issues
4. Review the issue table for priorities
```

## Issue Categories to Monitor

- **Localization** - Hreflang and multilingual issues
- **Links** - Internal linking problems
- **Redirects** - 3XX redirect chains
- **Content** - Title/meta description issues
- **Sitemaps** - Sitemap configuration
- **Performance** - Page speed issues
- **External pages** - Broken external links

## Last Review

**Date:** 2025-11-25
**Status:** Fixed x-default hreflang reciprocal linking issue
- 44 pages: "Missing reciprocal hreflang (no return-tag)" - FIXED
- 23 pages: "More than one page for same language in hreflang" - FIXED

**Commit:** 328ca6d - fix(seo): correct x-default hreflang to always point to French

## Notes

- Always use browserMCP to check the latest issues before starting SEO work
- The URL includes the current crawl timestamp for consistency
- Focus on NEW issues and HIGH priority errors first
- Most link and redirect issues are low priority compared to SEO/indexing issues
