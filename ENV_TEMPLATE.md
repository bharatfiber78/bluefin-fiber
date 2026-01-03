# Environment Variables Template

## Backend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend Environment Variables
NODE_ENV=production
PORT=5000

# MongoDB Atlas Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bluefin_isp?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
# Use: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Admin Credentials
ADMIN_EMAIL=admin@bluefin.isp
ADMIN_PASSWORD=B1ueF!n@2024#Secure$Admin

# CORS Allowed Origins (comma-separated)
# For production, add your Vercel frontend URL
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com
```

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with:

```env
# Frontend Environment Variables
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## Generating Secure Secrets

### JWT Secret
```bash
openssl rand -base64 32
```

### Strong Password
Use a password manager or generate:
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Example: `B1ueF!n@2024#Secure$Admin`

