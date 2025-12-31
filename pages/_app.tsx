import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import Layout from '@/components/Layout';
import Head from '@/components/Head';
import ProfilePrompt from '@/components/ProfilePrompt';
import WelcomeOverlay from '@/components/WelcomeOverlay';

import '@/styles/globals.css';
import '@/styles/themes.css';

// Helper function to check if we're in the New Year celebration period (Jan 1-7)
function isNewYearPeriod(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const date = now.getDate();
  return month === 0 && date <= 7; // January (0-indexed) and first 7 days
}

function MyApp({ Component, pageProps }: AppProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [profile, setProfile] = useState<{ name: string; avatar: string; platform: string; username: string } | null>(null);
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Determine if it's New Year period
    const newYearActive = isNewYearPeriod();
    setIsNewYear(newYearActive);

    // Check if user has already shared profile this session
    const hasSharedProfile = sessionStorage.getItem('profileShared');
    if (!hasSharedProfile) {
      // Show prompt after a short delay for better UX
      // During New Year period, show with a festive greeting
      const delay = newYearActive ? 800 : 500;
      setTimeout(() => setShowPrompt(true), delay);
    }
  }, []);

  const handleProfileComplete = (data: { name: string; avatar: string; platform: string; username: string } | null) => {
    setShowPrompt(false);
    if (data) {
      setProfile(data);
      setShowOverlay(true);
      sessionStorage.setItem('profileShared', 'true');
    }
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  return (
    <Layout>
      <Head title={`Harshit Mishra| ${pageProps.title}`} isNewYearPeriod={isNewYear} />
      {showPrompt && <ProfilePrompt onComplete={handleProfileComplete} />}
      {showOverlay && profile && <WelcomeOverlay profile={profile} onClose={handleOverlayClose} />}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
