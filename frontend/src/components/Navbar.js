import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

const Navbar = ({ isAdmin = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={isAdmin ? '/admin/dashboard' : '/plans'}
              className="text-2xl font-bold text-primary-600"
            >
              BlueFin ISP
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/plans"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Plans
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/payments"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Payments
                    </Link>
                    <Link
                      to="/admin/support"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Support
                    </Link>
                    <Link
                      to="/admin/contact"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Contact
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/plans"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Plans
                    </Link>
                    <Link
                      to="/speed-test"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Speed Test
                    </Link>
                    <Link
                      to="/support"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Support
                    </Link>
                    <Link
                      to="/usage"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Usage
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
                {!isAdmin && <Notifications />}
                <span className="text-gray-700 px-3 py-2 text-sm">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={isAdmin ? '/admin/login' : '/login'}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                {!isAdmin && (
                  <Link to="/register" className="btn-primary text-sm">
                    Sign Up
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

