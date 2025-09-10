// File: mental-health-app/app/components/CheckInDetail.jsx

'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { fetchCheckInById, updateCheckIn, updateMyCheckIn } from '../lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const CheckInDetail = ({ id }) => {
  const { data: checkIn, error, isLoading, mutate } = useSWR(id ? `/api/Checkin/${id}` : null, () =>
    fetchCheckInById(parseInt(id))
  );

  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [mood, setMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (checkIn && mood === null) {
    setMood(checkIn.mood);
    setNotes(checkIn.notes);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedCheckIn = { ...checkIn, mood: mood, notes: notes };
      
      if (user.role === 'manager') {
          await updateCheckIn(checkIn.id, updatedCheckIn);
      } else if (user.role === 'employee') {
          await updateMyCheckIn(checkIn.id, updatedCheckIn);
      } else {
          throw new Error('Unauthorized action.');
      }

      mutate();
      setIsEditing(false);
    } catch (err) {
      setUpdateError('Failed to update check-in. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const canEdit = user && (user.role === 'manager' || (user.role === 'employee' && user.id === checkIn?.userId));

  if (isLoading) return <div className="text-center p-8">Loading check-in details...</div>;
  if (error || !checkIn) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-xl mx-auto w-full p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Check-in Details</h1>
        
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-gray-900 mb-2">Mood (1-5):</label>
              <input
                type="number"
                id="mood"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                min="1"
                max="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">Notes:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
              />
            </div>
            {updateError && <p className="text-red-500 text-sm mb-4">{updateError}</p>}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-400"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-gray-900">
            <p className="text-lg font-semibold">Mood: <span className="text-gray-900">{checkIn.mood} / 5</span></p>
            <p>Notes: <span className="text-gray-900">{checkIn.notes}</span></p>
            <p className="text-sm text-gray-700">Submitted on: {new Date(checkIn.timestamp).toLocaleDateString()}</p>
            <p className="text-sm text-gray-700">User ID: {checkIn.userId}</p>

            {canEdit && (
                <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                >
                Edit Check-in
                </button>
            )}
            <Link href="/" className="mt-4 block">
              <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors">
                &larr; Back to Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};