# Setup Guide - BlueFin ISP Project

## Prerequisites Installation

### 1. Install Node.js (if not installed)

**Option A: Using NodeSource (Recommended)**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Option B: Using nvm (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

**Option C: Using apt (may have older version)**
```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Verify MongoDB is Running
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it:
sudo systemctl start mongod

# Enable MongoDB to start on boot:
sudo systemctl enable mongod
```

## Project Setup Steps

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### Step 2: Create Environment File

Create a `.env` file in the root directory:

```bash
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bluefin_isp
JWT_SECRET=bluefin_super_secret_jwt_key_2024_change_in_production
NODE_ENV=development
EOF
```

### Step 3: Seed Initial Data

This creates an admin user and sample plans:

```bash
npm run seed
```

**Admin Credentials:**
- Email: `admin@bluefin.com`
- Password: `admin123`

### Step 4: Start the Application

**Option A: Run both servers together (Recommended)**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:3000/admin/login

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### Port Already in Use
```bash
# Check what's using port 5000
sudo lsof -i :5000

# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed (replace PID)
kill -9 <PID>
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules frontend/node_modules
npm run install-all
```

### Frontend Build Issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing the Setup

1. **Check Backend**: Visit http://localhost:5000/api/health
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Check Frontend**: Visit http://localhost:3000
   - Should show the plans page

3. **Test Admin Login**:
   - Go to http://localhost:3000/admin/login
   - Login with: `admin@bluefin.com` / `admin123`

4. **Test User Registration**:
   - Go to http://localhost:3000/register
   - Create a test user account

## Next Steps

1. Replace the placeholder UPI QR code in `frontend/src/pages/Payment.js`
2. Customize branding and colors in `frontend/tailwind.config.js`
3. Add your actual MongoDB connection string if using MongoDB Atlas

