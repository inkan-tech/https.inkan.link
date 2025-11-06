# AEO Audit Command

Perform a comprehensive Answer Engine Optimization (AEO) audit on the current website project.

## What this command does

This command analyzes your website for AEO readiness across multiple dimensions:

1. **Technical Foundation**
   - Verify robots.txt allows AI crawlers (GPTBot, Claude-Web, PerplexityBot, GoogleOther)
   - Check for existing llms.txt file
   - Validate Core Web Vitals and page speed
   - Verify HTTPS and mobile responsiveness

2. **Content Structure Analysis**
   - Identify pages with FAQ potential
   - Check for schema markup (FAQPage, Organization, BreadcrumbList)
   - Analyze content clarity and structure (headings, bullet points, tables)
   - Detect paywalls or access barriers

3. **Authority Signals**
   - Check for author credentials and bios
   - Verify E-E-A-T signals
   - Analyze source citations and references

4. **Citation Optimization**
   - Review content for answer-first structure
   - Check sentence length and readability
   - Identify opportunities for statistics, quotations, and data

## Output

Generates a comprehensive report with:
- Current AEO score (0-100)
- Priority action items
- Quick wins vs. long-term improvements
- Estimated timeline for implementation

## Usage

```bash
/aeo-audit
```

## Options

- `--quick` - Run a fast audit (top 10 pages only)
- `--full` - Deep audit of entire site
- `--competitors` - Include competitor analysis (requires URLs)

## Example

```bash
/aeo-audit --full
```
