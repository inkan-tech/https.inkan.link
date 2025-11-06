# AEO Tracking Command

Monitor Answer Engine Optimization performance and citations.

## What this command does

This command tracks your AEO performance over time:

1. **Citation Monitoring**
   - Test priority questions across AI platforms (ChatGPT, Perplexity, Claude, Gemini)
   - Track citation frequency and position
   - Monitor share of voice vs. competitors

2. **Traffic Analysis**
   - Analyze referral traffic from AI platforms
   - Track conversion rates by AI source
   - Compare AI traffic vs. traditional search

3. **Content Performance**
   - Identify which pages get cited most
   - Track citation patterns by content type
   - Measure FAQ schema effectiveness

4. **Competitive Intelligence**
   - Compare citation rates vs. competitors
   - Identify gaps and opportunities
   - Track competitor AEO tactics

## Setup

First run requires configuration:
- Define priority questions (50-200 recommended)
- Set competitor URLs for comparison
- Configure tracking frequency

## Usage

```bash
/aeo-track
```

## Options

- `--questions` - Test specific questions manually
- `--report` - Generate weekly/monthly performance report
- `--compare` - Compare current vs. previous period
- `--export` - Export data to CSV/JSON

## Output

Generates tracking dashboard with:
- Overall visibility score
- Citation volume trends
- Traffic and conversion metrics
- Competitive benchmarks
- Actionable recommendations

## Example

```bash
/aeo-track --report monthly
/aeo-track --questions "What is Sealfie?" "How does deepfake protection work?"
```

## Integration

Can integrate with:
- Google Analytics 4 (for traffic data)
- Matomo (for privacy-focused tracking)
- AEO tracking tools (Profound, Otterly, Qwairy)
