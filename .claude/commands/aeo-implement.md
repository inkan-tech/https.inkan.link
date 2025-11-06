# AEO Implementation Command

Implement Answer Engine Optimization improvements based on audit findings.

## What this command does

This command applies AEO optimizations to your website:

1. **Technical Setup**
   - Update robots.txt to allow AI crawlers
   - Generate and deploy llms.txt file
   - Add AI referral tracking to analytics

2. **Schema Markup**
   - Generate FAQPage schema for identified pages
   - Add Organization schema
   - Implement BreadcrumbList schema

3. **Content Optimization**
   - Restructure content for answer-first format
   - Add FAQ sections to high-priority pages
   - Optimize headings and content hierarchy
   - Improve readability and sentence structure

4. **Off-Site Strategy**
   - Generate Reddit engagement guidelines
   - Create YouTube content plan for B2B terms
   - Identify affiliate/publisher opportunities

## Prerequisites

Run `/aeo-audit` first to generate recommendations.

## Usage

```bash
/aeo-implement
```

## Options

- `--dry-run` - Show what would be changed without applying
- `--priority-only` - Implement only high-priority items
- `--technical-only` - Apply only technical changes (robots.txt, llms.txt, analytics)
- `--content-only` - Apply only content optimizations
- `--interactive` - Ask for confirmation before each change

## Safety

- Creates backups of modified files
- Validates all schema markup before deployment
- Tests robots.txt changes for unintended blocks
- Never removes existing functionality

## Example

```bash
/aeo-implement --dry-run
/aeo-implement --priority-only --interactive
```
