// File: mental-health-app/app/components/MainContent.jsx

'use client';

import { useState } from 'react';
import { CheckInForm } from '@/app/components/CheckInForm.jsx';
import { CheckInList } from '@/app/components/CheckInList.jsx';
import { LoginForm } from '@/app/components/LoginForm.jsx';
import { useAuth } from '@/app/context/AuthContext.jsx';
import { logoutUser } from '@/app/lib/api';

export default function MainContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, loading, logout } = useAuth();

  const handleCheckInSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Adjusted layout to align title and logout button to the left */}
        <div className="flex flex-col items-start justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Mental Health Check-in
          </h1>
          {user && (
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-gray-600">Logged in as: <span className="font-bold">{user.role}</span></span>
              <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                  Logout
              </button>
            </div>
          )}
        </div>
        
        {user ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <CheckInForm onCheckInSubmitted={handleCheckInSubmitted} />
            </div>
            <div>
              <CheckInList key={refreshKey} />
            </div>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}