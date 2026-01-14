import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'https://bluefin-6dzk.onrender.com/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`);
      setStats(response.data.stats);
      setRecentPayments(response.data.recentPayments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Navbar isAdmin={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navbar isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Users</h3>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">Active Users</h3>
            <p className="text-3xl font-bold">{stats?.activeUsers || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">Pending Payments</h3>
            <p className="text-3xl font-bold">{stats?.pendingPayments || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Plans</h3>
            <p className="text-3xl font-bold">{stats?.totalPlans || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">Open Tickets</h3>
            <p className="text-3xl font-bold">{stats?.openTickets || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">Urgent Tickets</h3>
            <p className="text-3xl font-bold">{stats?.urgentTickets || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/plans" className="card hover:scale-105 transition-transform duration-200 text-center">
            <div className="text-4xl mb-2">📦</div>
            <h3 className="text-lg font-semibold text-gray-800">Manage Plans</h3>
            <p className="text-sm text-gray-600">Create, edit, or delete plans</p>
          </Link>
          <Link to="/admin/users" className="card hover:scale-105 transition-transform duration-200 text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-800">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage all users</p>
          </Link>
          <Link to="/admin/payments" className="card hover:scale-105 transition-transform duration-200 text-center">
            <div className="text-4xl mb-2">💳</div>
            <h3 className="text-lg font-semibold text-gray-800">Verify Payments</h3>
            <p className="text-sm text-gray-600">Review and approve payments</p>
          </Link>
          <Link to="/admin/support" className="card hover:scale-105 transition-transform duration-200 text-center">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="text-lg font-semibold text-gray-800">Support Tickets</h3>
            <p className="text-sm text-gray-600">
              {stats?.openTickets || 0} open, {stats?.urgentTickets || 0} urgent
            </p>
          </Link>
          <Link to="/admin/contact" className="card hover:scale-105 transition-transform duration-200 text-center">
            <div className="text-4xl mb-2">📞</div>
            <h3 className="text-lg font-semibold text-gray-800">Contact Info</h3>
            <p className="text-sm text-gray-600">Manage contact details</p>
          </Link>
        </div>

        {/* Recent Payments */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Payments</h2>
          {recentPayments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No recent payments</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.userId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.userId?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.planId?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{payment.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

