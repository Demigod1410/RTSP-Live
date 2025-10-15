'use client';

import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useStreamStore } from '@/lib/store/streamStore';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon 
} from '@heroicons/react/24/solid';

export default function VideoPlayer() {
  const playerRef = useRef<any>(null); // Using any for ReactPlayer ref
  const {
    stream,
    setIsPlaying,
    setVolume,
    toggleMute,
  } = useStreamStore();
  
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAttemptingToPlay, setIsAttemptingToPlay] = useState(false);
  
  // Handle RTSP stream through a proxy, as direct RTSP in browser isn't supported
  // This will require a backend proxy/conversion service (e.g., Node-Media-Server or a WebRTC gateway)
  // For now, we'll use the ReactPlayer component which supports some limited streaming formats
  
  // Effect to handle play state changes with error handling
  useEffect(() => {
    if (stream.isPlaying && playerRef.current && isPlayerReady) {
      setIsAttemptingToPlay(true);
      
      // Try to play with error handling
      const playPromise = playerRef.current.getInternalPlayer()?.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAttemptingToPlay(false);
          })
          .catch((error: any) => {
            console.error('Play error:', error);
            // If AbortError (play interrupted by pause), don't show user error
            if (error.name !== 'AbortError') {
              setError('Unable to play the video: ' + error.message);
            }
            setIsAttemptingToPlay(false);
            setIsPlaying(false);
          });
      }
    }
  }, [stream.isPlaying, isPlayerReady]);

  const handlePlay = () => {
    // Ensure we don't attempt to pause immediately after playing
    setTimeout(() => {
      setIsPlaying(true);
    }, 0);
  };

  const handlePause = () => {
    // Ensure we don't attempt to play immediately after pausing
    setTimeout(() => {
      setIsPlaying(false);
    }, 0);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleError = (e: any) => {
    console.error('Player error:', e);
    setError('Failed to load the video stream. Please check the URL and try again.');
  };

  const handleReady = () => {
    setIsPlayerReady(true);
    setError(null);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-900">
        {/* Video Player */}
        <div className="w-full h-full">
          {stream.rtspUrl ? (
            <ReactPlayer
              ref={playerRef}
              url={stream.rtspUrl}
              playing={stream.isPlaying && !isAttemptingToPlay}
              volume={stream.volume}
              muted={stream.isMuted}
              width="100%"
              height="100%"
              onPlay={handlePlay}
              onPause={handlePause}
              onError={handleError}
              onReady={handleReady}
              controls={false}
              playsinline={true}
              stopOnUnmount={false}
              // Add fallback options and playback rates
              fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading stream...</div>}
              // Using type assertion for the entire config object
              config={
                {
                  file: {
                    attributes: {
                      controlsList: 'nodownload'
                    },
                    forceVideo: true,
                    forceAudio: true
                  }
                } as any
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Please enter a valid RTSP URL</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-white text-center p-4 max-w-md">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 rounded-full hover:bg-white/20 transition"
                onClick={() => {
                  // Debounce the play/pause toggle to prevent rapid state changes
                  const newPlayState = !stream.isPlaying;
                  setTimeout(() => {
                    setIsPlaying(newPlayState);
                  }, 100);
                }}
                aria-label={stream.isPlaying ? 'Pause' : 'Play'}
              >
                {stream.isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  className="p-1 rounded-full hover:bg-white/20 transition"
                  onClick={toggleMute}
                  aria-label={stream.isMuted ? 'Unmute' : 'Mute'}
                >
                  {stream.isMuted || stream.volume === 0 ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={stream.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 accent-white"
                  aria-label="Volume"
                />
              </div>
            </div>

            <div className="text-sm">
              {isPlayerReady ? 'Stream Ready' : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
      
      {/* RTSP URL Input */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter RTSP stream URL"
            value={stream.customRtspUrl}
            onChange={(e) => useStreamStore.getState().setCustomRtspUrl(e.target.value)}
            className="flex-1 p-2 border rounded-md bg-white/5 text-white border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => useStreamStore.getState().applyCustomUrl()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Apply
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          For testing, you can use sample streams from rtsp.me or similar services
        </p>
      </div>
    </div>
  );
}