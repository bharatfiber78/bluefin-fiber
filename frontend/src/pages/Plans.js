import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || 'https://bluefin-6dzk.onrender.com/api';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading plans..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-6xl font-bold gradient-text mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            High-speed internet plans tailored for your needs. Lightning-fast speeds, unlimited data, and 24/7 support.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📡</div>
            <p className="text-gray-600 text-xl">No plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan._id}
                className={`card hover:scale-105 transition-all duration-300 animate-fadeIn relative ${
                  index === 1 ? 'ring-4 ring-primary-500 shadow-2xl' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center pt-4">
                  <div className="inline-block bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    {plan.speed}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 min-h-[3rem]">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold gradient-text">₹{plan.price}</span>
                    <span className="text-gray-600 text-lg">/{plan.validity} days</span>
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <ul className="text-left mb-8 space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    to={`/plans/${plan._id}`}
                    className={`btn-primary w-full block text-center ${
                      index === 1
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 animate-pulse-glow'
                        : ''
                    }`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Plans;
