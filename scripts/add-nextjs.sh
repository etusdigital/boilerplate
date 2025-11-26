#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main function
main() {
    echo ""
    echo "======================================"
    echo "   Add Next.js Frontend"
    echo "======================================"
    echo ""

    # Check if script is run from project root
    if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi

    # Check if Next.js frontend already exists
    if [ -d "apps/frontend-nextjs" ]; then
        print_error "Next.js frontend already exists at apps/frontend-nextjs"
        echo "  If you want to reinstall, remove the directory first:"
        echo "    rm -rf apps/frontend-nextjs"
        exit 1
    fi

    # Check if template exists
    if [ ! -d "templates/nextjs" ]; then
        print_error "Next.js template not found at templates/nextjs"
        echo "  The template should be included in the boilerplate repository."
        exit 1
    fi

    # Check if pnpm is installed
    if ! command_exists pnpm; then
        print_error "pnpm is not installed"
        echo "  Install it with: npm install -g pnpm"
        exit 1
    fi

    # Copy template
    print_info "Copying Next.js template to apps/frontend-nextjs..."
    cp -r templates/nextjs apps/frontend-nextjs

    # Setup environment file
    print_info "Setting up environment files..."
    if [ -f "apps/frontend-nextjs/.env.example" ]; then
        cp "apps/frontend-nextjs/.env.example" "apps/frontend-nextjs/.env"
        print_success "Created .env file"
    else
        print_warning ".env.example not found, you'll need to configure .env manually"
    fi

    # Install dependencies
    print_info "Installing Next.js dependencies with pnpm..."
    cd apps/frontend-nextjs
    pnpm install
    cd ../..

    # Success message
    echo ""
    echo "======================================"
    print_success "Next.js frontend added successfully!"
    echo "======================================"
    echo ""
    echo "To start the Next.js frontend:"
    echo "  cd apps/frontend-nextjs"
    echo "  pnpm dev"
    echo ""
    echo "The Next.js app will be available at:"
    echo "  http://localhost:3000"
    echo ""
    print_warning "Note: Make sure to configure Auth0 credentials in .env file"
    print_warning "Note: Make sure the backend CORS configuration allows requests from port 3000"
    echo ""
}

main "$@"
