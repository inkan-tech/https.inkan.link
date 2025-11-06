# AEO Optimization System

Complete Answer Engine Optimization system based on the "AEO Strategic Guide for Marketing Leaders" white paper.

## Overview

This system provides automated AEO auditing, implementation, and tracking across multiple web projects. It follows the 7-step playbook from industry research by Graphite CEO Ethan Smith.

## Components

### 1. Claude Commands (`.claude/commands/`)

User-level slash commands for interactive AEO optimization:

- `/aeo-audit` - Comprehensive AEO audit
- `/aeo-implement` - Apply optimizations
- `/aeo-track` - Monitor performance

### 2. Agent Definition (`.claude/agents/aeo-optimizer.xml`)

Complete XML agent specification with:
- Multi-workflow support (audit, implement, track)
- Multi-project batch operations
- Schema generation templates
- Safety rules and validation
- Integration with analytics and AEO tracking tools

### 3. CLI Tool (`tools/aeo-cli.sh`)

Bash script for command-line AEO operations:

```bash
# Initialize project
./tools/aeo-cli.sh init

# Run audit
./tools/aeo-cli.sh audit --quick
./tools/aeo-cli.sh audit --full

# Implement changes
./tools/aeo-cli.sh implement --dry-run
./tools/aeo-cli.sh implement --interactive

# Track performance
./tools/aeo-cli.sh track

# Batch operations
./tools/aeo-cli.sh batch audit --quick
```

## Installation

### Prerequisites

```bash
# Install jq for JSON parsing
brew install jq

# Make CLI executable
chmod +x tools/aeo-cli.sh
```

### Setup

1. Initialize configuration:
```bash
./tools/aeo-cli.sh init
```

2. Edit `.aeo-projects.json` to add:
   - Priority questions (50-200 recommended)
   - Competitor URLs
   - Analytics configuration

## The 7-Step AEO Playbook

Based on research from Lenny's Podcast interview with Ethan Smith (Sept 2025):

### Step 1: Question Research
- Transform competitor keywords into questions
- Mine sales calls, support tickets, Reddit
- Focus on long-tail conversational queries (25+ words)

### Step 2: Set Up Answer Tracking
- Track "share of voice" across AI platforms
- Monitor ChatGPT, Perplexity, Claude, Gemini
- Run multiple tests per question (variability is high)

### Step 3: Analyze Citation Patterns
- Identify which URLs AI platforms cite
- Vertical-specific patterns:
  - B2B: TechRadar dominates
  - Commerce: Glamour, Cosmopolitan
  - Marketplaces: Eater, Yelp
  - Universal: Reddit, YouTube

### Step 4: Create Optimized Landing Pages
- Target topics, not keywords
- Each page addresses 100s-1000s related questions
- Answer ALL follow-up questions
- Focus on information gain (say something unique)
- **FAQPage schema is highest priority**

### Step 5: Off-Site Citation Optimization

**The Three High-Impact Tactics:**

1. **Reddit Strategy (The Kingmaker)**
   - ONE real account only
   - Full transparency (say who you are, where you work)
   - Give genuinely helpful answers
   - 5 good comments can transform visibility
   - Never automate, fake accounts, or spam
   - ChatGPT trusts Reddit because community policing beats algorithms

2. **YouTube/Vimeo Videos**
   - Gold mine for B2B
   - Cover "boring" B2B terms nobody else does
   - Zero competition
   - You control the content
   - No community policing like Reddit
   - Video citations heavily trusted by LLMs

3. **Affiliate/Tier-1 Publishers**
   - Pay Forbes, Dotdash Meredith for mentions
   - Expensive but controllable
   - Effective for brand credibility

### Step 6: Run Controlled Experiments
- 200 questions total
- 100 control group (critical due to variance)
- 100 test group split by intervention
- Track 2+ weeks before, 2+ weeks after
- Compare test vs. control

### Step 7: Build Dedicated Team
- SEO team: AEO landing pages + traditional optimization
- Marketing/Community: Off-site work (Reddit, YouTube)
- Consider dedicated AEO specialist as channel grows

## Key Research Findings

### Conversion Superiority
- **LLM traffic converts 6X better than Google search** (Webflow case study)
- Users arrive pre-qualified through conversational follow-ups
- They understand their needs before clicking

### The 5% Principle
- 5% of landing pages drive 85% of traffic
- 5% of AEO work drives meaningful impact
- **Focus on high-value questions, not volume**

### AI Content Performance
- Only 10-12% of ranking content is AI-generated
- 90% is human-created
- Pure AI content (no human editing) does not rank
- AI-assisted with human editing performs well

### What Improves Citations (30-40% increase)
✅ Statistics, quotations, source citations
❌ Keyword stuffing (no improvement or negative)
❌ Tone manipulation (AI engines are robust to this)

### Volume > Position
- In Google SEO: Ranking #1 wins (gets the click)
- In AEO: LLMs cite multiple sources
- **Appearing in 5 citations > being #1 in one**

## Technical Implementation

### 1. robots.txt Configuration

**Required AI Crawlers:**
```
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: CCBot
Allow: /
```

### 2. llms.txt File

Create at website root (`/llms.txt`):
- Under 2,000 words
- Executive summary
- Products/services
- Key differentiators
- 7-10 FAQs
- Contact information

**Example:**
```
# Inkan.link

## About
Cybersecurity and digital authentication solutions protecting businesses from identity fraud and deepfake threats.

## Products & Services
- Sealfie: Deepfake protection platform
- Enterprise security solutions
- Biometric verification

[etc...]
```

### 3. Schema Markup Priority

**1. FAQPage Schema (Highest Priority)**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is Sealfie?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sealfie is a digital authentication solution..."
    }
  }]
}
```

**2. Organization Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Inkan.link",
  "url": "https://inkan.link",
  "logo": "https://inkan.link/logo.png"
}
```

**3. Additional Schemas:**
- BreadcrumbList
- WebSite
- Article

### 4. Content Structure

**Answer-First Format:**
- Direct answer in first paragraph
- Short sentences (under 25 words)
- Clear H2/H3 hierarchy
- Bullet lists for scanability
- Tables for comparisons
- No preamble or "clever" prose

**Example:**
```markdown
## What is Answer Engine Optimization?

Answer Engine Optimization (AEO) structures content to become the definitive source
that AI platforms cite when generating responses.

Unlike SEO's focus on rankings, AEO prioritizes becoming the answer itself across:
- ChatGPT
- Perplexity
- Google AI Overviews
- Claude
- Gemini
```

## Platform-Specific Behaviors

### ChatGPT
- Uses Bing's search index + top Google results
- **Wikipedia dominates: 47.9% of top 10 sources**
- Source distribution: 58% business websites, 27% mentions, 15% directories
- Inline citations + "Sources" button

### Perplexity
- Multiple real-time searches per query (Sonar Pro: 2X citations)
- **Reddit is top source: 6.6% of citations**
- SimpleQA benchmark: 85.8% F-Score (highest tested)
- Emphasizes community discussions

### Google AI Overviews
- Powered by Gemini models
- **More distributed approach across sources**
- Reddit: 2.2% of citations
- Also favors: blogs, vendor content, LinkedIn
- 82.5% of citations are deep pages (2+ clicks from homepage)
- Median search volume: 15,300 monthly searches

### Claude
- Uses Brave Search
- Native Citations API
- Documents chunked into sentences
- Structured references with metadata
- Endex study: 0% source hallucinations (down from 10%)

## Expected Timeline

### 4-6 Weeks
Initial citation improvements on long-tail queries

### 3 Months
Noticeable visibility improvements across platforms

### 4-6 Months
40-60% improvement in AI citations (Graphite research)

### 6+ Months
Measurable business impact and established authority

## Budget Allocation

### SME (<$5M revenue)
- **$1,000-3,000/month** agency services
- OR €290-640/month SaaS + internal execution

### Mid-Market ($5-50M revenue)
- **$3,000-10,000/month** comprehensive agency
- Multiple verticals/regions

### Enterprise ($50M+ revenue)
- **$10,000-50,000+/month** scaled programs
- Dedicated teams per business unit

### Budget Split
- 40% Audit and strategy
- 40% Implementation (content, technical, authority)
- 20% Tracking and reporting

## Available AEO Tools

### Enterprise ($200-$5,000+/mo)
- **Profound** (tryprofound.com) - 7+ engines, SOC 2 certified, $58.5M funding
- **Bear AI** (usebear.ai) - Action-oriented, outreach tools

### Mid-Market ($50-$500/mo)
- **Otterly.ai** - Budget-friendly, Germany-based, 50+ countries
- **Qwairy** (qwairy.co) - Paris-based, GDPR-focused, 15+ platforms, free tier

## Comparison with White Paper

### ✅ Fully Implemented
- [x] 7-step playbook integration
- [x] Multi-project support
- [x] Technical foundation automation (robots.txt, llms.txt)
- [x] Schema markup generation
- [x] Audit and reporting capabilities
- [x] Safety rules and validation
- [x] Platform-specific optimization guidance

### ⚠️ Partially Implemented
- [ ] Automated citation tracking (requires API integrations)
- [ ] Competitor analysis (requires external data)
- [ ] Content optimization (recommendations only, not automated)
- [ ] Reddit/YouTube strategy execution (manual process)

### ❌ Not Implemented (Manual Process)
- Reddit engagement (must be authentic, transparent, manual)
- YouTube video creation (manual content development)
- Affiliate/publisher outreach (manual business development)
- Controlled A/B experiments (requires monitoring tools)

## Critical Success Factors

### Do's ✅
1. **Start with technical foundation** (robots.txt, llms.txt, schema)
2. **Prioritize FAQPage schema** (highest citation driver)
3. **Focus on Reddit + YouTube** (highest ROI tactics)
4. **Be authentic on Reddit** (transparency + helpfulness)
5. **Answer ALL follow-up questions** on landing pages
6. **Track share of voice** across multiple platforms
7. **Use controlled experiments** (test vs. control groups)
8. **Be patient but persistent** (3-6 months for results)

### Don'ts ❌
1. ❌ Don't use fake Reddit accounts or automation
2. ❌ Don't focus on keyword stuffing (doesn't work)
3. ❌ Don't neglect human content editing (AI-only fails)
4. ❌ Don't expect overnight results (variance is high)
5. ❌ Don't ignore competitor patterns in your vertical
6. ❌ Don't create volume over quality (5% principle)
7. ❌ Don't block AI crawlers (obvious but critical)
8. ❌ Don't put content behind paywalls/logins

## Getting Started Checklist

### Week 1: Foundation
- [ ] Run `./tools/aeo-cli.sh init`
- [ ] Run `./tools/aeo-cli.sh audit --quick`
- [ ] Review audit report
- [ ] Update robots.txt (allow AI crawlers)
- [ ] Create llms.txt file

### Week 2-3: Implementation
- [ ] Add FAQPage schema to top 5 pages
- [ ] Create FAQ sections on 10+ pages
- [ ] Add Organization schema to homepage
- [ ] Set up AI referral tracking in analytics
- [ ] Run `/aeo-implement --dry-run` in Claude

### Month 2: Off-Site Strategy
- [ ] Identify relevant Reddit communities
- [ ] Create authentic Reddit account
- [ ] Make 5-10 genuinely helpful comments
- [ ] Plan YouTube videos for niche B2B terms
- [ ] Record first 3 videos

### Month 3+: Optimize & Scale
- [ ] Run `/aeo-track` weekly
- [ ] Analyze citation patterns
- [ ] Identify top-performing pages
- [ ] Create more content based on what works
- [ ] Expand Reddit presence
- [ ] Scale YouTube production

## Resources

### White Paper Source
"Answer Engine Optimization: A Strategic Guide for Leaders"
Stobo.app, November 5, 2025

### Key Research Sources
- Ethan Smith (Graphite CEO) on Lenny's Podcast, September 2025
- Academic paper: "Generative Engine Optimization," November 2023
- Graphite research on AI content, October 2025
- Platform documentation: OpenAI, Anthropic, Perplexity, Google

### Tool Websites
- Profound: tryprofound.com
- Bear AI: usebear.ai
- Otterly: otterly.ai
- Qwairy: qwairy.co

## Support

For questions or issues with this AEO system:
- Open an issue in the repository
- Contact: hello@inkan.link
- Documentation: https://docs.inkan.link

---

**Last Updated:** January 6, 2025
**Version:** 1.0.0
**License:** Proprietary - Inkan.link
