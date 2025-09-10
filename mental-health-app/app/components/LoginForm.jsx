// File: mental-health-app/app/components/LoginForm.jsx

'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../lib/api';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(username, password);
      login(userData);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 text-center">Login</h2>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};