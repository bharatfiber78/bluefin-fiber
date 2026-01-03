#!/bin/bash

echo "🚀 Starting BlueFin ISP Project..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js first. See SETUP.md for instructions."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check if MongoDB is accessible
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB client not found, but continuing..."
else
    echo "✅ MongoDB client found"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Creating one..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bluefin_isp
JWT_SECRET=bluefin_super_secret_jwt_key_2024_change_in_production
NODE_ENV=development
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file exists"
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Check if database is seeded
echo ""
echo "🌱 Checking if database needs seeding..."
echo "   (Run 'npm run seed' if you haven't already)"

# Start the application
echo ""
echo "🎯 Starting development servers..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

npm run dev

