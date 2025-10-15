'use client';

import { useEffect, useState, useCallback } from 'react';

export const useShuffleEffect = (duration = 2000) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const triggerAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setShouldAnimate(true);
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setShouldAnimate(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isAnimating, duration]);

  return { isAnimating, shouldAnimate, triggerAnimation };
};