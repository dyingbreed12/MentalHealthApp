// File: mental-health-app/app/lib/api.js

const API_BASE_URL = 'http://localhost:5062/api';
const USER_API_BASE_URL = `${API_BASE_URL}/User`;
const CHECKIN_API_BASE_URL = `${API_BASE_URL}/Checkin`;

export const loginUser = async (username, password) => {
  const res = await fetch(`${USER_API_BASE_URL}/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Login failed. Invalid username or password.');
  }
  return res.json();
};

export const logoutUser = async () => {
    const res = await fetch(`${USER_API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Send the cookie to be cleared
    });
    if (!res.ok) {
        throw new Error('Logout failed.');
    }
    return true;
};

export const fetchCheckIns = async (fromDate, toDate, pageNumber = 1, pageSize = 10) => {
  const params = new URLSearchParams();
  if (fromDate) params.append('from', fromDate);
  if (toDate) params.append('to', toDate);
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  const res = await fetch(`${CHECKIN_API_BASE_URL}?${params.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch check-ins.');
  }
  return res.json();
};

export const submitCheckIn = async (checkIn) => {
  const res = await fetch(`${CHECKIN_API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkIn),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to submit check-in.');
  }
  return res.json();
};

export const fetchCheckInById = async (id) => {
  const res = await fetch(`${CHECKIN_API_BASE_URL}/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch check-in details.');
  }
  return res.json();
};

export const updateCheckIn = async (checkInId, updatedCheckIn) => {
  const res = await fetch(`${CHECKIN_API_BASE_URL}/${checkInId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCheckIn),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to update check-in.');
  }

  if (res.status === 204) {
    return {};
  }
  return res.json();
};

export const updateMyCheckIn = async (checkInId, updatedCheckIn) => {
  const res = await fetch(`${CHECKIN_API_BASE_URL}/mycheckin/${checkInId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCheckIn),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to update check-in.');
  }

  if (res.status === 204) {
    return {};
  }
  return res.json();
};