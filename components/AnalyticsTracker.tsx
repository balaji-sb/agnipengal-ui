'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import { useAuth } from '@/lib/context/AuthContext';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Track entry time for the current page
  const entryTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Page View Tracking
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: pathname,
        page_title: document.title,
        screen_name: pathname,
      });
    }
    
    // Reset entry time on mount/route change
    entryTimeRef.current = Date.now();

    const handleExit = () => {
      const exitTime = Date.now();
      const duration = exitTime - entryTimeRef.current;
      
      if (analytics) {
        logEvent(analytics, 'screen_session', {
          screen_name: pathname,
          entry_time: new Date(entryTimeRef.current).toISOString(),
          exit_time: new Date(exitTime).toISOString(),
          duration_ms: duration,
          username: user?.name || 'guest',
          user_role: user?.role || 'visitor',
        });
      }
    };

    // Capture exit when component unmounts (route change)
    return () => {
      handleExit();
    };
  }, [pathname, searchParams, user]); 

  return null;
}
