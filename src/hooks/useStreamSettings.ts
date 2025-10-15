'use client';

import { useState, useEffect } from 'react';
import { useStreamStore } from '@/lib/store/streamStore';

export interface StreamSettings {
  rtspUrl: string;
  name: string;
  description?: string;
  autoPlay: boolean;
  showControls: boolean;
  defaultVolume: number;
}

export function useStreamSettings() {
  const { 
    setRtspUrl, 
    setIsPlaying, 
    setVolume, 
    stream 
  } = useStreamStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamName, setStreamName] = useState('Default Stream');
  const [streamDescription, setStreamDescription] = useState('');

  // Fetch stream settings
  const fetchStreamSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stream-settings');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch stream settings');
      }
      
      const data = await response.json();
      
      // Update store with settings
      setRtspUrl(data.rtspUrl);
      setIsPlaying(data.autoPlay);
      setVolume(data.defaultVolume);
      setStreamName(data.name);
      setStreamDescription(data.description || '');
      
      return data;
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching stream settings:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save stream settings
  const saveStreamSettings = async (settings: Partial<StreamSettings>) => {
    setError(null);
    
    try {
      const response = await fetch('/api/stream-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rtspUrl: settings.rtspUrl || stream.rtspUrl,
          name: settings.name || streamName,
          description: settings.description || streamDescription,
          autoPlay: settings.autoPlay !== undefined ? settings.autoPlay : true,
          showControls: settings.showControls !== undefined ? settings.showControls : true,
          defaultVolume: settings.defaultVolume !== undefined ? settings.defaultVolume : stream.volume,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save stream settings');
      }
      
      const data = await response.json();
      
      // Update local state
      if (settings.name) setStreamName(settings.name);
      if (settings.description !== undefined) setStreamDescription(settings.description || '');
      
      return data;
    } catch (err) {
      setError((err as Error).message);
      console.error('Error saving stream settings:', err);
      return null;
    }
  };

  // Save current stream settings
  const saveCurrentSettings = async () => {
    return saveStreamSettings({
      rtspUrl: stream.rtspUrl,
      name: streamName,
      description: streamDescription,
      autoPlay: stream.isPlaying,
      defaultVolume: stream.volume,
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchStreamSettings();
  }, []);

  return {
    streamName,
    streamDescription,
    setStreamName,
    setStreamDescription,
    isLoading,
    error,
    fetchStreamSettings,
    saveStreamSettings,
    saveCurrentSettings,
  };
}