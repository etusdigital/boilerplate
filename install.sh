#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="etusdigital/boilerplate"
# This should match the branch name where this script is located
GITHUB_BRANCH="${GITHUB_BRANCH:-add-nextjs-template}"
REQUIRED_NODE_VERSION=18

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

# Function to detect download tool
detect_download_tool() {
    if command -v curl >/dev/null 2>&1; then
        echo "curl"
    elif command -v wget >/dev/null 2>&1; then
        echo "wget"
    else
        print_error "Neither curl nor wget found. Please install one of them."
        echo "  On macOS: brew install curl"
        echo "  On Ubuntu/Debian: sudo apt-get install curl"
        echo "  On CentOS/RHEL: sudo yum install curl"
        exit 1
    fi
}

# Function to download file
download_file() {
    local url=$1
    local output=$2
    local tool=$(detect_download_tool)

    if [ "$tool" = "curl" ]; then
        curl -fsSL "$url" -o "$output"
    else
        wget -q "$url" -O "$output"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare versions
version_compare() {
    local version1=$1
    local version2=$2

    if [ "$(printf '%s\n' "$version2" "$version1" | sort -V | head -n1)" = "$version2" ]; then
        return 0
    else
        return 1
    fi
}

# Function to check Node.js installation and version
check_node() {
    if ! command_exists node; then
        print_error "Node.js is not installed."
        print_info "Please install Node.js version $REQUIRED_NODE_VERSION or higher."

        if command_exists brew; then
            echo "  You can install it using Homebrew:"
            echo "    brew install node"
        else
            echo "  We recommend using nvm (Node Version Manager):"
            echo "    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
            echo "    nvm install $REQUIRED_NODE_VERSION"
            echo ""
            echo "  Or visit https://nodejs.org for other installation methods."
        fi
        exit 1
    fi

    local node_version=$(node -v | sed 's/v//')
    if ! version_compare "$node_version" "$REQUIRED_NODE_VERSION"; then
        print_error "Node.js version $node_version is installed, but version $REQUIRED_NODE_VERSION or higher is required."
        echo "  Please upgrade Node.js to continue."
        exit 1
    fi

    print_success "Node.js $(node -v) is installed"
}

# Function to check and install pnpm
check_pnpm() {
    if ! command_exists pnpm; then
        print_warning "pnpm is not installed. Installing it now..."

        if command_exists npm; then
            npm install -g pnpm
            if command_exists pnpm; then
                print_success "pnpm has been installed successfully"
            else
                print_error "Failed to install pnpm. Please install it manually:"
                echo "  npm install -g pnpm"
                exit 1
            fi
        else
            print_error "npm is not available. Cannot install pnpm automatically."
            echo "  Please install pnpm manually:"
            echo "    curl -fsSL https://get.pnpm.io/install.sh | sh -"
            echo "  Or visit https://pnpm.io/installation for other methods."
            exit 1
        fi
    else
        print_success "pnpm $(pnpm -v) is installed"
    fi
}

# Function to check if unzip is available
check_unzip() {
    if ! command_exists unzip; then
        print_error "unzip is not installed."
        echo "  On macOS: should be pre-installed"
        echo "  On Ubuntu/Debian: sudo apt-get install unzip"
        echo "  On CentOS/RHEL: sudo yum install unzip"
        exit 1
    fi
}

# Function to check if git is available
check_git() {
    if ! command_exists git; then
        print_error "git is not installed."
        echo "  On macOS: brew install git"
        echo "  On Ubuntu/Debian: sudo apt-get install git"
        echo "  On CentOS/RHEL: sudo yum install git"
        exit 1
    else
        print_success "git $(git --version | cut -d' ' -f3) is installed"
    fi
}

# Main installation function
main() {
    echo ""
    echo "======================================"
    echo "   Etus Boilerplate Installer"
    echo "======================================"
    echo ""

    # Check prerequisites
    print_info "Checking prerequisites..."
    check_node
    check_pnpm
    check_unzip
    check_git
    detect_download_tool >/dev/null

    # Get project name
    echo ""
    read -p "Enter project name: " PROJECT_NAME

    if [ -z "$PROJECT_NAME" ]; then
        print_error "Project name cannot be empty"
        exit 1
    fi

    if [ -d "$PROJECT_NAME" ]; then
        print_error "Directory '$PROJECT_NAME' already exists"
        exit 1
    fi

    # Download repository
    print_info "Downloading boilerplate from GitHub..."

    TEMP_DIR=$(mktemp -d)
    ZIP_FILE="$TEMP_DIR/boilerplate.zip"
    DOWNLOAD_URL="https://github.com/$GITHUB_REPO/archive/refs/heads/$GITHUB_BRANCH.zip"

    if ! download_file "$DOWNLOAD_URL" "$ZIP_FILE"; then
        print_error "Failed to download repository"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    # Extract files
    print_info "Extracting files..."

    unzip -q "$ZIP_FILE" -d "$TEMP_DIR"

    # Move to project directory
    EXTRACTED_DIR="$TEMP_DIR/boilerplate-$GITHUB_BRANCH"
    if [ ! -d "$EXTRACTED_DIR" ]; then
        # Try alternative naming pattern
        EXTRACTED_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "boilerplate*" | head -1)
        if [ -z "$EXTRACTED_DIR" ]; then
            print_error "Failed to find extracted directory"
            rm -rf "$TEMP_DIR"
            exit 1
        fi
    fi

    mv "$EXTRACTED_DIR" "$PROJECT_NAME"
    rm -rf "$TEMP_DIR"

    cd "$PROJECT_NAME"

    # Setup environment files
    print_info "Setting up backend environment files..."

    if [ -f "apps/backend/.env.example" ]; then
        cp "apps/backend/.env.example" "apps/backend/.env"
        print_success "Created backend .env file"
    else
        print_warning "Backend .env.example not found"
    fi

    # Install backend dependencies only
    print_info "Installing backend dependencies with pnpm..."
    cd apps/backend
    pnpm install
    cd ../..

    # Build backend
    print_info "Building backend..."
    cd apps/backend && pnpm run build
    cd ../..

    # Run migrations and seeds
    print_info "Running database migrations and seeds..."
    pnpm run migration

    # Ask about creating user
    echo ""
    read -p "Would you like to create a super admin user? (y/N): " CREATE_USER

    if [[ "$CREATE_USER" =~ ^[Yy]$ ]]; then
        read -p "Enter name: " USER_NAME
        read -p "Enter email: " USER_EMAIL

        if [ -n "$USER_NAME" ] && [ -n "$USER_EMAIL" ]; then
            print_info "Creating super admin user..."

            # Escape single quotes in user input
            USER_NAME_ESCAPED=$(echo "$USER_NAME" | sed "s/'/\\\'/g")
            USER_EMAIL_ESCAPED=$(echo "$USER_EMAIL" | sed "s/'/\\\'/g")

            cd apps/backend
            # Generate UUID
            USER_UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')

            npx typeorm query "INSERT INTO users (id, name, email, status, is_super_admin) VALUES ('$USER_UUID', '$USER_NAME_ESCAPED', '$USER_EMAIL_ESCAPED', 'invited', true);" -d dist/database/ormconfig.js
            cd ../..

            print_success "User created successfully"
        else
            print_warning "Name and email are required. Skipping user creation."
        fi
    fi

    # Ask about frontend choice
    echo ""
    echo "======================================"
    echo "   Frontend Selection"
    echo "======================================"
    echo ""
    echo "Which frontend would you like to install?"
    echo "1) React (React 18 + Zustand + TailwindCSS)"
    echo "2) Vue (Vue 3 + Pinia + Design System)"
    echo "3) Next.js (Next.js 15 + App Router + TailwindCSS)"
    echo "4) React + Vue"
    echo "5) React + Next.js"
    echo "6) All (React + Vue + Next.js)"
    echo "7) Skip (install frontend later)"
    echo ""
    read -p "Choose (1/2/3/4/5/6/7): " FRONTEND_CHOICE

    FRONTEND_INSTALLED=""

    case $FRONTEND_CHOICE in
        1)
            print_info "Installing React frontend..."
            if bash scripts/add-react.sh; then
                FRONTEND_INSTALLED="React"
            fi
            ;;
        2)
            print_info "Installing Vue frontend..."
            if bash scripts/add-vue.sh; then
                FRONTEND_INSTALLED="Vue"
            fi
            ;;
        3)
            print_info "Installing Next.js frontend..."
            if bash scripts/add-nextjs.sh; then
                FRONTEND_INSTALLED="Next.js"
            fi
            ;;
        4)
            print_info "Installing React frontend..."
            if bash scripts/add-react.sh; then
                print_info "Installing Vue frontend..."
                if bash scripts/add-vue.sh; then
                    FRONTEND_INSTALLED="React and Vue"
                fi
            fi
            ;;
        5)
            print_info "Installing React frontend..."
            if bash scripts/add-react.sh; then
                print_info "Installing Next.js frontend..."
                if bash scripts/add-nextjs.sh; then
                    FRONTEND_INSTALLED="React and Next.js"
                fi
            fi
            ;;
        6)
            print_info "Installing all frontends..."
            if bash scripts/add-react.sh; then
                print_info "Installing Vue frontend..."
                if bash scripts/add-vue.sh; then
                    print_info "Installing Next.js frontend..."
                    if bash scripts/add-nextjs.sh; then
                        FRONTEND_INSTALLED="React, Vue, and Next.js"
                    fi
                fi
            fi
            ;;
        7)
            print_info "Skipping frontend installation"
            print_info "You can install a frontend later with:"
            echo "  bash scripts/add-react.sh"
            echo "  bash scripts/add-vue.sh"
            echo "  bash scripts/add-nextjs.sh"
            ;;
        *)
            print_warning "Invalid choice. Skipping frontend installation."
            print_info "You can install a frontend later with:"
            echo "  bash scripts/add-react.sh"
            echo "  bash scripts/add-vue.sh"
            echo "  bash scripts/add-nextjs.sh"
            ;;
    esac

    # Initialize git repository
    print_info "Initializing git repository..."
    
    # Check if .git directory already exists
    if [ -d ".git" ]; then
        print_warning "Git repository already exists. Skipping git initialization."
    else
        git init
        print_success "Git repository initialized"
        
        # Add all files to git
        print_info "Adding files to git..."
        git add .
        
        # Create initial commit
        print_info "Creating initial commit..."
        git commit -m "feat: initial commit - etus boilerplate setup"
        
        print_success "Initial commit created"
    fi

    # Success message
    echo ""
    echo "======================================"
    print_success "Project '$PROJECT_NAME' created successfully!"
    echo "======================================"
    echo ""

    if [ -n "$FRONTEND_INSTALLED" ]; then
        echo "Installed components:"
        echo "  ✅ Backend (NestJS)"
        echo "  ✅ Frontend ($FRONTEND_INSTALLED)"
        echo ""
        echo "To get started:"
        echo "  cd $PROJECT_NAME"
        echo "  pnpm dev"
        echo ""
        echo "The application will be available at:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:3001"
    else
        echo "Installed components:"
        echo "  ✅ Backend (NestJS)"
        echo "  ⚠️  No frontend installed"
        echo ""
        echo "To add a frontend, run:"
        echo "  cd $PROJECT_NAME"
        echo "  bash scripts/add-react.sh   # For React"
        echo "  bash scripts/add-vue.sh      # For Vue"
        echo ""
        echo "To start the backend only:"
        echo "  cd $PROJECT_NAME"
        echo "  cd apps/backend && pnpm dev"
        echo ""
        echo "Backend will be available at:"
        echo "  http://localhost:3001"
    fi

    echo ""
    echo "Git repository has been initialized with an initial commit."
    echo "You can now start developing and making commits!"
    echo ""
}

# Run main function
main "$@"
