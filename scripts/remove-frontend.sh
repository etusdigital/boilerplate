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

# Main function
main() {
    echo ""
    echo "======================================"
    echo "   Remove Frontend"
    echo "======================================"
    echo ""

    # Check if script is run from project root
    if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi

    # Ask which frontend to remove
    echo "Which frontend do you want to remove?"
    echo "1) React (apps/frontend-react)"
    echo "2) Vue (apps/frontend-vue)"
    echo ""
    read -p "Choose (1/2): " choice

    case $choice in
        1)
            FRONTEND="react"
            FRONTEND_DIR="apps/frontend-react"
            ;;
        2)
            FRONTEND="vue"
            FRONTEND_DIR="apps/frontend-vue"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac

    # Check if frontend exists
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "$FRONTEND frontend not found at $FRONTEND_DIR"
        exit 1
    fi

    # Confirmation
    echo ""
    print_warning "This will permanently delete the $FRONTEND frontend at $FRONTEND_DIR"
    print_warning "This action cannot be undone!"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Operation cancelled"
        exit 0
    fi

    # Remove frontend
    print_info "Removing $FRONTEND frontend..."
    rm -rf "$FRONTEND_DIR"

    # Success message
    echo ""
    echo "======================================"
    print_success "$FRONTEND frontend removed successfully!"
    echo "======================================"
    echo ""
    echo "The directory $FRONTEND_DIR has been deleted."
    echo ""
    echo "To add it back, run:"
    echo "  bash scripts/add-$FRONTEND.sh"
    echo ""
}

# Run main function
main "$@"
