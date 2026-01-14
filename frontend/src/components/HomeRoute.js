import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://bluefin-6dzk.onrender.com/api';

const HomeRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserPlan = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setChecking(false);
    };

    if (!loading) {
      checkUserPlan();
    }
  }, [isAuthenticated, user, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If authenticated and has active plan, go to dashboard
  if (isAuthenticated && (userData?.activePlan?.status === 'active' || user?.activePlan?.status === 'active')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated but no active plan, go to plans
  if (isAuthenticated) {
    return <Navigate to="/plans" replace />;
  }

  // Not authenticated, go to plans
  return <Navigate to="/plans" replace />;
};

export default HomeRoute;


