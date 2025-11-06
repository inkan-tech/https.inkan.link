#!/bin/bash

# AEO CLI - Answer Engine Optimization Command Line Interface
# Multi-project AEO auditing, implementation, and tracking tool
# Based on the AEO Strategic Guide for Marketing Leaders

set -euo pipefail

VERSION="1.0.0"
CONFIG_FILE=".aeo-projects.json"
REPORTS_DIR=".aeo-reports"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() { echo -e "${BLUE}ℹ ${1}${NC}"; }
print_success() { echo -e "${GREEN}✓ ${1}${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ ${1}${NC}"; }
print_error() { echo -e "${RED}✗ ${1}${NC}"; }

# Show usage
usage() {
    cat << EOF
AEO CLI v${VERSION} - Answer Engine Optimization Tool

USAGE:
    aeo-cli <command> [options] [project]

COMMANDS:
    init                Initialize AEO configuration for current project
    audit               Run AEO audit on project(s)
    implement           Apply AEO optimizations
    track               Monitor AEO performance and citations
    report              Generate AEO performance reports
    list                List all configured projects
    batch               Run command across all projects

OPTIONS:
    --quick             Quick scan (limited pages)
    --full              Full deep analysis
    --dry-run           Show changes without applying
    --priority-only     Only high-priority items
    --technical-only    Only technical changes
    --content-only      Only content optimizations
    --interactive       Ask before each change
    --competitors       Include competitor analysis
    --export [format]   Export results (csv, json)

EXAMPLES:
    # Initialize new project
    aeo-cli init

    # Run quick audit on current project
    aeo-cli audit --quick

    # Full audit on specific project
    aeo-cli audit --full my-website

    # Implement with dry-run first
    aeo-cli implement --dry-run
    aeo-cli implement --interactive

    # Track performance
    aeo-cli track --export csv

    # Batch audit all projects
    aeo-cli batch audit --quick

    # Generate monthly report
    aeo-cli report monthly

For more information, see: https://docs.inkan.link/aeo-cli

EOF
}

# Initialize project configuration
cmd_init() {
    print_info "Initializing AEO configuration..."

    if [ -f "$CONFIG_FILE" ]; then
        print_warning "Config file already exists: $CONFIG_FILE"
        read -p "Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi

    # Gather project information
    read -p "Project name: " project_name
    read -p "Site URL: " site_url
    read -p "Priority questions (comma-separated): " questions

    # Convert comma-separated to JSON array
    IFS=',' read -ra QUESTIONS <<< "$questions"
    json_questions=$(printf ',"%s"' "${QUESTIONS[@]}")
    json_questions="[${json_questions:1}]"

    # Create config file
    cat > "$CONFIG_FILE" << EOF
{
  "version": "1.0",
  "projects": [
    {
      "name": "${project_name}",
      "path": "$(pwd)",
      "site_url": "${site_url}",
      "priority_questions": ${json_questions},
      "competitors": [],
      "analytics": {
        "provider": "matomo",
        "site_id": "2"
      },
      "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    }
  ]
}
EOF

    print_success "Configuration created: $CONFIG_FILE"
    print_info "Edit $CONFIG_FILE to add competitors or configure analytics"
}

# Run audit
cmd_audit() {
    local mode="${1:-standard}"
    local project_path="${2:-$(pwd)}"

    print_info "Running AEO audit (mode: $mode)..."

    # Create reports directory
    mkdir -p "$REPORTS_DIR"

    local report_file="$REPORTS_DIR/audit_$(date +%Y%m%d_%H%M%S).md"

    # Check robots.txt
    print_info "Checking robots.txt..."
    check_robots_txt "$project_path"

    # Check llms.txt
    print_info "Checking llms.txt..."
    check_llms_txt "$project_path"

    # Scan for schema markup
    print_info "Scanning schema markup..."
    scan_schema "$project_path"

    # Analyze content structure
    if [ "$mode" != "quick" ]; then
        print_info "Analyzing content structure..."
        analyze_content "$project_path"
    fi

    # Generate report
    print_info "Generating audit report..."
    generate_audit_report "$report_file"

    print_success "Audit complete! Report saved to: $report_file"
}

# Check robots.txt for AI crawler access
check_robots_txt() {
    local project_path="$1"
    local robots_file="$project_path/static/robots.txt"

    if [ ! -f "$robots_file" ]; then
        print_warning "robots.txt not found"
        echo "❌ robots.txt missing" >> "$REPORTS_DIR/audit_temp.txt"
        return 1
    fi

    local crawlers=("GPTBot" "Claude-Web" "PerplexityBot" "GoogleOther" "CCBot")
    local missing_crawlers=()

    for crawler in "${crawlers[@]}"; do
        if ! grep -q "$crawler" "$robots_file"; then
            missing_crawlers+=("$crawler")
        fi
    done

    if [ ${#missing_crawlers[@]} -gt 0 ]; then
        print_warning "Missing AI crawlers: ${missing_crawlers[*]}"
        echo "⚠️  Missing crawlers: ${missing_crawlers[*]}" >> "$REPORTS_DIR/audit_temp.txt"
    else
        print_success "All AI crawlers allowed"
        echo "✅ AI crawlers configured" >> "$REPORTS_DIR/audit_temp.txt"
    fi
}

# Check for llms.txt
check_llms_txt() {
    local project_path="$1"
    local llms_file="$project_path/static/llms.txt"

    if [ -f "$llms_file" ]; then
        local word_count=$(wc -w < "$llms_file")
        print_success "llms.txt found ($word_count words)"
        echo "✅ llms.txt exists ($word_count words)" >> "$REPORTS_DIR/audit_temp.txt"

        if [ "$word_count" -gt 2000 ]; then
            print_warning "llms.txt exceeds recommended 2000 words"
            echo "⚠️  llms.txt too long ($word_count words)" >> "$REPORTS_DIR/audit_temp.txt"
        fi
    else
        print_warning "llms.txt not found"
        echo "❌ llms.txt missing" >> "$REPORTS_DIR/audit_temp.txt"
    fi
}

# Scan for schema markup
scan_schema() {
    local project_path="$1"
    print_info "Scanning for schema markup in layouts..."

    local schema_types=("FAQPage" "Organization" "BreadcrumbList" "WebSite" "Article")
    local found_schemas=()

    for schema in "${schema_types[@]}"; do
        if grep -r "\"@type\".*\"$schema\"" "$project_path/layouts" >/dev/null 2>&1; then
            found_schemas+=("$schema")
        fi
    done

    if [ ${#found_schemas[@]} -gt 0 ]; then
        print_success "Found schemas: ${found_schemas[*]}"
        echo "✅ Schema types: ${found_schemas[*]}" >> "$REPORTS_DIR/audit_temp.txt"
    else
        print_warning "No schema markup found"
        echo "❌ No schema markup detected" >> "$REPORTS_DIR/audit_temp.txt"
    fi

    # Check for FAQPage specifically (highest priority)
    if [[ ! " ${found_schemas[@]} " =~ " FAQPage " ]]; then
        print_warning "FAQPage schema missing (highest priority for AEO)"
        echo "🔴 PRIORITY: Add FAQPage schema" >> "$REPORTS_DIR/audit_temp.txt"
    fi
}

# Analyze content structure
analyze_content() {
    local project_path="$1"
    print_info "Analyzing content files..."

    local content_dir="$project_path/content"
    if [ ! -d "$content_dir" ]; then
        print_warning "Content directory not found"
        return 1
    fi

    local total_pages=$(find "$content_dir" -name "*.md" | wc -l)
    local pages_with_faqs=$(grep -r "^## FAQ\|^## Questions fréquentes" "$content_dir" 2>/dev/null | wc -l)

    print_info "Total pages: $total_pages"
    print_info "Pages with FAQ sections: $pages_with_faqs"

    echo "📊 Content analysis:" >> "$REPORTS_DIR/audit_temp.txt"
    echo "   - Total pages: $total_pages" >> "$REPORTS_DIR/audit_temp.txt"
    echo "   - FAQ sections: $pages_with_faqs" >> "$REPORTS_DIR/audit_temp.txt"

    if [ "$pages_with_faqs" -lt 5 ]; then
        print_warning "Only $pages_with_faqs pages have FAQ sections (recommend at least 5)"
        echo "⚠️  Add more FAQ sections" >> "$REPORTS_DIR/audit_temp.txt"
    fi
}

# Generate final audit report
generate_audit_report() {
    local report_file="$1"

    cat > "$report_file" << 'EOF'
# AEO Audit Report

Generated: $(date)
Project: $(pwd)

## Executive Summary

EOF

    # Append collected findings
    if [ -f "$REPORTS_DIR/audit_temp.txt" ]; then
        cat "$REPORTS_DIR/audit_temp.txt" >> "$report_file"
        rm "$REPORTS_DIR/audit_temp.txt"
    fi

    cat >> "$report_file" << 'EOF'

## Priority Actions

### High Priority (Week 1)
1. ⚠️ Update robots.txt to allow all AI crawlers
2. ⚠️ Create llms.txt file with site summary
3. ⚠️ Add FAQPage schema to top 5 pages

### Medium Priority (Weeks 2-4)
4. Add Organization schema to homepage
5. Create FAQ sections on 10+ key pages
6. Set up AI referral tracking in analytics

### Long-term (Months 2-3)
7. Optimize content structure for direct answers
8. Implement Reddit engagement strategy
9. Create YouTube videos for long-tail B2B terms

## Estimated Timeline
- Initial improvements: 4-6 weeks
- Meaningful citations: 3 months
- Full business impact: 6 months

## Next Steps
Run: `aeo-cli implement --dry-run` to preview changes

EOF
}

# Implement AEO optimizations
cmd_implement() {
    local dry_run=false
    local interactive=false
    local technical_only=false

    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run) dry_run=true; shift ;;
            --interactive) interactive=true; shift ;;
            --technical-only) technical_only=true; shift ;;
            *) shift ;;
        esac
    done

    print_info "Implementing AEO optimizations..."

    if [ "$dry_run" = true ]; then
        print_warning "DRY RUN MODE - No changes will be made"
    fi

    # Update robots.txt
    if [ "$interactive" = true ]; then
        read -p "Update robots.txt to allow AI crawlers? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            update_robots_txt "$dry_run"
        fi
    else
        update_robots_txt "$dry_run"
    fi

    # Generate llms.txt
    if [ "$interactive" = true ]; then
        read -p "Generate llms.txt file? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            generate_llms_txt "$dry_run"
        fi
    else
        generate_llms_txt "$dry_run"
    fi

    if [ "$technical_only" = false ]; then
        # Add schema markup
        print_info "Schema markup generation requires manual review"
        print_info "Use /aeo-implement command in Claude for full implementation"
    fi

    print_success "Implementation complete!"
}

# Update robots.txt
update_robots_txt() {
    local dry_run="$1"
    local robots_file="static/robots.txt"

    print_info "Updating robots.txt..."

    local ai_crawlers_block='
# AI Crawler Access - Added by AEO CLI
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
'

    if [ "$dry_run" = true ]; then
        print_info "Would append to robots.txt:"
        echo "$ai_crawlers_block"
    else
        if [ ! -f "$robots_file" ]; then
            print_error "robots.txt not found at $robots_file"
            return 1
        fi

        # Check if already present
        if grep -q "GPTBot" "$robots_file"; then
            print_warning "AI crawlers already configured in robots.txt"
            return 0
        fi

        echo "$ai_crawlers_block" >> "$robots_file"
        print_success "robots.txt updated"
    fi
}

# Generate llms.txt
generate_llms_txt() {
    local dry_run="$1"
    local llms_file="static/llms.txt"

    print_info "Generating llms.txt..."

    # Extract info from config
    local site_name="Inkan.link"
    local site_url="https://inkan.link"

    local llms_content="# ${site_name}

## About
Professional cybersecurity and digital authentication solutions. We protect businesses from identity fraud and deepfake threats.

## Products & Services
- Sealfie: Deepfake protection and digital authentication
- Enterprise security solutions
- Biometric verification systems

## Key Differentiators
- Advanced deepfake detection technology
- Real-time identity verification
- Enterprise-grade security
- Privacy-first approach

## Frequently Asked Questions

### What is Sealfie?
Sealfie is a digital authentication solution that protects against identity fraud and deepfake attacks using advanced biometric verification.

### How does deepfake protection work?
Our system uses multi-factor biometric authentication combined with real-time verification to detect and prevent deepfake attempts.

### Is Sealfie available for enterprise?
Yes, we offer enterprise solutions with dedicated support and custom integrations.

## Contact
Website: ${site_url}
Contact: ${site_url}/contact

## Last Updated
$(date -u +"%Y-%m-%d")
"

    if [ "$dry_run" = true ]; then
        print_info "Would create llms.txt:"
        echo "$llms_content"
    else
        echo "$llms_content" > "$llms_file"
        local word_count=$(echo "$llms_content" | wc -w)
        print_success "llms.txt created ($word_count words)"
    fi
}

# Track AEO performance
cmd_track() {
    print_info "AEO tracking requires API integration with monitoring tools"
    print_info "Recommended tools:"
    echo "  - Profound (tryprofound.com) - Enterprise tracking"
    echo "  - Qwairy (qwairy.co) - European/GDPR-focused"
    echo "  - Otterly.ai - Budget-friendly option"
    echo ""
    print_info "Manual tracking option:"
    echo "  1. Test priority questions in ChatGPT, Perplexity, Claude"
    echo "  2. Document citation presence and position"
    echo "  3. Track referral traffic in Google Analytics/Matomo"
    echo "  4. Compare weekly/monthly trends"
}

# Batch operations
cmd_batch() {
    local command="$1"
    shift

    if [ ! -f "$CONFIG_FILE" ]; then
        print_error "No config file found. Run 'aeo-cli init' first"
        exit 1
    fi

    print_info "Running batch operation: $command"

    # This is a simplified version - full implementation would parse JSON
    print_warning "Batch operations require jq for JSON parsing"
    print_info "Install: brew install jq"

    # Example of how it would work
    # jq -r '.projects[].path' "$CONFIG_FILE" | while read -r project_path; do
    #     cd "$project_path"
    #     "cmd_$command" "$@"
    # done
}

# List configured projects
cmd_list() {
    if [ ! -f "$CONFIG_FILE" ]; then
        print_error "No config file found. Run 'aeo-cli init' first"
        exit 1
    fi

    print_info "Configured projects:"

    if command -v jq &> /dev/null; then
        jq -r '.projects[] | "  - \(.name) (\(.site_url))"' "$CONFIG_FILE"
    else
        print_warning "Install jq for better formatting: brew install jq"
        cat "$CONFIG_FILE"
    fi
}

# Main command router
main() {
    if [ $# -eq 0 ]; then
        usage
        exit 0
    fi

    local command="$1"
    shift

    case "$command" in
        init) cmd_init "$@" ;;
        audit) cmd_audit "$@" ;;
        implement) cmd_implement "$@" ;;
        track) cmd_track "$@" ;;
        list) cmd_list "$@" ;;
        batch) cmd_batch "$@" ;;
        -h|--help|help) usage ;;
        -v|--version) echo "AEO CLI v${VERSION}" ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            usage
            exit 1
            ;;
    esac
}

main "$@"
