# BlueFin ISP - WiFi/Internet Service Provider Management System

A modern, full-stack web application for managing WiFi/ISP services, inspired by Airtel and Excitel. Built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User registration and authentication
- Browse available WiFi plans
- View detailed plan information
- Apply for plans
- Payment submission via UPI QR code and screenshot upload
- Dashboard with active plan and payment history
- Real-time payment status tracking

### Admin Features
- Admin authentication
- Dashboard with statistics
- Manage WiFi plans (Create, Read, Update, Delete)
- View and manage users
- Verify payment submissions
- Approve or reject payments
- Activate plans after payment approval

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## Project Structure

```
bluefin/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # Payment screenshots
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   │   └── admin/   # Admin pages
│   │   └── App.js       # Main app component
│   └── public/
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bluefin_isp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

3. Start the backend server:
```bash
npm run server
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Running Both Servers

From the root directory:
```bash
npm run dev
```

This runs both backend and frontend concurrently.

## Creating Admin User

To create an admin user, you can use MongoDB shell or a tool like MongoDB Compass:

```javascript
use bluefin_isp
db.users.insertOne({
  name: "Admin",
  email: "admin@bluefin.com",
  password: "$2a$10$...", // Use bcrypt to hash password
  phone: "1234567890",
  address: "Admin Address",
  role: "admin"
})
```

Or use the registration endpoint and manually update the role in the database.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Plans
- `GET /api/plans` - Get all active plans
- `GET /api/plans/:id` - Get single plan

### Payments
- `POST /api/payments/submit` - Submit payment (protected)
- `GET /api/payments/history` - Get payment history (protected)
- `GET /api/payments/:id` - Get single payment (protected)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get user details (admin only)
- `GET /api/admin/plans` - Get all plans (admin only)
- `POST /api/admin/plans` - Create plan (admin only)
- `PUT /api/admin/plans/:id` - Update plan (admin only)
- `DELETE /api/admin/plans/:id` - Delete plan (admin only)
- `GET /api/admin/payments` - Get all payments (admin only)
- `PUT /api/admin/payments/:id/verify` - Verify payment (admin only)

## Sample Data

You can add sample plans through the admin panel or directly in MongoDB:

```javascript
db.plans.insertMany([
  {
    name: "Basic Plan",
    description: "Perfect for light users",
    speed: "50 Mbps",
    validity: 30,
    price: 499,
    features: ["Unlimited data", "24/7 support", "Free installation"],
    isActive: true
  },
  {
    name: "Premium Plan",
    description: "For heavy users and families",
    speed: "100 Mbps",
    validity: 30,
    price: 799,
    features: ["Unlimited data", "Priority support", "Free router"],
    isActive: true
  }
])
```

## Features Highlights

- **Modern UI/UX**: Clean, professional design with smooth transitions
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Secure Authentication**: JWT-based authentication with password hashing
- **File Upload**: Payment screenshot upload with validation
- **Real-time Status**: Payment status updates in real-time
- **Admin Dashboard**: Comprehensive admin panel with statistics

## Development Notes

- The payment QR code is currently a placeholder. Replace with actual UPI QR code image.
- File uploads are stored in `backend/uploads/` directory
- All API routes are protected with authentication middleware
- Admin routes require admin role verification

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

