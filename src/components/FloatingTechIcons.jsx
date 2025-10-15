'use client';

import { useState, useEffect } from 'react';

const FloatingTechIcons = ({ className = '' }) => {
  const [animatedIcons, setAnimatedIcons] = useState([]);
  
  useEffect(() => {
    // Generate random tech icons with random positions and animation delays
    const icons = [
      { icon: '⚡', delay: 0, size: 'text-4xl' },
      { icon: '🎬', delay: 2, size: 'text-3xl' },
      { icon: '📹', delay: 1, size: 'text-2xl' },
      { icon: '📱', delay: 3, size: 'text-xl' },
      { icon: '🎮', delay: 2, size: 'text-2xl' },
      { icon: '🔊', delay: 1, size: 'text-xl' },
      { icon: '📺', delay: 0.5, size: 'text-3xl' },
      { icon: '🖥️', delay: 1.5, size: 'text-2xl' },
    ].map((item, index) => ({
      ...item,
      id: `icon-${index}`,
      x: Math.random() * 80 + 10, // 10-90% of width
      y: Math.random() * 80 + 10, // 10-90% of height
      animationDelay: `${item.delay}s`,
    }));
    
    setAnimatedIcons(icons);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {animatedIcons.map(icon => (
        <div 
          key={icon.id}
          className={`absolute ${icon.size} opacity-30 animate-float`}
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDelay: icon.animationDelay,
          }}
        >
          {icon.icon}
        </div>
      ))}
    </div>
  );
};

export default FloatingTechIcons;