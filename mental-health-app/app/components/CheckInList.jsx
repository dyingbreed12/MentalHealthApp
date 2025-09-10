// File: mental-health-app/app/components/CheckInList.jsx

'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchCheckIns, fetchMyCheckIns } from '../lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const CheckInList = () => {
  const { user } = useAuth();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [currentFilters, setCurrentFilters] = useState({ fromDate: '', toDate: '' });

  useEffect(() => {
    const today = new Date();
    // Adds 7 days to the current date.
    today.setDate(today.getDate() + 7);
    const last30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    setFromDate(last30Days.toISOString().slice(0, 10));
    setToDate(today.toISOString().slice(0, 10));
    setCurrentFilters({ fromDate: last30Days.toISOString().slice(0, 10), toDate: today.toISOString().slice(0, 10) });
  }, []);

  const fetcher = ([key, filters]) => {
      return fetchCheckIns(filters.fromDate, filters.toDate, filters.pageNumber, filters.pageSize);
  };
  
  // The SWR key is now unique for each user role, which prevents caching conflicts.
  const swrKey = user ? [`/api/checkins?userRole=${user.role}`, { pageNumber, pageSize, fromDate: currentFilters.fromDate, toDate: currentFilters.toDate, userRole: user.role }] : null;

  const { data: response, error, isLoading } = useSWR(swrKey, fetcher);

  const handleFilter = (e) => {
    e.preventDefault();
    setPageNumber(1);
    setCurrentFilters({ fromDate, toDate });
  };
  
  if (isLoading) return <div>Loading check-ins...</div>;
  if (error) return <div>Failed to load check-ins.</div>;

  const checkIns = response?.items || [];
  const totalPages = Math.ceil((response?.totalCount || 0) / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 w-full md:w-[700px] mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        {user?.role === 'manager' ? 'All Past Check-ins' : 'My Past Check-ins'}
      </h2>
      
      <form onSubmit={handleFilter} className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-end">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-900 mb-1">From Date:</label>
          <input
            type="date"
            id="from"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-900 mb-1">To Date:</label>
          <input
            type="date"
            id="to"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 w-full sm:w-auto"
        >
          Filter
        </button>
      </form>
      
      {checkIns.length > 0 ? (
        <ul className="space-y-4">
          {checkIns.map((checkIn) => (
            <li key={checkIn.id} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors cursor-pointer">
              <Link href={`/checkins/${checkIn.id}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Mood: {checkIn.mood} / 5</span>
                  <span className="text-sm text-gray-700">
                    {new Date(checkIn.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-900">{checkIn.notes}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center p-4 text-lg font-medium text-gray-700">No check-ins found.</div>
      )}
      
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-900">Page {pageNumber} of {totalPages}</span>
        <button
          onClick={() => setPageNumber(prev => prev + 1)}
          disabled={pageNumber >= totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};