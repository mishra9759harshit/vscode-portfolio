import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import Layout from '@/components/Layout';
import Head from '@/components/Head';
import ProfilePrompt from '@/components/ProfilePrompt';
import WelcomeOverlay from '@/components/WelcomeOverlay';

import '@/styles/globals.css';
import '@/styles/themes.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [profile, setProfile] = useState<{ name: string; avatar: string; platform: string; username: string } | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Check if user has already shared profile this session
    const hasSharedProfile = sessionStorage.getItem('profileShared');
    if (!hasSharedProfile) {
      // Show prompt after a short delay for better UX
      setTimeout(() => setShowPrompt(true), 500);
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
      <Head title={`Harshit Mishra| ${pageProps.title}`} />
      {showPrompt && <ProfilePrompt onComplete={handleProfileComplete} />}
      {showOverlay && profile && <WelcomeOverlay profile={profile} onClose={handleOverlayClose} />}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
