#!/bin/bash

echo "🔧 Admin Dashboard Setup"
echo "======================="
echo ""

# Create admin user
read -p "Enter admin email: " ADMIN_EMAIL
read -sp "Enter admin password: " ADMIN_PASSWORD
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create initial admin via API
echo "Creating admin user..."
curl -X POST http://localhost:3001/api/admin/auth/init \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\",
    \"ipWhitelist\": [\"127.0.0.1\", \"::1\"]
  }"

echo ""
echo "✅ Admin created!"
echo ""
echo "🌐 Access dashboard at: http://localhost:3002"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: (use the password you entered)"
echo ""
