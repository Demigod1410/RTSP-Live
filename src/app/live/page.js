'use client';

import dynamic from 'next/dynamic';

// Import static components
import OverlayContainer from '@/components/OverlayContainer';
import OverlayControls from '@/components/OverlayControls';

// Dynamic imports for client components
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false });
const OverlayEditor = dynamic(() => import('@/components/OverlayEditor'), { ssr: false });

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="pt-6 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-2">RTSP Stream Viewer</h1>
          <p className="text-gray-400 text-sm">
            Watch and customize your live RTSP video stream with overlays
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Video Player with Overlays */}
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <VideoPlayer />
              <OverlayContainer />
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Overlay Controls</h2>
              <OverlayControls />
            </div>
          </div>

          {/* Sidebar - Overlay Editor */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-3">Overlay Editor</h2>
            <OverlayEditor />
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} RTSP Stream Viewer | Built with Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}