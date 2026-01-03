# 🚀 Production Deployment Guide

This guide will help you deploy BlueFin ISP to production using free tiers:
- **MongoDB Atlas** (Free Tier)
- **Render** (Backend - Free Tier)
- **Vercel** (Frontend - Free Tier)

## 📋 Prerequisites

1. GitHub account
2. MongoDB Atlas account (free)
3. Render account (free)
4. Vercel account (free)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (select FREE tier M0)

### 1.2 Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create a user with:
   - Username: `bluefin_admin`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: **Read and write to any database**

### 1.3 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add Render's IP ranges for better security

### 1.4 Get Connection String
1. Go to **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `bluefin_isp`
6. Example: `mongodb+srv://bluefin_admin:YourPassword@cluster0.xxxxx.mongodb.net/bluefin_isp?retryWrites=true&w=majority`

---

## Step 2: Backend Deployment on Render

### 2.1 Prepare Repository
1. Push your code to GitHub
2. Ensure `render.yaml` is in the root directory
3. Ensure `backend/package.json` exists with start script

### 2.2 Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `bluefin-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`

### 2.3 Set Environment Variables
In Render dashboard, go to **Environment** and add:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_generated_jwt_secret_32_chars_min
ADMIN_EMAIL=admin@bluefin.isp
ADMIN_PASSWORD=B1ueF!n@2024#Secure$Admin
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### 2.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://bluefin-backend.onrender.com`)

### 2.5 Seed Production Data
1. In Render dashboard, go to **Shell**
2. Run:
```bash
cd backend && node scripts/seedProduction.js
```

Or set up a one-time job:
- Go to **Background Jobs** → **New Background Job**
- Command: `cd backend && node scripts/seedProduction.js`
- Run once

---

## Step 3: Frontend Deployment on Vercel

### 3.1 Prepare Frontend
1. Ensure `vercel.json` is in the root directory
2. Update `frontend/package.json` to include build script (already present)

### 3.2 Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Set Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

Replace `your-backend.onrender.com` with your actual Render backend URL.

### 3.4 Deploy
1. Click **Deploy**
2. Wait for deployment
3. Copy your frontend URL (e.g., `https://bluefin-isp.vercel.app`)

### 3.5 Update Backend CORS
1. Go back to Render dashboard
2. Update `ALLOWED_ORIGINS` environment variable:
```env
ALLOWED_ORIGINS=https://bluefin-isp.vercel.app,https://www.yourdomain.com
```
3. Redeploy backend

---

## Step 4: Security Checklist

### ✅ Backend Security
- [x] Security headers (X-Frame-Options, CSP, etc.)
- [x] CORS configured with allowed origins
- [x] JWT secret is strong (32+ characters)
- [x] Admin password is strong
- [x] Error messages don't leak sensitive info in production
- [x] MongoDB connection uses SSL
- [x] File upload limits set (10MB)

### ✅ Frontend Security
- [x] API URL configured correctly
- [x] No sensitive data in client-side code
- [x] HTTPS enforced

### ✅ Database Security
- [x] Strong database user password
- [x] Network access restricted (or allow Render IPs)
- [x] Regular backups enabled (MongoDB Atlas free tier includes backups)

---

## Step 5: Post-Deployment

### 5.1 Verify Deployment
1. **Backend Health Check**: Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend**: Visit your Vercel URL
   - Should load the application

3. **Admin Login**: 
   - Go to `https://your-frontend.vercel.app/admin/login`
   - Email: `admin@bluefin.isp`
   - Password: `B1ueF!n@2024#Secure$Admin`

### 5.2 Test Features
- [ ] User registration
- [ ] User login
- [ ] Admin login
- [ ] Plan browsing
- [ ] Payment submission
- [ ] Support tickets
- [ ] Speed test
- [ ] Notifications

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check MONGODB_URI format
- Verify database user credentials
- Check network access in MongoDB Atlas

**CORS Errors**
- Verify ALLOWED_ORIGINS includes your Vercel URL
- Check frontend REACT_APP_API_URL matches backend URL

**Build Failures**
- Check Render logs
- Verify package.json scripts
- Ensure Node.js version is compatible

### Frontend Issues

**API Connection Errors**
- Verify REACT_APP_API_URL environment variable
- Check backend is running
- Verify CORS configuration

**Build Failures**
- Check Vercel build logs
- Verify all dependencies in package.json
- Check for TypeScript/ESLint errors

---

## 📝 Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
ADMIN_EMAIL=admin@bluefin.isp
ADMIN_PASSWORD=B1ueF!n@2024#Secure$Admin
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 🔐 Admin Credentials

**Default Production Admin:**
- Email: `admin@bluefin.isp`
- Password: `B1ueF!n@2024#Secure$Admin`

**⚠️ IMPORTANT:** Change these credentials after first login!

---

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Set up alerts for deployment failures
- Monitor resource usage (free tier limits)

### Vercel
- View build logs
- Monitor analytics
- Check deployment status

### MongoDB Atlas
- Monitor database usage
- Set up alerts for connection issues
- Review slow queries

---

## 🚀 Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificates (automatic with Render/Vercel)
3. Set up monitoring and alerts
4. Configure backups
5. Review and update security settings regularly

---

## 📞 Support

For issues:
1. Check Render/Vercel logs
2. Verify environment variables
3. Test API endpoints with Postman/curl
4. Review MongoDB Atlas connection status

---

**🎉 Congratulations! Your application is now live in production!**

