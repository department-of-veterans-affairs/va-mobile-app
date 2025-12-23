#!/bin/bash
# Test script for GitHub release workflows
# Usage: ./scripts/test-workflows.sh [workflow_name] [version]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
WORKFLOW="${1:-all}"
VERSION="${2:-v9.99.0}"

echo -e "${BLUE}🧪 GitHub Workflows Testing Script${NC}"
echo "=================================="
echo ""

# Check if act is installed
check_act() {
    if command -v act &> /dev/null; then
        echo -e "${GREEN}✅ act is installed${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  act is not installed${NC}"
        echo ""
        echo "To test workflows locally, install act:"
        echo "  brew install act"
        echo ""
        echo "Or test via GitHub UI using:"
        echo "  gh workflow run test_release_workflows.yml"
        return 1
    fi
}

# Validate version format
validate_version() {
    if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo -e "${RED}❌ Invalid version format: $VERSION${NC}"
        echo "Expected format: v#.#.# (e.g., v9.99.0)"
        exit 1
    fi
    echo -e "${GREEN}✅ Version format valid: $VERSION${NC}"
}

# Check if release branch exists
check_release_branch() {
    if git show-ref --verify --quiet refs/heads/release/$VERSION; then
        echo -e "${GREEN}✅ Release branch exists: release/$VERSION${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Release branch does NOT exist: release/$VERSION${NC}"
        return 1
    fi
}

# Test using act (local)
test_with_act() {
    local workflow_file=$1
    echo ""
    echo -e "${BLUE}Testing $workflow_file locally with act...${NC}"
    
    # Check if secrets file exists
    if [[ ! -f ".github/workflows/.secrets" ]]; then
        echo -e "${YELLOW}⚠️  No secrets file found at .github/workflows/.secrets${NC}"
        echo "Create one with required secrets for full testing"
    fi
    
    act workflow_dispatch \
        -W "$workflow_file" \
        -j test_release_pull_request \
        --input version="$VERSION" \
        --input dry_run=true \
        --secret-file .github/workflows/.secrets 2>/dev/null || true
}

# Test using GitHub CLI (remote)
test_with_gh() {
    echo ""
    echo -e "${BLUE}Testing via GitHub Actions...${NC}"
    echo ""
    echo -e "${RED}🚨 SAFETY NOTE: This only runs validation tests${NC}"
    echo -e "${RED}   It will NOT trigger actual release workflows${NC}"
    echo ""
    echo "Run this command to test in GitHub:"
    echo ""
    echo -e "${GREEN}gh workflow run test_release_workflows.yml \\${NC}"
    echo -e "${GREEN}  --ref chore.12210.slash.command.update \\${NC}"
    echo -e "${GREEN}  -f workflow_to_test=$WORKFLOW \\${NC}"
    echo -e "${GREEN}  -f version=$VERSION \\${NC}"
    echo -e "${GREEN}  -f dry_run=true${NC}"
    echo ""
    
    read -p "Run this now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh workflow run test_release_workflows.yml \
            --ref chore.12210.slash.command.update \
            -f workflow_to_test="$WORKFLOW" \
            -f version="$VERSION" \
            -f dry_run=true
        echo ""
        echo -e "${GREEN}✅ Workflow triggered! View status with:${NC}"
        echo "gh run list --workflow=test_release_workflows.yml"
    fi
}

# Dry run validation
dry_run_validation() {
    echo ""
    echo -e "${BLUE}🔍 Performing dry-run validation...${NC}"
    echo ""
    
    # Check workflow files syntax
    echo "Validating workflow syntax..."
    for workflow in .github/workflows/release*.yml .github/workflows/run_approval.yml; do
        if [[ -f "$workflow" ]]; then
            # Basic YAML validation
            if python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
                echo -e "${GREEN}✅ $workflow - valid YAML${NC}"
            else
                echo -e "${RED}❌ $workflow - invalid YAML${NC}"
            fi
        fi
    done
    
    echo ""
    echo "Checking required secrets..."
    secrets=("FLAGSHIP_MOBILE_APP_ID" "FLAGSHIP_MOBILE_APP_PRIVATE_KEY" "SLACK_API_TOKEN")
    for secret in "${secrets[@]}"; do
        if gh secret list | grep -q "$secret"; then
            echo -e "${GREEN}✅ $secret - configured${NC}"
        else
            echo -e "${YELLOW}⚠️  $secret - not found${NC}"
        fi
    done
}

# Main execution
main() {
    echo "Workflow: $WORKFLOW"
    echo "Version: $VERSION"
    echo ""
    
    validate_version
    check_release_branch || echo ""
    
    dry_run_validation
    
    if check_act; then
        echo ""
        read -p "Test with act locally? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            test_with_act ".github/workflows/test_release_workflows.yml"
        fi
    fi
    
    test_with_gh
    
    echo ""
    echo -e "${BLUE}📚 Additional Testing Options:${NC}"
    echo "1. Manual trigger: Go to Actions → '[Test] Release Workflows Testing'"
    echo "2. Create test branch: git checkout -b release/$VERSION"
    echo "3. View logs: gh run list --workflow=test_release_workflows.yml"
    echo ""
}

# Show usage
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    echo "Usage: $0 [workflow_name] [version]"
    echo ""
    echo "Arguments:"
    echo "  workflow_name   Which workflow to test (default: all)"
    echo "                  Options: release_pull_request, run_approval, all"
    echo "  version         Test version number (default: v9.99.0)"
    echo ""
    echo "Examples:"
    echo "  $0 all v9.99.0"
    echo "  $0 release_pull_request v1.2.3"
    echo ""
    exit 0
fi

main
