// File: mental-health-app/app/checkins/[id]/page.js

import { CheckInDetail } from '@/app/components/CheckInDetail.jsx';

// The component itself must be an async function.
export default async function CheckInDetailPage({ params }) {
  // Await the params object before accessing its properties.
  const { id } = await params;
  return <CheckInDetail id={id} />;
}