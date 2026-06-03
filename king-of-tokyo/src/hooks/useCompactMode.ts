import { useState, useEffect } from 'react';

const STORAGE_KEY = 'king-of-tokyo-compact';

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
}

function loadCompact(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
  } catch {
    // ignore
  }
  return isMobile();
}

export function useCompactMode() {
  const [compact, setCompactState] = useState<boolean>(loadCompact);

  const setCompact = (value: boolean) => {
    setCompactState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore
    }
  };

  // On first mount, re-check in case matchMedia wasn't ready during SSR/hydration
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      setCompactState(isMobile());
    }
  }, []);

  return { compact, setCompact };
}
