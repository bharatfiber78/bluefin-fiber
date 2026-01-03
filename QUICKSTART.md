# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

## Setup Steps

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
Create `.env` file in root:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bluefin_isp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Seed Initial Data
```bash
npm run seed
```
This creates:
- Admin user: `admin@bluefin.com` / `admin123`
- Sample WiFi plans

### 4. Start Development Servers
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Access Points

### User Portal
- Register/Login: http://localhost:3000/login
- Browse Plans: http://localhost:3000/plans
- Dashboard: http://localhost:3000/dashboard

### Admin Portal
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard

**Admin Credentials:**
- Email: `admin@bluefin.com`
- Password: `admin123`

## Testing the Flow

1. **User Registration**: Register a new user account
2. **Browse Plans**: View available WiFi plans
3. **Select Plan**: Click on a plan to see details
4. **Apply for Plan**: Click "Apply for This Plan"
5. **Payment**: 
   - View UPI QR code (placeholder)
   - Upload payment screenshot
   - Submit payment
6. **Admin Verification**:
   - Login as admin
   - Go to Payments section
   - View payment screenshot
   - Approve/Reject payment
7. **User Dashboard**: Check payment status and active plan

## Notes

- Payment QR code is a placeholder - replace with actual UPI QR code image
- File uploads are stored in `backend/uploads/`
- All screenshots are validated (images only, max 5MB)

