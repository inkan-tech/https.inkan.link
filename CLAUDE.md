# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL DESIGN PRINCIPLES - ALWAYS FOLLOW

### UI/UX Design Standards - MANDATORY
- **CLEAN & MINIMAL**: Always prefer clean, minimal designs over busy, flashy ones
- **NO EXCESSIVE EFFECTS**: Avoid heavy animations, multiple gradients, excessive shadows, or over-engineered hover effects
- **PROFESSIONAL TONE**: This is a corporate cybersecurity site - maintain professional, enterprise-ready aesthetics
- **SUBTLE ENHANCEMENTS**: Use subtle improvements rather than dramatic visual changes
- **CONSISTENCY FIRST**: Maintain consistency with existing design patterns before adding new ones

### Japanese Design Philosophy - MA (間)
- **Negative Space**: Embrace whitespace and clean layouts
- **Simplicity**: Less is more - avoid visual clutter
- **Balance**: Harmonious proportions and subtle color usage
- **Restraint**: Resist the urge to add more when less will do

### Approved Design Elements
- ✅ Clean typography with proper hierarchy
- ✅ **SENTENCE CASE TITLES**: Use sentence case, not Title Case ("Real performance" not "Real Performance")
- ✅ Subtle shadows and borders  
- ✅ Simple, functional animations (hover states, transitions)
- ✅ Professional color usage (primary/secondary from theme)
- ✅ Consistent spacing and alignment
- ✅ Clear navigation and user flow

### FORBIDDEN Design Elements  
- ❌ Multiple competing gradients
- ❌ Excessive backdrop filters or blur effects
- ❌ Over-animated elements (scaling, bouncing, complex transforms)
- ❌ Busy background patterns or overlays
- ❌ Complex layered visual effects
- ❌ Flashy or gimmicky UI elements
- ❌ Inconsistent styling or one-off design patterns
- ❌ **TITLE CASE CAPITALIZATION**: Never use "Every Word Capitalized" titles

### Code Quality Standards
- **Hugo Best Practices**: Follow Hugo's templating conventions
- **TailwindCSS**: Use utility classes efficiently, avoid custom CSS unless necessary
- **Performance**: Optimize images, minimize CSS/JS, use lazy loading appropriately
- **Accessibility**: Ensure proper ARIA labels, semantic HTML, keyboard navigation
- **SEO**: Maintain proper meta tags, structured data, and semantic markup

## Project Overview

This is Inkan.link's corporate website, built with Hugo static site generator and TailwindCSS. The site features bilingual content (French/English) focusing on cybersecurity, deepfake protection, and digital authentication solutions. The main product showcased is Sealfie (https://sealf.ie).

## Architecture

### Technology Stack
- **Hugo**: Static site generator (v0.130.0 minimum, max v0.155.1)
- **TailwindCSS**: v4.1.7 for styling (do NOT upgrade to 4.x as noted in package.json)
- **AlpineJS**: v3.14.9 for interactive components
- **PostCSS**: CSS processing
- **Matomo**: Analytics tracking

### Key Directories
- `content/`: Markdown content files (posts, pages) with language-specific versions (.en.md, .fr.md)
- `layouts/`: Hugo template files including partials and language-specific home pages
- `assets/`: CSS, JS, and images (processed by Hugo's asset pipeline)
- `static/`: Static files served directly (favicons, PDFs, SVGs)
- `i18n/`: Translation strings for UI elements
- `public/`: Generated static site (auto-generated, don't edit)

### Content Architecture
- **Bilingual setup**: French (default) and English with language-specific URLs
- **Content types**: Blog posts, news articles, team pages, legal pages
- **Taxonomies**: Categories (Blog/News) and tags for content organization
- **Featured images**: All posts have featured_image parameter with responsive WebP processing

## Development Commands

### Essential Commands
```bash
# Development server with live reload
hugo server
# or with npm script
npm run watch:hugo

# Build for production
hugo --minify
# or
npm run build

# TailwindCSS compilation
npx @tailwindcss/cli -i ./assets/css/main.css -o ./assets/css/style.css

# Watch TailwindCSS changes
npm run watch:tw

# Run both Hugo server and TailwindCSS watch concurrently
npm start
```

### Testing
```bash
# Basic Hugo validation
npm test
# (runs hugo command to check for errors)
```

## Content Management

### Blog Posts Structure
```yaml
---
title: "Post Title"
fronttitle: "Alternative front page title" # optional
date: 2024-01-01T10:00:00+02:00
draft: false
language: fr # or en
featured_image: images/posts/filename.webp
summary: "Brief description"
description: "SEO description"
author: "Nicolas Thomas"
categories: blog # or news
tags: [Tag1, Tag2]
---
```

### Language Handling
- French content: `.fr.md` suffix, default language
- English content: `.en.md` suffix
- Language-specific navigation in `config.toml`
- Automatic language switching via `layouts/partials/allLanguages.html`

## Styling & Design

### Color Scheme (Japanese-inspired)
- **Primary**: Aka (Japanese Red) - #D05A6E
- **Primary Light**: Beni (Safflower Red) - #E83015  
- **Secondary**: Nando (Dark Navy) - #192F60
- **Dark theme**: Sumi (Japanese Black) - #1A1A1A
- **Neutral**: Enhanced grays for better contrast

### Custom CSS Classes
- `hanko-badge`: Circular badge styling
- Japanese-inspired border radius: `hanko`, `wabi-sabi`
- Custom shadows: `hanko`, `inkan`
- Background patterns: `washi`, `seigaiha`, `asanoha`

### Responsive Design
- Mobile-first approach with TailwindCSS
- Custom breakpoints including `xs: 475px`
- AlpineJS for mobile navigation and dark mode toggle

## Image Processing

### Hugo Image Processing
```go
{{ $image := resources.Get "images/posts/filename.jpg" }}
{{ with $image }}
{{ $processed := (.Resize "500x webp q90").RelPermalink }}
<img src="{{ $processed }}" ... />
{{ end }}
```

### Image Locations
- Post images: `assets/images/posts/`
- Page images: `assets/images/pages/`
- Global assets: `assets/images/global/`
- Static images: `static/images/` (direct serving)

## Analytics & Tracking

### Matomo Integration
- Site ID: 2
- Cloud instance: sealfie.matomo.cloud
- Configured in `layouts/_default/baseof.html`
- Tag manager container included

## Deployment

### GitHub Pages
- Built files go to `public/` directory
- CNAME file present for custom domain (inkan.link)
- Hugo version constraints in `config.toml`

### Build Process
1. TailwindCSS processes `assets/css/main.css` → `assets/css/style.css`
2. **PurgeCSS** removes unused CSS in production (52% reduction: 131KB → 63KB)
3. Hugo processes templates, content, and assets
4. Generates static site in `public/`
5. Images are automatically optimized to WebP format

#### CSS Optimization
- **Development**: Full TailwindCSS for fast iteration
- **Production**: PurgeCSS + CSS Nano for optimal file size
- Run `npm run build` for production build with optimizations
- Run `npm run build:preview` for preview build without PurgeCSS
- Configuration: `postcss.config.js` handles CSS processing pipeline

## Content Guidelines

### SEO Optimization

#### IndexNow Automatic Submission
- **IMPORTANT**: IndexNow submission is handled automatically by GitHub Actions
- The workflow runs after each deployment to submit new/updated URLs to search engines
- No manual action required - just commit and push changes
- Supported search engines: Bing, Yandex, Seznam, and others in the IndexNow alliance
- Pages marked as "Pages to submit to IndexNow" in Ahrefs are handled automatically

### SEO Best Practices
- All pages have proper meta descriptions
- OpenGraph images configured
- Structured data via `layouts/partials/seo_schema.html`
- Canonical URLs for proper indexing

### Multilingual SEO
- Language-specific sitemaps
- Proper hreflang implementation
- Language-specific meta descriptions and titles

### Ahrefs SEO Monitoring
- **Quick Access**: Use `.claude/notes/ahrefs-monitoring.md` for monitoring workflow
- **Dashboard URL**: https://app.ahrefs.com/site-audit/8667120/issues
- **Workflow**: Use browserMCP to navigate to dashboard and check current issues
- **Priority**: Focus on Localization (hreflang) and Content issues first
- **Reference**: See monitoring guide for detailed browserMCP workflow

## Troubleshooting

### Common Issues
- **TailwindCSS not updating**: Run `npm run watch:tw` separately
- **Images not loading**: Check path relative to `assets/` directory
- **Language switching broken**: Verify `.en.md` and `.fr.md` files exist
- **Build failures**: Check Hugo version constraints in `config.toml`
- **Inkan SVG animation missing**: Check fallback text in `<object>` tags hasn't been removed (see Critical SVG Animation Protection above)

### Development Tips
- Use `hugo server -O` for open browser on start
- TailwindCSS v4.x requires substantial changes - stay on current version
- All image assets should be WebP format for optimal performance
- French is the default language, English requires explicit `.en.md` files

### Coding Standards

#### CSS and Color Usage
- **NEVER hardcode colors in HTML or templates** - Always use CSS custom properties (CSS variables)
- Use TailwindCSS color classes: `bg-primary-500`, `text-secondary-600`, etc.
- For dynamic values, reference CSS variables: `var(--color-primary)`, `var(--color-secondary)`
- Example: ❌ `content="#192F60"` ✅ `content="var(--color-secondary)"`
- This ensures consistent theming, easy maintenance, and proper dark mode support

#### Critical SVG Animation Protection
- **NEVER remove or modify** the Inkan animated SVG in homepage templates
- **Location**: Both `layouts/index.fr.html` and `layouts/index.en.html` around line 153-156
- **Critical Code Block** (MUST use img tag with absURL):
  ```html
  {{/* CRITICAL: SVG Animation - Must be visible */}}
  <img src="{{ absURL "/images/inkan-animated-prez.svg" }}" 
       alt="Inkan illustration animée"    <!-- French version -->
       alt="Inkan illustrated animation"  <!-- English version -->
       class="w-full h-auto" 
       loading="lazy" />
  ```
- **IMPORTANT RULES**:
  - ✅ CORRECT: Use `<img>` tag with `{{ absURL "/images/inkan-animated-prez.svg" }}`
  - ❌ WRONG: `<object>` tag - browsers block external SVG objects for security
  - ❌ WRONG: `{{ relURL "/images/inkan-animated-prez.svg" }}` - Relative paths may not work
  - ❌ WRONG: `/static/images/inkan-animated-prez.svg` - Direct path won't work
  - ❌ WRONG: `{{ with resources.Get ... }}` - SVG is in /static/, not /assets/
- **Why img+absURL works**: Browsers load SVG images reliably, animations still work
- **Why this matters**: This fallback text is essential for accessibility and when SVG fails to load
- **SVG File**: Located at `/static/images/inkan-animated-prez.svg` - verify exists before editing
- **Common mistakes**: 
  - AI assistants often remove fallback text thinking it's redundant
  - Using wrong path syntax (must use relURL for static files)
  - Trying to use resources.Get (only works for /assets/ directory)
- **Protection rule**: When editing homepage templates, ALWAYS preserve the `<object>` tag and its fallback text exactly as-is

#### Security Standards
- **Content Security Policy (CSP)** implemented in `static/_headers`
- **Security headers** configured for all file types and routes
- **Permissions Policy** restricts access to sensitive APIs
- **Security.txt** available at `/.well-known/security.txt` for responsible disclosure
- All external scripts and resources must be whitelisted in CSP
- Sensitive paths (`/admin/*`, `/.env*`, `/config/*`) have maximum security restrictions

## Website Analysis & Performance Monitoring

### Analysis Tools Setup
Run the setup script to install all required analysis tools:
```bash
chmod +x setup-analysis-tools.sh && ./setup-analysis-tools.sh
```

### Available Analysis Commands
```bash
# Full comprehensive website analysis
npm run analyze

# Quick analysis (limited pages, faster)
npm run analyze:quick

# Lighthouse performance audit (production)
npm run lighthouse

# Lighthouse on local development server
npm run lighthouse:local

# Accessibility audit only
npm run accessibility

# Setup analysis tools
npm run setup:analysis
```

### Analysis Components

#### Performance Analysis (Lighthouse)
- **Desktop & Mobile**: Complete Lighthouse audits
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Production vs Local**: Compare built site performance
- **Bilingual Testing**: French vs English page performance

#### Accessibility Testing
- **Axe-core**: WCAG compliance testing
- **Pa11y**: Additional accessibility validation
- **Bilingual Support**: Tests both French and English versions

#### Visual Testing
- **Screenshots**: Multiple viewport sizes (mobile, tablet, desktop)
- **Full-page captures**: Complete page rendering verification
- **Responsive design**: Cross-device visual consistency

#### SEO & Technical Analysis
- **Sitemap validation**: XML sitemap accessibility
- **Robots.txt**: Search engine directive verification
- **Security headers**: HTTP security header analysis
- **SSL certificate**: TLS configuration validation
- **Image optimization**: Format and size analysis

### Analysis Configuration

#### Lighthouse Config (`lighthouse-config.js`)
- Optimized for Hugo static sites
- Skips PWA audits (not applicable for static sites)
- Configured for bilingual content testing
- Desktop/mobile specific settings

#### Analysis Script (`analyze-website.sh`)
- Hugo-aware (uses port 1313, builds with `hugo --minify`)
- Bilingual page discovery
- Report generation with timestamps
- Cleanup and error handling

### Report Structure
```
analysis-reports/
├── TIMESTAMP/
│   ├── lighthouse/           # Performance reports
│   │   ├── desktop-*.html   # Desktop Lighthouse reports
│   │   ├── mobile-*.html    # Mobile Lighthouse reports
│   │   └── *.json          # Raw performance data
│   ├── accessibility/       # Accessibility reports
│   │   ├── axe-*.json      # Axe accessibility results
│   │   └── pa11y-*.json    # Pa11y accessibility results
│   ├── screenshots/         # Visual testing
│   │   └── [page-name]/
│   │       ├── mobile-*.png
│   │       ├── tablet.png
│   │       └── desktop*.png
│   ├── sources/            # Page source analysis
│   └── analysis-summary.md # Comprehensive report
```

### Hugo-Specific Analysis Points

#### Bilingual Performance Monitoring
- Compare French (/) vs English (/en/) performance
- Cross-language SEO optimization verification
- Consistent user experience across languages

#### TailwindCSS Optimization
- CSS bundle size analysis
- Unused CSS detection for production optimization
- Dark mode implementation performance impact

#### Image Processing Verification
- Hugo's WebP conversion effectiveness
- Responsive image sizing optimization
- Asset loading performance

#### Japanese Design System Impact
- Custom color palette rendering performance
- Typography and font loading optimization
- Background pattern loading analysis

### Regular Monitoring Workflow
1. **Before releases**: Full analysis to catch regressions
2. **Weekly monitoring**: Quick analysis for trend tracking
3. **Post-deployment**: Production verification
4. **Content updates**: Performance impact of new posts/images

### Analysis Reports Management

#### Git Ignore Configuration
All analysis reports are automatically ignored by Git via `.gitignore`:
- `performance-reports/` - Generated performance analysis
- `analysis-reports/` - Comprehensive analysis results
- `accessibility-reports/` - Accessibility audit results
- `analysis-*` files - Individual test results
- `lighthouse-*` files - Lighthouse reports
- `COMPREHENSIVE-WEBSITE-ANALYSIS.md` - Generated analysis summary

#### Report Storage
- **Local Development**: Reports stored locally for review
- **Production**: Reports should not be committed to repository
- **Sharing**: Use specific report artifacts when sharing with team
- **Archival**: Consider external storage for historical trend analysis

#### Cleanup Commands
```bash
# Remove all generated analysis files
rm -rf performance-reports/ analysis-reports/ accessibility-reports/
rm -f analysis-* lighthouse-* accessibility-*.json COMPREHENSIVE-WEBSITE-ANALYSIS.md

# Clean up before Git operations
git status  # Should show clean working directory after cleanup
```

## Internationalization (i18n)

### Enhanced Language Features
- **Modern Language Switcher**: Accessible dropdown with flag icons and visual feedback
- **Comprehensive Translations**: Complete UI element coverage in French and English
- **Language-Specific Formatting**: Dates formatted correctly for each locale
- **Language Detection**: Automatic browser language detection with user preference storage
- **Accessibility**: Skip links, proper ARIA labels, and keyboard navigation

### Language Management
- French translations: `i18n/fr.toml`
- English translations: `i18n/en.toml`
- Language switcher partial: `layouts/partials/language-switcher.html`
- Date formatting partial: `layouts/partials/date-format.html`

### CSS Color Variables
- **Flag Colors**: Never hardcode flag colors in HTML, always use CSS variables
- Flag color variables defined in `assets/css/main.css` under `:root`
- Example: `--color-flag-blue`, `--color-flag-red`, `--color-flag-white`