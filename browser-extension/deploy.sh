#!/bin/bash
# Browser Extension Publishing Script

EXTENSION_DIR="./browser-extension"
DIST_DIR="./dist"

echo "📦 Packaging MindReply Browser Extension..."

# Create dist folder
mkdir -p $DIST_DIR

# Create ZIP for Chrome Web Store
cd $EXTENSION_DIR
zip -r ../dist/mindreply-extension.zip . \
    -x "README.md" "*.git*" ".DS_Store"

echo "✅ Extension packaged: dist/mindreply-extension.zip"

# Display publishing instructions
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "Chrome Web Store:"
echo "  1. Go to: https://chrome.google.com/webstore/publish"
echo "  2. Upload: dist/mindreply-extension.zip"
echo "  3. Add screenshots, description, support email"
echo "  4. Submit for review (< 24 hours)"
echo ""
echo "Microsoft Edge Add-ons:"
echo "  1. Go to: https://partner.microsoft.com/dashboard"
echo "  2. Submit same ZIP file"
echo "  3. Review: < 5 days"
echo ""
echo "Brave Browser:"
echo "  1. Submit to: https://chrome.google.com/webstore (auto-synced)"
echo ""
echo "✨ Ready to go live!"
