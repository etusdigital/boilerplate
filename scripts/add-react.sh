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
    echo "   Add React Frontend"
    echo "======================================"
    echo ""

    # Check if script is run from project root
    if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi

    # Check if React frontend already exists
    if [ -d "apps/frontend-react" ]; then
        print_error "React frontend already exists at apps/frontend-react"
        echo "  If you want to reinstall, remove the directory first:"
        echo "    rm -rf apps/frontend-react"
        exit 1
    fi

    # Check if template exists
    if [ ! -d "templates/react" ]; then
        print_error "React template not found at templates/react"
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
    print_info "Copying React template to apps/frontend-react..."
    cp -r templates/react apps/frontend-react

    # Make template standalone by copying shared UI components
    print_info "Making template standalone (copying shared UI components)..."

    # Create lib/ui directory structure
    mkdir -p apps/frontend-react/src/lib/ui

    # Copy all contents from packages/ui-react/src to apps/frontend-react/src/lib/ui
    if [ -d "packages/ui-react/src" ]; then
        cp -r packages/ui-react/src/* apps/frontend-react/src/lib/ui/
        print_success "Copied shared UI components"
    else
        print_warning "packages/ui-react/src not found. Skipping UI components copy."
    fi

    # Rewrite imports in all TypeScript/TSX files
    print_info "Rewriting imports to use local UI components..."

    # Find all .ts and .tsx files and replace imports
    find apps/frontend-react/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
        -e "s|from '@boilerplate/ui-react'|from '@/lib/ui'|g" \
        -e 's|from "@boilerplate/ui-react"|from "@/lib/ui"|g' \
        -e "s|import '@boilerplate/ui-react/styles'|import '@/lib/ui/assets/main.css'|g" \
        -e 's|import "@boilerplate/ui-react/styles"|import "@/lib/ui/assets/main.css"|g' \
        {} +

    # Remove workspace dependency from package.json
    print_info "Removing workspace dependency from package.json..."
    sed -i '' '/"@boilerplate\/ui-react": "workspace:\*",/d' apps/frontend-react/package.json

    print_success "Template is now standalone!"

    # Setup environment file
    print_info "Setting up environment files..."
    if [ -f "apps/frontend-react/.env.example" ]; then
        cp "apps/frontend-react/.env.example" "apps/frontend-react/.env"
        print_success "Created .env file"
    else
        print_warning ".env.example not found, you'll need to configure .env manually"
    fi

    # Install dependencies
    print_info "Installing React dependencies with pnpm..."
    cd apps/frontend-react
    pnpm install
    cd ../..

    # Success message
    echo ""
    echo "======================================"
    print_success "React frontend added successfully!"
    echo "======================================"
    echo ""
    echo "To start the React frontend:"
    echo "  cd apps/frontend-react"
    echo "  pnpm dev"
    echo ""
    echo "The React app will be available at:"
    echo "  http://localhost:3000"
    echo ""
    print_warning "Note: Make sure the backend CORS configuration allows requests from port 3000"
    echo ""
}

# Run main function
main "$@"
