"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'responded';
  source: string;
}

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const fetchContacts = async (key: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setAuthenticated(true);
      } else if (response.status === 401) {
        setError('Invalid admin key');
        setAuthenticated(false);
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      fetchContacts(adminKey);
    }
  };

  const updateStatus = async (contactId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({ contactId, status })
      });

      if (response.ok) {
        // Refresh contacts
        fetchContacts(adminKey);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-black flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
              Admin Access
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Key
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-black dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter admin secret key"
                  required
                />
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Contact Submissions
          </h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
            <p className="mt-4 text-black dark:text-white">Loading contacts...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No contact submissions yet.</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <motion.div
                  key={contact._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        {contact.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {contact.phone}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={contact.status}
                        onChange={(e) => updateStatus(contact._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-700 text-black dark:text-white text-sm"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="responded">Responded</option>
                      </select>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'unread' ? 'bg-red-100 text-red-800' :
                        contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-black dark:text-white mb-2">Message:</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>Submitted: {formatDate(contact.submittedAt)}</span>
                    <span>Source: {contact.source}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactsPage; 