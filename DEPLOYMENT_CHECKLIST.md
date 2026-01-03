# ✅ Production Deployment Checklist

## Pre-Deployment

### MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user with strong password
- [ ] Configure network access (0.0.0.0/0 or Render IPs)
- [ ] Copy connection string
- [ ] Test connection

### Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=<your_mongodb_uri>`
  - [ ] `JWT_SECRET=<generate_with_openssl_rand_-base64_32>`
  - [ ] `ADMIN_EMAIL=admin@bluefin.isp`
  - [ ] `ADMIN_PASSWORD=B1ueF!n@2024#Secure$Admin`
  - [ ] `ALLOWED_ORIGINS=<your_vercel_url>`
- [ ] Deploy backend
- [ ] Verify backend URL (e.g., `https://bluefin-backend.onrender.com`)
- [ ] Test health endpoint: `/api/health`
- [ ] Run production seed: `node backend/scripts/seedProduction.js`

### Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure project:
  - [ ] Framework: Create React App
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Set environment variable:
  - [ ] `REACT_APP_API_URL=<your_render_backend_url>/api`
- [ ] Deploy frontend
- [ ] Copy frontend URL

### Update Backend CORS
- [ ] Update `ALLOWED_ORIGINS` in Render with Vercel URL
- [ ] Redeploy backend

## Post-Deployment Verification

### Backend Tests
- [ ] Health check: `GET /api/health` returns 200
- [ ] CORS headers present
- [ ] Security headers present
- [ ] MongoDB connected

### Frontend Tests
- [ ] Frontend loads
- [ ] API connection works
- [ ] No CORS errors in console

### Authentication Tests
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works:
  - Email: `admin@bluefin.isp`
  - Password: `B1ueF!n@2024#Secure$Admin`
- [ ] JWT tokens work
- [ ] Protected routes require auth

### Feature Tests
- [ ] Browse plans
- [ ] View plan details
- [ ] Submit payment
- [ ] Create support ticket
- [ ] Run speed test
- [ ] View notifications
- [ ] Admin dashboard loads
- [ ] Admin can verify payments

## Security Verification

- [ ] No secrets in codebase
- [ ] Environment variables set correctly
- [ ] HTTPS enforced (automatic with Render/Vercel)
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Strong admin password set
- [ ] Strong JWT secret set
- [ ] MongoDB connection uses SSL

## Final Steps

- [ ] Change admin password after first login
- [ ] Document production URLs
- [ ] Set up monitoring (optional)
- [ ] Configure backups (MongoDB Atlas)
- [ ] Test all critical flows
- [ ] Share access with team (if applicable)

---

## Quick Reference

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Admin Credentials (Default)
- Email: `admin@bluefin.isp`
- Password: `B1ueF!n@2024#Secure$Admin`

### Production Seed Command
```bash
node backend/scripts/seedProduction.js
```

---

**Status**: Ready for deployment ✅

