#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_header() {
    echo ""
    echo "======================================"
    echo "   $1"
    echo "======================================"
    echo ""
}

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

print_header "Boilerplate Test Runner"

# Check if TEST_DIR is provided
if [ -z "$1" ]; then
    TEST_DIR="$HOME/boilerplate-tests"
    print_info "No test directory specified. Using default: $TEST_DIR"
else
    TEST_DIR="$1"
fi

# Create test directory
if [ -d "$TEST_DIR" ]; then
    print_warning "Test directory already exists: $TEST_DIR"
    read -p "Delete and recreate? (y/N): " CONFIRM
    if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
        rm -rf "$TEST_DIR"
    else
        print_error "Aborted"
        exit 1
    fi
fi

mkdir -p "$TEST_DIR"
print_success "Created test directory: $TEST_DIR"

# Function to setup test environment
setup_test_env() {
    local test_name=$1
    local test_path="$TEST_DIR/$test_name"

    print_info "Setting up test environment: $test_name"

    mkdir -p "$test_path"

    # Copy boilerplate (excluding node_modules, .git, etc)
    rsync -av \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='build' \
        --exclude='.turbo' \
        --exclude='*.log' \
        --exclude='apps/frontend-react' \
        --exclude='apps/frontend-vue' \
        "$REPO_ROOT/" "$test_path/"

    print_success "Test environment ready: $test_path"
    echo "$test_path"
}

# Menu
print_info "Select test scenario:"
echo "1) Test React installation (Scenario 1)"
echo "2) Test Vue installation (Scenario 2)"
echo "3) Test Both frontends (Scenario 3)"
echo "4) Test Skip + Manual add (Scenario 4)"
echo "5) Run all scenarios"
echo "6) Clean test directory and exit"
echo ""
read -p "Choose (1-6): " CHOICE

case $CHOICE in
    1)
        TEST_PATH=$(setup_test_env "test-react")
        print_header "Test Scenario 1: React Installation"
        print_info "Test environment: $TEST_PATH"
        print_info "Follow TEST_PLAN.md - Scenario 1"
        print_warning "Manual steps required:"
        echo "1. cd $TEST_PATH"
        echo "2. bash install.sh"
        echo "3. Choose React (option 1)"
        echo "4. Test backend: cd apps/backend && pnpm dev"
        echo "5. Test frontend: cd apps/frontend-react && pnpm dev"
        ;;
    2)
        TEST_PATH=$(setup_test_env "test-vue")
        print_header "Test Scenario 2: Vue Installation"
        print_info "Test environment: $TEST_PATH"
        print_info "Follow TEST_PLAN.md - Scenario 2"
        print_warning "Manual steps required:"
        echo "1. cd $TEST_PATH"
        echo "2. bash install.sh"
        echo "3. Choose Vue (option 2)"
        echo "4. Test backend and frontend"
        ;;
    3)
        TEST_PATH=$(setup_test_env "test-both")
        print_header "Test Scenario 3: Both Frontends"
        print_info "Test environment: $TEST_PATH"
        print_info "Follow TEST_PLAN.md - Scenario 3"
        ;;
    4)
        TEST_PATH=$(setup_test_env "test-skip")
        print_header "Test Scenario 4: Skip + Manual"
        print_info "Test environment: $TEST_PATH"
        print_info "Follow TEST_PLAN.md - Scenario 4"
        ;;
    5)
        print_header "Running All Scenarios"
        setup_test_env "test-react"
        setup_test_env "test-vue"
        setup_test_env "test-both"
        setup_test_env "test-skip"
        print_success "All test environments created in: $TEST_DIR"
        print_info "Follow TEST_PLAN.md to execute each scenario"
        ;;
    6)
        if [ -d "$TEST_DIR" ]; then
            rm -rf "$TEST_DIR"
            print_success "Cleaned test directory: $TEST_DIR"
        fi
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_info "Test directory: $TEST_DIR"
print_info "Refer to TEST_PLAN.md for detailed test steps"
echo ""
