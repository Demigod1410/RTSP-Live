'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Shuffle from './Shuffle';
import LightRays from './LightRays';
import FloatingTechIcons from './FloatingTechIcons';
import { useShuffleEffect } from '@/hooks/useShuffleEffect';

const HeroSection = ({ 
  title = 'LIVE STREAM',
  subtitle = 'Watch and customize your RTSP stream with interactive overlays',
  ctaText = 'Start Watching',
  ctaAction = () => {}
}) => {
  const { isAnimating, shouldAnimate, triggerAnimation } = useShuffleEffect(2500);
  const [raysColor] = useState('#2563eb'); // Initialize with fixed color, no need for setter

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background light rays */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor={raysColor}
          raysSpeed={isAnimating ? 1.2 : 0.7}
          lightSpread={isAnimating ? 1.5 : 1.2}
          rayLength={1.5}
          pulsating={true}
          fadeDistance={0.8}
          saturation={isAnimating ? 1.4 : 1.2}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.1}
          distortion={isAnimating ? 0.5 : 0.3}
          className="opacity-70"
        />
      </div>
      
      {/* Floating Tech Icons */}
      <FloatingTechIcons className="z-10 opacity-40" />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10"></div>
      
      {/* Animated tech lines */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-0 left-[10%] w-[1px] h-[30%] bg-gradient-to-b from-blue-500/0 via-blue-500/80 to-blue-500/0"
          animate={{ 
            height: ['20%', '40%', '20%'],
            opacity: [0.5, 0.8, 0.5], 
          }}
          transition={{ 
            duration: 7, 
            ease: 'easeInOut', 
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute top-[30%] right-[15%] w-[1px] h-[40%] bg-gradient-to-b from-indigo-500/0 via-indigo-500/80 to-indigo-500/0"
          animate={{ 
            height: ['30%', '50%', '30%'],
            opacity: [0.3, 0.7, 0.3], 
          }}
          transition={{ 
            duration: 9, 
            ease: 'easeInOut', 
            repeat: Infinity,
            delay: 1,
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center items-center text-center px-4">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Shuffle
            text={title}
            className="font-bold mb-6 md:text-[6rem] text-[4rem] tracking-tighter text-white drop-shadow-lg"
            duration={0.4}
            maxDelay={0.2}
            shuffleTimes={shouldAnimate ? 3 : 2}
            animationMode="evenodd"
            triggerOnHover={true}
            colorFrom="#ffffff"
            colorTo="#60a5fa"
            style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.7)' }}
            onShuffleComplete={() => {
              // No auto-triggering of animations to prevent flickering
            }}
          />
          
          <motion.p 
            className={`text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto transition-all duration-500 ${isAnimating ? 'text-blue-200' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => {
                triggerAnimation();
                ctaAction();
              }}
              className={`px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg
                        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
                        ${isAnimating ? 'bg-indigo-600 scale-105 shadow-lg shadow-indigo-500/30' : ''}`}
            >
              {ctaText}
            </button>
          </motion.div>
        </motion.div>
        
        {/* Tech graphics */}
        <div className="absolute -bottom-16 left-0 right-0 h-40 opacity-30">
          <div className={`absolute w-full h-full bg-gradient-to-t transition-colors duration-500 ${isAnimating ? 'from-indigo-600/40' : 'from-blue-600/40'} to-transparent`}></div>
          <div className="absolute w-full h-px top-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </div>
        
        {/* Stream Stats - keeping this as it's useful info but removed the animation */}
        <div className="absolute bottom-40 left-8 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg py-3 px-5 z-30">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            <div className="flex items-center gap-4">
              <span>1080p</span>
              <span>60fps</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c6.627 0 12-5.373 12-12S18.627 -2 12 -2 0 3.373 0 10s5.373 12 12 12zm0-3c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm-4.5-9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                2.8K viewers
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tech grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;