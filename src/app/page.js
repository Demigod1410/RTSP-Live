'use client';

import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <HeroSection
        title="RTSP LIVE"
        subtitle="Watch and customize your live RTSP video stream with interactive overlays"
        ctaText="Start Streaming"
        ctaAction={() => router.push('/live')}
      />
    </div>
  );
}
