'use client';

import { useState, useEffect } from 'react';
import { useStreamStore, Overlay } from '@/lib/store/streamStore';

export function useOverlays() {
  const { setOverlays, overlay } = useStreamStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch overlays from API
  const fetchOverlays = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/overlays');
      
      const contentType = response.headers.get('content-type');
      
      // Check if the response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        // If it's not JSON, it might be an HTML error page
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200) + '...');
        throw new Error('Server returned an invalid response format');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch overlays');
      }
      
      const data = await response.json();
      setOverlays(data);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching overlays:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new overlay
  const createOverlay = async (overlayData: Partial<Overlay>) => {
    setError(null);
    
    try {
      const response = await fetch('/api/overlays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(overlayData),
      });
      
      const contentType = response.headers.get('content-type');
      
      // Check if the response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        // If it's not JSON, it might be an HTML error page
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200) + '...');
        throw new Error('Server returned an invalid response format');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create overlay');
      }
      
      const data = await response.json();
      
      // Refresh the overlays list
      fetchOverlays();
      
      return data;
    } catch (err) {
      setError((err as Error).message);
      console.error('Error creating overlay:', err);
      return null;
    }
  };

  // Update an overlay
  const updateOverlayAPI = async (id: string, updates: Partial<Overlay>) => {
    setError(null);
    
    try {
      const response = await fetch(`/api/overlays/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const contentType = response.headers.get('content-type');
      
      // Check if the response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        // If it's not JSON, it might be an HTML error page
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200) + '...');
        throw new Error('Server returned an invalid response format');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update overlay');
      }
      
      const data = await response.json();
      
      // Refresh the overlays list
      fetchOverlays();
      
      return data;
    } catch (err) {
      setError((err as Error).message);
      console.error('Error updating overlay:', err);
      return null;
    }
  };

  // Delete an overlay
  const deleteOverlay = async (id: string) => {
    setError(null);
    
    try {
      const response = await fetch(`/api/overlays/${id}`, {
        method: 'DELETE',
      });
      
      const contentType = response.headers.get('content-type');
      
      // Check if the response is JSON or there is no content
      if (response.status !== 204 && (!contentType || !contentType.includes('application/json'))) {
        // If it's not JSON, it might be an HTML error page
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200) + '...');
        throw new Error('Server returned an invalid response format');
      }
      
      if (!response.ok) {
        // Only try to parse as JSON if there is a body
        if (response.status !== 204 && contentType?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete overlay');
        } else {
          throw new Error('Failed to delete overlay');
        }
      }
      
      // Refresh the overlays list
      fetchOverlays();
      
      return true;
    } catch (err) {
      setError((err as Error).message);
      console.error('Error deleting overlay:', err);
      return false;
    }
  };

  // Create a new text overlay with defaults
  const createTextOverlay = () => {
    const newTextOverlay = {
      name: `Text Overlay ${overlay.overlays.length + 1}`,
      type: 'text',
      content: 'New Text Overlay',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 80 },
      zIndex: overlay.overlays.length + 1,
      visible: true,
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'normal',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: 1,
        textAlign: 'center',
      },
    };
    
    return createOverlay(newTextOverlay as Partial<Overlay>);
  };

  // Create a new image overlay with defaults
  const createImageOverlay = () => {
    const newImageOverlay = {
      name: `Image Overlay ${overlay.overlays.length + 1}`,
      type: 'image',
      imageUrl: 'https://via.placeholder.com/200x150',
      alt: 'Sample image overlay',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 150 },
      zIndex: overlay.overlays.length + 1,
      visible: true,
      style: {
        opacity: 1,
        border: 'none',
        borderRadius: 0,
      },
    };
    
    return createOverlay(newImageOverlay as Partial<Overlay>);
  };

  // Initial fetch
  useEffect(() => {
    fetchOverlays();
  }, []);

  return {
    overlays: overlay.overlays,
    isLoading,
    error,
    fetchOverlays,
    createOverlay,
    updateOverlayAPI,
    deleteOverlay,
    createTextOverlay,
    createImageOverlay,
  };
}