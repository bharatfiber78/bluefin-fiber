# Quick Run Guide

## ⚡ Quick Start (Once Node.js is installed)

### Step 1: Install Node.js
```bash
# Choose one method:
# Option 1: Using NodeSource (Recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Option 2: Using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
```

### Step 2: Install Dependencies
```bash
cd /home/abhinav.dixit/Desktop/bluefin
npm run install-all
```

### Step 3: Start MongoDB (if not running)
```bash
sudo systemctl start mongod
```

### Step 4: Seed Database (First time only)
```bash
npm run seed
```
This creates:
- Admin: `admin@bluefin.com` / `admin123`
- Sample WiFi plans

### Step 5: Run the Project

**Option A: Use the start script**
```bash
./start.sh
```

**Option B: Manual start**
```bash
npm run dev
```

## 🎯 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health
- **Admin Login**: http://localhost:3000/admin/login

## 📋 Available Commands

```bash
npm run dev          # Start both backend & frontend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run seed         # Seed database with admin & plans
npm run install-all  # Install all dependencies
```

## ✅ Verify Setup

1. **Check Node.js**: `node --version` (should be v14+)
2. **Check MongoDB**: `sudo systemctl status mongod`
3. **Test Backend**: Visit http://localhost:5000/api/health
4. **Test Frontend**: Visit http://localhost:3000

## 🐛 Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

**MongoDB not running:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
```

**Dependencies issues:**
```bash
rm -rf node_modules frontend/node_modules
npm run install-all
```

