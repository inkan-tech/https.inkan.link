#!/bin/bash
# Website Analysis Tools Setup for Inkan.link Hugo Site
# Installs performance monitoring, accessibility testing, and SEO analysis tools
# Run with: chmod +x setup-analysis-tools.sh && ./setup-analysis-tools.sh

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_step() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header "🔧 Setting up Website Analysis Tools for Inkan.link"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is required but not available."
    exit 1
fi

print_step "✅ Node.js and npm are available"
echo "   Node.js version: $(node --version)"
echo "   npm version: $(npm --version)"

print_step "1️⃣ Installing core performance analysis tools..."

# Install global tools for performance analysis
npm install -g lighthouse
npm install -g @axe-core/cli
npm install -g pa11y
npm install -g playwright

print_step "2️⃣ Setting up Playwright browsers..."

# Install only Chromium to save space (sufficient for most testing)
npx playwright install chromium

print_step "3️⃣ Installing optional development tools..."

# Optional tools that enhance the analysis workflow
if command -v brew &> /dev/null; then
    print_step "   Installing additional tools via Homebrew..."
    brew install jq curl imagemagick || print_warning "Some Homebrew tools failed to install"
else
    print_warning "Homebrew not found. Some optional tools will be skipped."
fi

print_step "4️⃣ Testing tool installations..."

# Test each tool and report status
echo ""
echo "Testing installed tools:"

# Test Lighthouse
if command -v lighthouse &> /dev/null; then
    LIGHTHOUSE_VERSION=$(lighthouse --version 2>/dev/null || echo 'FAILED')
    echo -e "   ${GREEN}✅ Lighthouse: $LIGHTHOUSE_VERSION${NC}"
else
    echo -e "   ${RED}❌ Lighthouse: Installation failed${NC}"
fi

# Test Axe
if command -v axe &> /dev/null; then
    AXE_VERSION=$(axe --version 2>/dev/null || echo 'FAILED')
    echo -e "   ${GREEN}✅ Axe-core: $AXE_VERSION${NC}"
else
    echo -e "   ${RED}❌ Axe-core: Installation failed${NC}"
fi

# Test Pa11y
if command -v pa11y &> /dev/null; then
    PA11Y_VERSION=$(pa11y --version 2>/dev/null || echo 'FAILED')
    echo -e "   ${GREEN}✅ Pa11y: $PA11Y_VERSION${NC}"
else
    echo -e "   ${RED}❌ Pa11y: Installation failed${NC}"
fi

# Test Playwright
if command -v playwright &> /dev/null; then
    PLAYWRIGHT_VERSION=$(playwright --version 2>/dev/null || echo 'FAILED')
    echo -e "   ${GREEN}✅ Playwright: $PLAYWRIGHT_VERSION${NC}"
else
    echo -e "   ${RED}❌ Playwright: Installation failed${NC}"
fi

# Test Hugo (should already be installed for this project)
if command -v hugo &> /dev/null; then
    HUGO_VERSION=$(hugo version | head -n1)
    echo -e "   ${GREEN}✅ Hugo: $HUGO_VERSION${NC}"
else
    echo -e "   ${YELLOW}⚠️  Hugo: Not found (required for local testing)${NC}"
fi

print_step "5️⃣ Creating analysis directories..."

# Create directories for reports if they don't exist
mkdir -p analysis-reports
mkdir -p performance-reports
mkdir -p accessibility-reports

print_step "6️⃣ Setting up analysis configuration..."

# Make analysis script executable
if [ -f "analyze-website.sh" ]; then
    chmod +x analyze-website.sh
    echo -e "   ${GREEN}✅ analyze-website.sh is now executable${NC}"
else
    print_warning "analyze-website.sh not found in current directory"
fi

# Verify lighthouse config exists
if [ -f "lighthouse-config.js" ]; then
    echo -e "   ${GREEN}✅ lighthouse-config.js found${NC}"
else
    print_warning "lighthouse-config.js not found - some features may be limited"
fi

print_header "✅ Setup Complete!"

echo ""
echo -e "${BLUE}🎯 Available Commands:${NC}"
echo ""
echo -e "${GREEN}npm run analyze${NC}              - Full website analysis"
echo -e "${GREEN}npm run analyze:quick${NC}        - Quick analysis (limited pages)"
echo -e "${GREEN}npm run lighthouse${NC}           - Lighthouse audit of production site"
echo -e "${GREEN}npm run lighthouse:local${NC}     - Lighthouse audit of local development"
echo -e "${GREEN}npm run accessibility${NC}        - Accessibility audit"
echo ""
echo -e "${BLUE}📁 Report Directories:${NC}"
echo "   analysis-reports/     - Comprehensive analysis results"
echo "   performance-reports/  - Performance-specific reports"
echo "   accessibility-reports/ - Accessibility audit results"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Run 'npm run analyze' to perform a full website analysis"
echo "2. Check the generated reports in the respective directories"
echo "3. Set up a regular analysis schedule (weekly/monthly)"
echo "4. Share reports with your team for performance tracking"
echo ""
echo -e "${BLUE}💡 Pro Tips:${NC}"
echo "• Run analysis before and after major changes"
echo "• Compare bilingual pages (French vs English) performance"
echo "• Monitor Core Web Vitals regularly for SEO benefits"
echo "• Use accessibility reports for WCAG compliance"
echo ""
echo -e "${GREEN}Setup completed successfully! 🎉${NC}"