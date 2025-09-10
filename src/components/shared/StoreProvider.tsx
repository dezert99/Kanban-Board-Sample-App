'use client';

import { useEffect, useState } from 'react';

interface StoreProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function StoreProvider({ children, fallback = null }: StoreProviderProps) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Simple hydration check - wait for next tick to ensure localStorage has been read
    const timer = setTimeout(() => {
      setHasHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}