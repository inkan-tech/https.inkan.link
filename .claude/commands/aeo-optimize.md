# AEO Optimize Command

Complete Answer Engine Optimization workflow for your website. This command orchestrates audit, implementation, and tracking in one comprehensive process.

## What this command does

Executes the complete 7-step AEO playbook:

1. **Comprehensive Audit**
   - Technical foundation check (robots.txt, llms.txt)
   - Schema markup analysis
   - Content structure evaluation
   - E-E-A-T signals assessment
   - Competitor comparison (if configured)

2. **Priority Recommendations**
   - Immediate quick wins (Week 1)
   - Medium-term improvements (Weeks 2-4)
   - Long-term strategy (Months 2-6)

3. **Interactive Implementation**
   - Technical fixes (robots.txt, llms.txt, analytics)
   - Schema markup generation (FAQPage, Organization, BreadcrumbList)
   - Content optimization recommendations
   - Off-site strategy guidance (Reddit, YouTube)

4. **Validation & Testing**
   - Schema validation via Google Rich Results Test
   - robots.txt syntax check
   - Analytics tracking verification

5. **Performance Baseline**
   - Test priority questions across AI platforms
   - Document current citation status
   - Set up tracking for future comparison

## Key Features

### Based on Industry Research
- Follows 7-step playbook from Graphite CEO Ethan Smith
- Implements findings from academic research (GEO paper)
- Optimized for 6X conversion advantage of AI traffic
- Focused on 5% principle (high-value over volume)

### Platform-Specific Optimization
- **ChatGPT**: Wikipedia-style comprehensiveness
- **Perplexity**: Reddit and community emphasis
- **Google AI Overviews**: Deep content pages with high search volume
- **Claude**: Structured citations with Brave Search optimization

### Safety-First Approach
- Creates backups before any changes
- Validates all schema markup
- Tests robots.txt for unintended blocks
- Never removes existing functionality
- Preserves user content integrity

## Usage

```bash
/aeo-optimize
```

## Options

### Workflow Control
- `--audit-only` - Run audit without implementing changes
- `--implement-only` - Apply changes (requires existing audit)
- `--quick` - Fast audit and priority-only implementation
- `--full` - Deep analysis and comprehensive optimization

### Implementation Options
- `--dry-run` - Show all changes without applying them
- `--interactive` - Prompt for confirmation before each change
- `--technical-only` - Only technical changes (robots.txt, llms.txt, analytics)
- `--content-only` - Only content and schema optimizations
- `--auto-approve` - Apply all recommended changes automatically

### Tracking Options
- `--baseline` - Establish performance baseline only
- `--track-after` - Run tracking after implementation
- `--competitors <urls>` - Include competitor analysis

## Workflow Stages

### Stage 1: Discovery (5 minutes)
```
Analyzing project...
├─ Checking robots.txt... ✓
├─ Checking llms.txt... ⚠ Missing
├─ Scanning schema markup... ✓ Found: Organization, WebSite
├─ Analyzing content structure...
│  └─ 45 pages found, 12 with FAQ sections
└─ Checking accessibility barriers... ✓ None found

AEO Score: 52/100
```

### Stage 2: Recommendations (2 minutes)
```
Priority Actions:

HIGH PRIORITY (Week 1) 🔴
1. Create llms.txt file (2,000 words max)
2. Add AI crawlers to robots.txt
3. Implement FAQPage schema on 5 key pages
4. Set up AI referral tracking

MEDIUM PRIORITY (Weeks 2-4) 🟡
5. Add FAQ sections to 10 more pages
6. Create Reddit engagement strategy
7. Plan YouTube content for B2B terms

LONG-TERM (Months 2-6) 🟢
8. Expand content depth on top pages
9. Execute Reddit community participation
10. Produce YouTube video series
```

### Stage 3: Implementation (Interactive)
```
Ready to implement HIGH PRIORITY items? (y/n): y

[1/3] Creating llms.txt...
Generated draft (1,847 words):
---
# Inkan.link

## About
[content preview...]
---
Accept this draft? (y/e/n) [y=yes, e=edit, n=skip]:
```

### Stage 4: Validation (Automatic)
```
Validating changes...
├─ robots.txt syntax... ✓
├─ llms.txt word count... ✓ 1,847/2,000
├─ FAQPage schema... ✓ Valid JSON-LD
├─ Organization schema... ✓ Valid JSON-LD
└─ Analytics tracking... ✓ Configured

All validations passed!
```

### Stage 5: Baseline Tracking (Optional)
```
Testing priority questions...
├─ ChatGPT (10 questions)... 3/10 cited ⚠
├─ Perplexity (10 questions)... 5/10 cited ✓
├─ Claude (10 questions)... 2/10 cited ⚠
└─ Google AI Overviews (10 questions)... 1/10 cited 🔴

Current Share of Voice: 27.5%
Baseline saved for future comparison.
```

## Examples

### Quick Optimization (Recommended First Run)
```bash
/aeo-optimize --quick --interactive
```
- Fast audit (top 10 pages)
- Priority actions only
- Prompts before each change
- ~15 minutes total

### Full Optimization (Comprehensive)
```bash
/aeo-optimize --full
```
- Deep audit (all pages)
- All recommendations
- Auto-applies safe changes, prompts for content
- ~45 minutes total

### Audit Before Implementing
```bash
/aeo-optimize --audit-only --full
/aeo-optimize --implement-only --dry-run
/aeo-optimize --implement-only --interactive
```

### Technical Changes Only
```bash
/aeo-optimize --technical-only --auto-approve
```
- robots.txt update
- llms.txt generation
- Analytics tracking
- No content changes

### With Competitor Analysis
```bash
/aeo-optimize --competitors "competitor1.com,competitor2.com,competitor3.com"
```

## Output Files

All results saved to `.aeo-reports/` directory:

```
.aeo-reports/
├── audit_20250106_143022.md          # Comprehensive audit report
├── implementation_20250106_144530.md  # Changes summary
├── baseline_20250106_145012.json      # Citation baseline data
└── recommendations_20250106_143022.md # Prioritized action list
```

## Integration with Other Commands

This command combines:
- `/aeo-audit` - Discovery and analysis
- `/aeo-implement` - Changes and optimization
- `/aeo-track` - Performance monitoring

You can also run these separately for focused work.

## Expected Results

### Immediate (4-6 weeks)
- Initial citations on long-tail queries
- Improved technical foundation
- Better content structure

### Medium-term (3 months)
- Noticeable visibility improvements
- Higher citation frequency
- Increased AI referral traffic

### Long-term (6+ months)
- 40-60% increase in citations (research-backed)
- 6X better conversion vs. Google traffic
- Established authority in AI platforms

## Best Practices

### Before Running
1. Commit all current changes to git
2. Ensure you have priority questions defined
3. Review current content strategy
4. Have analytics access ready

### During Execution
1. Review generated content carefully
2. Validate schema markup matches your content
3. Test robots.txt changes don't block desired crawlers
4. Verify analytics tracking works

### After Completion
1. Monitor AI referral traffic weekly
2. Test priority questions monthly
3. Update llms.txt quarterly
4. Expand FAQ coverage continuously

## Troubleshooting

### "No priority questions found"
→ Add questions to `.aeo-projects.json` under `priority_questions`

### "Schema validation failed"
→ Check JSON-LD syntax, ensure all required fields present

### "llms.txt too long"
→ Reduce to under 2,000 words (focus on essentials)

### "Low initial citations"
→ Normal! Takes 4-6 weeks to see impact. Focus on Reddit/YouTube tactics.

## Key Principles

Based on the white paper research:

1. **Quality > Quantity** - One great page beats ten mediocre ones
2. **Volume > Position** - 5 citations beats 1 top position
3. **Authenticity Matters** - Real expertise and transparency win
4. **The 5% Principle** - Focus on high-value, not volume
5. **Patience Required** - 3-6 months for meaningful results
6. **Reddit is King** - 5 authentic comments can transform visibility
7. **YouTube Gold Mine** - Niche B2B videos with zero competition
8. **FAQ Schema Priority** - Highest citation driver

## Related Commands

- `/aeo-audit` - Run audit only
- `/aeo-implement` - Apply changes only
- `/aeo-track` - Monitor performance only

## Support

For detailed documentation, see [tools/AEO-README.md](../tools/AEO-README.md)

For issues or questions:
- Review audit report recommendations
- Check validation errors carefully
- Consult white paper for strategy questions
- Contact: hello@inkan.link

---

**Pro Tip:** Start with `--quick --interactive` on your first run to understand the workflow, then use `--full` for comprehensive optimization.
