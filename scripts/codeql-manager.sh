#!/bin/bash

################################################################################
# CodeQL Manager - GitHub API Script
# Manages CodeQL configuration and monitors security analysis
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default repository (current)
REPO="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")}"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BOLD}${BLUE}=== $1 ===${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

check_dependencies() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed."
        echo "Install it from: https://cli.github.com/"
        exit 1
    fi

    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI is not authenticated."
        echo "Run: gh auth login"
        exit 1
    fi
}

parse_repo_arg() {
    # If repo argument provided, use it; otherwise use current repo
    if [[ -n "${1:-}" ]]; then
        REPO="$1"
    fi

    if [[ -z "$REPO" ]]; then
        print_error "Could not determine repository. Specify with: $0 <command> owner/repo"
        exit 1
    fi
}

################################################################################
# CodeQL Status
################################################################################

show_status() {
    parse_repo_arg "${1:-}"

    print_header "CodeQL Configuration for $REPO"

    local config
    config=$(gh api "/repos/$REPO/code-scanning/default-setup" 2>&1)

    if [[ $? -ne 0 ]]; then
        print_error "Failed to retrieve CodeQL configuration"
        echo "$config"
        exit 1
    fi

    # Parse and display configuration
    local state=$(echo "$config" | jq -r '.state')
    local languages=$(echo "$config" | jq -r '.languages[]' | tr '\n' ', ' | sed 's/,$//')
    local query_suite=$(echo "$config" | jq -r '.query_suite')
    local threat_model=$(echo "$config" | jq -r '.threat_model')
    local schedule=$(echo "$config" | jq -r '.schedule')
    local updated_at=$(echo "$config" | jq -r '.updated_at')
    local runner_type=$(echo "$config" | jq -r '.runner_type')

    echo -e "${BOLD}State:${NC}          $state"
    echo -e "${BOLD}Languages:${NC}      $languages"
    echo -e "${BOLD}Query Suite:${NC}    $query_suite"
    echo -e "${BOLD}Threat Model:${NC}   $threat_model"
    echo -e "${BOLD}Schedule:${NC}       $schedule"
    echo -e "${BOLD}Runner Type:${NC}    $runner_type"
    echo -e "${BOLD}Last Updated:${NC}   $updated_at"

    if [[ "$state" == "configured" ]]; then
        print_success "CodeQL is properly configured"
    else
        print_warning "CodeQL state: $state"
    fi
}

################################################################################
# CodeQL Alerts
################################################################################

show_alerts() {
    parse_repo_arg "${1:-}"
    local filter_state="${2:-all}"  # open, closed, dismissed, all
    local filter_severity="${3:-all}"  # low, medium, high, critical, all

    print_header "CodeQL Security Alerts for $REPO"

    # Build filter parameters
    local params=""
    if [[ "$filter_state" != "all" ]]; then
        params="?state=$filter_state"
    fi

    local alerts
    alerts=$(gh api "/repos/$REPO/code-scanning/alerts$params" 2>&1)

    if [[ $? -ne 0 ]]; then
        print_error "Failed to retrieve alerts"
        echo "$alerts"
        exit 1
    fi

    local total_alerts=$(echo "$alerts" | jq '. | length')

    if [[ "$total_alerts" -eq 0 ]]; then
        print_success "No security alerts found!"
        return
    fi

    echo -e "${BOLD}Total Alerts:${NC} $total_alerts\n"

    # Display alerts table
    echo "$alerts" | jq -r '.[] |
        "\(.number)|\(.state)|\(.rule.severity_level)|\(.rule.id)|\(.created_at)|\(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)"' | \
        while IFS='|' read -r number state severity rule created path; do
            # Filter by severity if specified
            if [[ "$filter_severity" != "all" ]] && [[ "$severity" != "$filter_severity" ]]; then
                continue
            fi

            # Color code by severity
            local severity_color="$NC"
            case "$severity" in
                critical) severity_color="$RED" ;;
                high) severity_color="$YELLOW" ;;
                medium) severity_color="$BLUE" ;;
                low) severity_color="$CYAN" ;;
            esac

            # Color code by state
            local state_color="$NC"
            case "$state" in
                open) state_color="$RED" ;;
                dismissed) state_color="$YELLOW" ;;
                closed|fixed) state_color="$GREEN" ;;
            esac

            echo -e "${BOLD}Alert #$number${NC}"
            echo -e "  State:    ${state_color}${state}${NC}"
            echo -e "  Severity: ${severity_color}${severity}${NC}"
            echo -e "  Rule:     $rule"
            echo -e "  Location: $path"
            echo -e "  Created:  $(date -d "$created" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "$created")"
            echo ""
        done
}

################################################################################
# CodeQL Analyses History
################################################################################

show_analyses() {
    parse_repo_arg "${1:-}"
    local limit="${2:-10}"

    print_header "Recent CodeQL Analyses for $REPO"

    local analyses
    analyses=$(gh api "/repos/$REPO/code-scanning/analyses?per_page=$limit" 2>&1)

    if [[ $? -ne 0 ]]; then
        print_error "Failed to retrieve analyses"
        echo "$analyses"
        exit 1
    fi

    local total=$(echo "$analyses" | jq '. | length')

    if [[ "$total" -eq 0 ]]; then
        print_warning "No analyses found"
        return
    fi

    echo -e "${BOLD}Showing last $total analyses:${NC}\n"

    echo "$analyses" | jq -r '.[] |
        "\(.id)|\(.created_at)|\(.tool.name)|\(.results_count)|\(.commit_sha[0:7])|\(.ref)"' | \
        while IFS='|' read -r id created tool results commit ref; do
            echo -e "${BOLD}Analysis ID:${NC} $id"
            echo -e "  Date:     $(date -d "$created" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "$created")"
            echo -e "  Tool:     $tool"
            echo -e "  Results:  $results"
            echo -e "  Commit:   $commit"
            echo -e "  Branch:   ${ref#refs/heads/}"
            echo ""
        done
}

################################################################################
# Update CodeQL Configuration
################################################################################

update_config() {
    parse_repo_arg "${1:-}"

    print_header "Update CodeQL Configuration for $REPO"

    print_warning "This will modify the CodeQL Default Setup configuration."
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Update cancelled"
        exit 0
    fi

    # Interactive configuration
    echo ""
    echo "Available options (press Enter to skip and keep current value):"
    echo ""

    # Languages
    echo -e "${BOLD}Languages:${NC}"
    echo "Available: javascript, typescript, python, ruby, go, java, cpp, csharp"
    echo "Multiple languages: comma-separated (e.g., javascript,typescript,python)"
    read -p "Languages: " new_languages

    # Query Suite
    echo -e "\n${BOLD}Query Suite:${NC}"
    echo "Options: default, extended, security-extended"
    read -p "Query Suite: " new_query_suite

    # Schedule
    echo -e "\n${BOLD}Schedule:${NC}"
    echo "Options: daily, weekly"
    read -p "Schedule: " new_schedule

    # Threat Model
    echo -e "\n${BOLD}Threat Model:${NC}"
    echo "Options: remote, local"
    read -p "Threat Model: " new_threat_model

    # Build JSON payload
    local payload="{"
    local has_changes=false

    if [[ -n "$new_languages" ]]; then
        local lang_array=$(echo "$new_languages" | jq -R 'split(",") | map(gsub("^\\s+|\\s+$";""))')
        payload+="\"languages\":$lang_array,"
        has_changes=true
    fi

    if [[ -n "$new_query_suite" ]]; then
        payload+="\"query_suite\":\"$new_query_suite\","
        has_changes=true
    fi

    if [[ -n "$new_schedule" ]]; then
        payload+="\"schedule\":\"$new_schedule\","
        has_changes=true
    fi

    if [[ -n "$new_threat_model" ]]; then
        payload+="\"threat_model\":\"$new_threat_model\","
        has_changes=true
    fi

    if [[ "$has_changes" == false ]]; then
        print_info "No changes specified"
        exit 0
    fi

    # Remove trailing comma and close JSON
    payload="${payload%,}}"

    print_info "Updating configuration..."

    local response
    response=$(gh api --method PATCH "/repos/$REPO/code-scanning/default-setup" \
        --input - <<< "$payload" 2>&1)

    if [[ $? -eq 0 ]]; then
        print_success "Configuration updated successfully!"
        echo ""
        show_status
    else
        print_error "Failed to update configuration"
        echo "$response"
        exit 1
    fi
}

################################################################################
# Help
################################################################################

show_help() {
    cat << EOF
${BOLD}CodeQL Manager${NC} - Manage CodeQL configuration via GitHub API

${BOLD}USAGE:${NC}
    $0 <command> [repository] [options]

${BOLD}COMMANDS:${NC}
    ${CYAN}status [repo]${NC}
        Display current CodeQL configuration
        Example: $0 status owner/repo

    ${CYAN}alerts [repo] [state] [severity]${NC}
        List security alerts
        States: open, closed, dismissed, all (default: all)
        Severities: critical, high, medium, low, all (default: all)
        Example: $0 alerts owner/repo open critical

    ${CYAN}analyses [repo] [limit]${NC}
        Show analysis history
        Limit: number of recent analyses to show (default: 10)
        Example: $0 analyses owner/repo 20

    ${CYAN}update [repo]${NC}
        Update CodeQL configuration interactively
        Example: $0 update owner/repo

    ${CYAN}help${NC}
        Show this help message

${BOLD}REPOSITORY:${NC}
    Repository in format: owner/repo
    If omitted, uses current repository (detected via gh CLI)

${BOLD}EXAMPLES:${NC}
    # Show status of current repository
    $0 status

    # Show status of specific repository
    $0 status microsoft/vscode

    # List open critical alerts
    $0 alerts owner/repo open critical

    # Show last 5 analyses
    $0 analyses owner/repo 5

    # Update configuration
    $0 update

${BOLD}REQUIREMENTS:${NC}
    - GitHub CLI (gh) installed and authenticated
    - jq for JSON processing
    - Repository access with code-scanning permissions

${BOLD}DOCUMENTATION:${NC}
    See scripts/README-CodeQL.md for detailed documentation

EOF
}

################################################################################
# Main
################################################################################

main() {
    check_dependencies

    local command="${1:-help}"
    shift || true

    case "$command" in
        status)
            show_status "$@"
            ;;
        alerts)
            show_alerts "$@"
            ;;
        analyses)
            show_analyses "$@"
            ;;
        update)
            update_config "$@"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
