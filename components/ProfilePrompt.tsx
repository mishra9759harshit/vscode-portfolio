import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/ProfilePrompt.module.css';

type Props = {
  onComplete: (data: { name: string; avatar: string; platform: string; username: string } | null) => void;
};

const PLATFORM_ICONS = {
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <circle cx="17.5" cy="6.5" r="1.5"></circle>
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
};

export default function ProfilePrompt({ onComplete }: Props) {
  const [platform, setPlatform] = useState<string>('github');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    const name = username.trim();
    if (!name) return setError('Please enter a username');
    setLoading(true);
    try {
      const res = await fetch(`/api/profile?platform=${platform}&username=${encodeURIComponent(name)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to fetch profile');
      
      const profileData = { name: json.name || name, avatar: json.avatar || '', platform, username: name };
      
      // Send data to Formspree silently in background
      sendToFormspree(profileData);
      
      onComplete(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      setLoading(false);
    }
  }

  function sendToFormspree(profileData: { name: string; avatar: string; platform: string; username: string }) {
    // Create redirect URL to profile
    const profileUrl =
      profileData.platform === 'github'
        ? `https://github.com/${profileData.username}`
        : profileData.platform === 'instagram'
          ? `https://instagram.com/${profileData.username}`
          : `https://linkedin.com/in/${profileData.username}`;

    // Send silently without awaiting or showing errors
    fetch('https://formspree.io/f/xnjnaeyy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: profileData.username,
        name: profileData.name,
        platform: profileData.platform,
        profile_url: profileUrl,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silently ignore any errors
    });
  }

  // Auto-submit on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && username.trim() && !loading) {
      submit();
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="prompt-title">
      <form className={styles.modal} onSubmit={submit}>
        <div className={styles.header}>
          <h2 id="prompt-title">Welcome to My Portfolio!</h2>
          <p className={styles.subtitle}>Share your profile to see a special greeting</p>
        </div>

        <div className={styles.content}>
          <div className={styles.platformGroup}>
            <label htmlFor="platform" className={styles.label}>
              Choose Platform
            </label>
            <div className={styles.platformButtons}>
              {['github', 'instagram', 'linkedin'].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  className={`${styles.platformBtn} ${platform === plat ? styles.active : ''}`}
                  onClick={() => setPlatform(plat)}
                  title={`Connect via ${plat.charAt(0).toUpperCase() + plat.slice(1)}`}
                >
                  <span className={styles.icon}>{PLATFORM_ICONS[plat as keyof typeof PLATFORM_ICONS]}</span>
                  <span>{plat.charAt(0).toUpperCase() + plat.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Your Username
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>@</span>
              <input
                ref={inputRef}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your username"
                className={styles.input}
                disabled={loading}
                autoComplete="off"
              />
              {username && !loading && <span className={styles.checkmark}>✓</span>}
              {loading && <span className={styles.loadingSpinner}></span>}
            </div>
            <p className={styles.helper}>Press Enter or click Continue to fetch your profile</p>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Fetching...
              </>
            ) : (
              '✓ Continue to Celebrate →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

