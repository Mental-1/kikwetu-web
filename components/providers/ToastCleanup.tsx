'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { showToast } from '@/utils/toast';

/**
 * Component that cleans up any lingering loading toasts on route changes
 * This prevents stuck loading toasts when navigation happens before
 * the toast can be dismissed
 */
export default function ToastCleanup() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    // Only clean up if the pathname has changed
    if (previousPathnameRef.current !== pathname) {
      // Dismiss all toasts when navigating to a new page
      // This ensures no loading toasts get stuck
      showToast.dismiss();
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  return null;
}

