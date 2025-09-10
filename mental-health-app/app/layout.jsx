// File: mental-health-app/app/layout.jsx

import { AuthProvider } from '@/app/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Mental Health App',
  description: 'Check-in on your mental health.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}