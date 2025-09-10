// File: mental-health-app/app/components/CheckInForm.jsx

'use client';

import { useState } from 'react';
import { submitCheckIn } from '../lib/api';

export const CheckInForm = ({ onCheckInSubmitted }) => {
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitCheckIn({ mood, notes });
      setNotes('');
      setMood(3);
      onCheckInSubmitted();
    } catch (err) {
      setError('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">How are you feeling today?</h2>
      <div className="mb-4">
        <label htmlFor="mood" className="block text-sm font-medium text-gray-900 mb-2">Mood (1-5):</label>
        <input
          type="number"
          id="mood"
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          min="1"
          max="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-900"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">Notes (Optional):</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-900"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Check-in'}
      </button>
    </form>
  );
};