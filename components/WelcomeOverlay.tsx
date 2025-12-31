import React, { useState, useEffect } from 'react';
import styles from '@/styles/WelcomeOverlay.module.css';

type Props = {
  profile: { name: string; avatar: string; platform: string; username: string };
  onClose: () => void;
};

const POETICAL_QUOTES = [
  {
    message: 'नया साल, नई उमीदें! आपके सपनों का साल हो यह।',
    translation: 'New year, new hopes! May this be your year of dreams.',
  },
  {
    message: 'जय हिंद! नए साल में सफलता के नए शिखर पाएं।',
    translation: 'Jai Hind! Reach new peaks of success this year.',
  },
  {
    message: 'नए दिन, नई शुरुआत, अनंत संभावनाएं!',
    translation: 'New day, new beginning, infinite possibilities!',
  },
  {
    message: 'आपकी मेहनत को मुकाम मिले इस साल!',
    translation: 'May your hard work reach its destination this year!',
  },
  {
    message: 'नए साल में खुशियों की बहार हो आपके जीवन में।',
    translation: 'May this new year bring endless joy to your life.',
  },
  {
    message: 'हर नए दिन एक नया अध्याय, हर नया साल एक नई किताब।',
    translation: 'Every new day is a new chapter, every new year a new story.',
  },
  {
    message: 'चांद और तारों की तरह बुलंद हों आपके लक्ष्य।',
    translation: 'May your goals reach as high as the moon and stars.',
  },
  {
    message: 'खुशियों के रंगों में रंगा हो आपका नया साल।',
    translation: 'May your new year be painted in colors of happiness.',
  },
  {
    message: 'जीवन का हर पल हो अमूल्य, हर क्षण हो खास।',
    translation: 'May every moment of your life be precious and special.',
  },
  {
    message: 'सफलता की ऊंचाइयों पर पहुंचें, हर दिन नई बुलंदियों को छुएं।',
    translation: 'Reach the heights of success, touch new horizons every day.',
  },
  {
    message: 'आपकी यात्रा हो रोशन, आपका रास्ता हो सुखी।',
    translation: 'May your journey be bright, your path be happy.',
  },
  {
    message: 'नए साल की सुबह में छिपी हैं अनगिनत संभावनाएं।',
    translation: 'In the dawn of the new year lie infinite possibilities.',
  },
];

// Default fallback images for each platform
const PLATFORM_FALLBACK_IMAGES = {
  github: 'https://avatars.githubusercontent.com/u/1?v=4',
  instagram: 'https://img.freepik.com/free-vector/golden-happy-new-year-background_1262-6471.jpg?semt=ais_hybrid',
  linkedin: 'https://img.freepik.com/free-vector/golden-happy-new-year-background_1262-6471.jpg?semt=ais_hybrid',
};

export default function WelcomeOverlay({ profile, onClose }: Props) {
  const year = new Date().getFullYear();
  const quote = POETICAL_QUOTES[Math.floor(Math.random() * POETICAL_QUOTES.length)];
  
  const [imageUrl, setImageUrl] = useState(profile.avatar || '');
  const [imageLoading, setImageLoading] = useState(!!profile.avatar);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset state when avatar changes
    if (profile.avatar) {
      setImageUrl(profile.avatar);
      setImageLoading(true);
      setImageError(false);
    }
  }, [profile.avatar]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    
    // Try fallback image for the specific platform
    const fallbackUrl = PLATFORM_FALLBACK_IMAGES[profile.platform as keyof typeof PLATFORM_FALLBACK_IMAGES];
    if (fallbackUrl && imageUrl !== fallbackUrl) {
      setImageUrl(fallbackUrl);
      setImageLoading(true);
    } else {
      // Use generic celebration image if platform-specific fallback fails
      setImageUrl('https://img.freepik.com/free-vector/golden-happy-new-year-background_1262-6471.jpg?semt=ais_hybrid');
    }
  };

  // Determine which image to show
  const displayImageUrl = imageError 
    ? PLATFORM_FALLBACK_IMAGES[profile.platform as keyof typeof PLATFORM_FALLBACK_IMAGES] || 'https://img.freepik.com/free-vector/golden-happy-new-year-background_1262-6471.jpg?semt=ais_hybrid'
    : imageUrl;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          <div className={styles.imageWrapper}>
            {imageLoading && <div className={styles.imageLoader} />}
            <img
              className={styles.avatar}
              src={displayImageUrl}
              alt={profile.name}
              loading="eager"
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className={styles.avatarRing} />
        </div>

        <div className={styles.content}>
          <h1 className={styles.greeting}>Happy New Year {year}! 🎉</h1>
          <p className={styles.name}>{profile.name}</p>
          <p className={styles.username}>
            @{profile.username} <span className={styles.badge}>{profile.platform}</span>
          </p>
          
          <div className={styles.quoteBox}>
            <p className={styles.quote}>{quote.message}</p>
            <p className={styles.translation}>{quote.translation}</p>
          </div>
          
          <div className={styles.signature}>
            <p className={styles.signatureText}>With warm wishes,</p>
            <p className={styles.portfolioOwner}>— Harshit Mishra</p>
          </div>
        </div>

        <button className={styles.close} onClick={onClose}>
          Continue →
        </button>
      </div>

      {/* Balloons */}
      <div className={styles.balloons} aria-hidden>
        <span className={`${styles.balloon} ${styles.balloon1}`} />
        <span className={`${styles.balloon} ${styles.balloon2}`} />
        <span className={`${styles.balloon} ${styles.balloon3}`} />
        <span className={`${styles.balloon} ${styles.balloon4}`} />
        <span className={`${styles.balloon} ${styles.balloon5}`} />
      </div>

      {/* Confetti */}
      <div className={styles.confetti} aria-hidden>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className={`${styles.piece} ${styles[`piece${i % 4}`]}`} />
        ))}
      </div>

      {/* Streamers */}
      <div className={styles.streamers} aria-hidden>
        <div className={styles.streamer} />
        <div className={styles.streamer} />
        <div className={styles.streamer} />
        <div className={styles.streamer} />
      </div>
    </div>
  );
}
