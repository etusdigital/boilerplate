#!/bin/bash

# Generate RSA key pair for RS256 JWT signing
# This script creates private and public keys for self-issued JWT tokens

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYS_DIR="$SCRIPT_DIR/../keys"

# Create keys directory if it doesn't exist
mkdir -p "$KEYS_DIR"

# Check if keys already exist
if [ -f "$KEYS_DIR/private.pem" ] && [ -f "$KEYS_DIR/public.pem" ]; then
    echo "Keys already exist in $KEYS_DIR"
    echo "To regenerate, delete the existing keys first."
    exit 0
fi

echo "Generating RSA key pair..."

# Generate 2048-bit RSA private key
openssl genrsa -out "$KEYS_DIR/private.pem" 2048

# Extract public key from private key
openssl rsa -in "$KEYS_DIR/private.pem" -pubout -out "$KEYS_DIR/public.pem"

# Set appropriate permissions
chmod 600 "$KEYS_DIR/private.pem"
chmod 644 "$KEYS_DIR/public.pem"

echo ""
echo "RSA key pair generated successfully!"
echo "  Private key: $KEYS_DIR/private.pem"
echo "  Public key:  $KEYS_DIR/public.pem"
echo ""
echo "Add these to your .env file:"
echo "  JWT_PRIVATE_KEY_PATH=./keys/private.pem"
echo "  JWT_PUBLIC_KEY_PATH=./keys/public.pem"
echo ""
echo "IMPORTANT: Never commit the private key to version control!"
