import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || 'https://bluefin-6dzk.onrender.com/api';

const AdminContact = () => {
  const [contactInfo, setContactInfo] = useState({
    companyName: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    businessHours: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/contact`);
      setContactInfo({
        ...response.data,
        socialMedia: response.data.socialMedia || {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
        },
      });
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const socialKey = name.split('.')[1];
      setContactInfo({
        ...contactInfo,
        socialMedia: {
          ...contactInfo.socialMedia,
          [socialKey]: value,
        },
      });
    } else {
      setContactInfo({ ...contactInfo, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`${API_URL}/contact`, contactInfo);
      setToast({ message: 'Contact information updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update contact information', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar isAdmin={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading contact information..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar isAdmin={true} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mb-8 animate-fadeIn">
          <h1 className="text-5xl font-bold gradient-text mb-2">Manage Contact Information</h1>
          <p className="text-gray-600 text-lg">Update contact details shown on the website</p>
        </div>

        <form onSubmit={handleSubmit} className="card animate-slideIn">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={contactInfo.companyName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={contactInfo.address}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={contactInfo.website}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Hours
                </label>
                <input
                  type="text"
                  name="businessHours"
                  value={contactInfo.businessHours}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 24/7 or Mon-Fri 9AM-5PM"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="socialMedia.facebook"
                    value={contactInfo.socialMedia.facebook}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Facebook URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="socialMedia.twitter"
                    value={contactInfo.socialMedia.twitter}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Twitter URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="socialMedia.instagram"
                    value={contactInfo.socialMedia.instagram}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Instagram URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    name="socialMedia.linkedin"
                    value={contactInfo.socialMedia.linkedin}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContact;



