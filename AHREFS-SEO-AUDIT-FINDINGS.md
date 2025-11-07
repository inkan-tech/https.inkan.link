# Ahrefs SEO Audit - High Priority Issues & Fixes

**Audit Date**: November 7, 2025
**Site**: https://inkan.link
**Total High-Priority Issues**: 4

---

## Executive Summary

Ahrefs identified 4 high-priority SEO issues affecting inkan.link. Investigation revealed that **Issues #10 and #13 share a common root cause**: the French homepage canonical tag incorrectly points to the English version instead of itself.

### Issues Overview:

1. ✅ **Issue #8**: Multiple H1 tags (2 pages affected)
2. ⚠️ **Issue #10**: Hreflang to non-canonical (1 page - caused by #13)
3. ✅ **Issue #9**: Page/SERP title mismatch (1 page)
4. 🔴 **Issue #13**: Non-canonical page in sitemap (1 page - **ROOT CAUSE**)

---

## Issue #8: Multiple H1 Tags

### Affected Pages:
1. **https://inkan.link/posts/blog-mon-patron-est-une-ia-2/** (French)
2. **https://inkan.link/en/posts/blog-my-boss-is-an-ai-2/** (English)

### Problem:
Both blog posts have **2 H1 tags** instead of 1:
- H1 #1: "Mon patron est une IA (2eme partie)" / "My Boss is an AI (Part 2)"
- H1 #2: "Mon Patron est une IA (2ème Partie)" / "My Boss is an AI (Part 2)" (slightly different capitalization)

### SEO Impact:
- **Medium**: Multiple H1 tags confuse search engines about page topic hierarchy
- Dilutes SEO value of the primary heading
- May cause incorrect SERP snippet selection

### Root Cause:
Duplicate H1 in blog post content (likely in the markdown file itself)

### Fix:
**File**: `content/posts/blog-mon-patron-est-une-ia-2.fr.md` and `.en.md`
- Remove duplicate H1 from markdown content
- Keep only the main title H1 (rendered by Hugo template)

### Verification:
```bash
# Check for H1 tags in built HTML
grep -n "<h1" public/posts/blog-mon-patron-est-une-ia-2/index.html
```

---

## Issue #10: Hreflang to Non-Canonical

### Affected Page:
**https://inkan.link/en/** (English homepage)

### Problem:
The English homepage has hreflang tags pointing to:
- `fr` → `https://inkan.link/` ✅ (correct)
- `en` → `https://inkan.link/en/` ✅ (correct)
- `x-default` → `https://inkan.link/en/` ✅ (correct)

But the **French homepage** (`https://inkan.link/`) has its canonical tag set to:
```html
<link rel="canonical" href="https://inkan.link/en/" />
```

This means:
1. French homepage points to English homepage as canonical
2. Hreflang from English page points to French page
3. But French page says "I'm not canonical, English is!"
4. **Circular reference / conflicting signals**

### SEO Impact:
- **High**: Confuses search engines about which version is authoritative
- May cause French homepage to not be indexed properly
- Wastes crawl budget on resolving conflicts

### Root Cause:
**SAME AS ISSUE #13** - French homepage canonical configuration error

### Fix:
**File**: `layouts/index.fr.html` or `layouts/partials/meta.html`
- Ensure French homepage canonical points to `https://inkan.link/`
- Not to `/en/`

---

## Issue #9: Page and SERP Titles Do Not Match

### Affected Page:
**https://inkan.link/posts/news-podcast-privacy-break-1/**

### Problem:
- **Page Title**: "Mon Patron est il une IA ?: La Menace des Deepfakes | Blog"
- **SERP Title** (Google shows): "Mon Patron est il une IA ?: La Menace des Deepfakes"
- Google **removes "| Blog" suffix**

### SEO Impact:
- **Low-Medium**: Google rewrites title when it deems suffix redundant
- "| Blog" is obvious context clutter for search users
- Wasted characters (title should be 50-60 chars optimal)

### Root Cause:
Title template in `layouts/partials/meta.html` adds "| Blog" suffix for all blog posts:
```go
{{ $blogSuffix := cond (eq .Language.Lang "fr") "Blog" "Blog" }}
{{ $title = printf "%s | %s" .Title $blogSuffix }}
```

### Fix:
**File**: `layouts/partials/meta.html` (lines 14-16)

**Option 1** (Recommended): Remove "| Blog" suffix entirely for blog posts
```go
{{- else if eq .Type "posts" -}}
  {{ $title = .Title }}  {{/* No suffix */}}
```

**Option 2**: Use site name instead
```go
{{- else if eq .Type "posts" -}}
  {{ $title = printf "%s | %s" .Title .Site.Title }}
```

**Option 3**: Shorten suffix
```go
{{ $blogSuffix := cond (eq .Language.Lang "fr") "Blog Inkan" "Inkan Blog" }}
```

### Recommendation:
Use **Option 2** - Replace "| Blog" with "| Inkan.link" for better branding and SEO.

---

## Issue #13: Non-Canonical Page in Sitemap ⭐ ROOT CAUSE

### Affected Page:
**https://inkan.link/** (French homepage)

### Problem:
The French homepage:
- ✅ Is included in sitemap: `https://inkan.link/fr/sitemap.xml`
- ❌ Has canonical tag: `<link rel="canonical" href="https://inkan.link/en/" />`
- ❌ **Should have**: `<link rel="canonical" href="https://inkan.link/" />`

**Hugo Build Output**:
```
Canonical: http://localhost:1313/en/  ← WRONG!
```

### SEO Impact:
- **CRITICAL**: Tells search engines French homepage is a duplicate of English
- French homepage may not be indexed despite being in sitemap
- Wastes crawl budget
- **Causes Issue #10** - creates hreflang conflicts

### Root Cause Analysis:

**Checking canonical generation in Hugo templates**:

1. **layouts/partials/meta.html** (lines 26-30):
```go
{{- if isset .Params "canonical" -}}
  <link rel="canonical" href="{{ .Params.canonical }}" />
{{- else -}}
  <link rel="canonical" href="{{ .Permalink }}" />
{{- end }}
```

The template uses `{{ .Permalink }}` which should be correct. The issue is likely:

**Hypothesis 1**: French homepage redirects to English in config
**Hypothesis 2**: `.Permalink` is incorrectly set for homepage
**Hypothesis 3**: There's a custom canonical parameter in front matter

### Fix Location:
Need to investigate:
1. `config.toml` - Check `defaultContentLanguage` and redirects
2. `layouts/index.fr.html` - Check if there's custom canonical logic
3. Hugo multilingual configuration

### Verification Steps:
```bash
# Check built HTML canonical
curl -s https://inkan.link/ | grep canonical

# Check Hugo permalink generation
hugo server
curl -s http://localhost:1313/ | grep canonical
```

### Required Fix:
Ensure the French homepage (`/`) has:
```html
<link rel="canonical" href="https://inkan.link/" />
```
NOT:
```html
<link rel="canonical" href="https://inkan.link/en/" />
```

---

## Implementation Plan

### Priority Order:
1. **🔴 CRITICAL**: Fix Issue #13 (French homepage canonical) - **FIXES #10 TOO**
2. **✅ HIGH**: Fix Issue #8 (Remove duplicate H1 tags)
3. **✅ MEDIUM**: Fix Issue #9 (Optimize title tags)

### Testing Strategy:
1. Local Hugo build verification
2. Playwright automated SEO tests
3. Manual verification with curl/browser
4. Deploy to staging
5. Re-run Ahrefs crawl to verify fixes

---

## Playwright Test Suite

Created comprehensive test suite: `tests/seo-audit.spec.js`

**Tests include**:
- H1 tag count verification (exactly 1 per page)
- Hreflang canonical validation
- Title tag optimization checks
- Sitemap canonical verification
- Automated report generation

**Run tests**:
```bash
npx playwright test tests/seo-audit.spec.js
```

---

## Next Steps

1. ✅ Investigation complete - all 4 issues identified
2. ⏳ Implement fixes (in progress)
3. ⏳ Verify fixes with Playwright tests
4. ⏳ Deploy to production
5. ⏳ Request Ahrefs re-crawl
6. ⏳ Verify all issues resolved
