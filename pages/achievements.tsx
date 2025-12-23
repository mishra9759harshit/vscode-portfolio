import { useState } from 'react';
import { motion } from 'framer-motion';

import styles from '@/styles/AchievementsPage.module.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'certificate' | 'event' | 'award' | 'news';
  date: string;
  image?: string;
  downloadUrl?: string;
  articleUrl?: string;
}

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'certificate' | 'event' | 'award' | 'news'
  >('all');

  const achievements: Achievement[] = [
    // Events
    {
      id: 'sih-2025',
      title: 'Smart India Hackathon (SIH) 2025',
      description:
        'National Grand Finalist in Smart India Hackathon 2025. Developed an innovative solution addressing real-world problems.',
      category: 'event',
      date: '2025',
      image: '/event/sih-2025.jpg',
    },
    {
      id: 'tech-summit-2024',
      title: 'Tech Summit 2024',
      description:
        'Participated in annual tech summit showcasing innovative projects and networking with industry professionals.',
      category: 'event',
      date: '2024',
      image: '/event/tech-summit.jpg',
    },
    {
      id: 'hackathon-nationals-2024',
      title: 'National Hackathon Championships 2024',
      description:
        'Competed in national level hackathon with advanced web technologies. Team ranked in top 10.',
      category: 'event',
      date: '2024',
      image: '/event/hackathon-nationals.jpg',
    },
    {
      id: 'web-dev-expo-2024',
      title: 'Web Development Expo 2024',
      description:
        'Showcased full-stack web development projects and demonstrated modern development practices.',
      category: 'event',
      date: '2024',
      image: '/event/webdev-expo.jpg',
    },
    {
      id: 'ai-summit-2025',
      title: 'AI & Machine Learning Summit 2025',
      description:
        'Explored cutting-edge AI technologies and participated in hands-on ML workshops.',
      category: 'event',
      date: '2025',
      image: '/event/ai-summit.jpg',
    },

    // Certificates
    {
      id: 'sih-certificate',
      title: 'SIH Finalist Certificate',
      description:
        'Official certificate of participation and recognition as a Grand Finalist in SIH 2025.',
      category: 'certificate',
      date: '2025',
      image: '/certificates/sih-cert.jpg',
      downloadUrl: '/certificates/sih-certificate.pdf',
    },
    {
      id: 'mern-certificate',
      title: 'MERN Stack Developer Certification',
      description:
        'Completed comprehensive MERN stack development course covering MongoDB, Express, React, and Node.js.',
      category: 'certificate',
      date: '2024',
      image: '/certificates/mern-cert.jpg',
      downloadUrl: '/certificates/mern-certificate.pdf',
    },
    {
      id: 'web-design-cert',
      title: 'Advanced Web Design & Development',
      description:
        'Professional certification in responsive web design, CSS frameworks, and modern web standards.',
      category: 'certificate',
      date: '2024',
      image: '/certificates/webdesign-cert.jpg',
      downloadUrl: '/certificates/webdesign-certificate.pdf',
    },
    {
      id: 'linux-cert',
      title: 'Linux System Administration',
      description:
        'Certification in Linux system administration, security, and command-line proficiency.',
      category: 'certificate',
      date: '2024',
      image: '/certificates/linux-cert.jpg',
      downloadUrl: '/certificates/linux-certificate.pdf',
    },
    {
      id: 'cybersec-cert',
      title: 'Cybersecurity & Ethical Hacking Basics',
      description:
        'Introduction to cybersecurity concepts, penetration testing basics, and security best practices.',
      category: 'certificate',
      date: '2024',
      image: '/certificates/cybersec-cert.jpg',
      downloadUrl: '/certificates/cybersecurity-certificate.pdf',
    },

    // Awards
    {
      id: 'innovation-award-2025',
      title: 'Innovation Award 2025',
      description:
        'Recognized for exceptional innovation in full-stack web development and creative problem-solving.',
      category: 'award',
      date: '2025',
      image: '/awards/innovation-award.jpg',
    },
    {
      id: 'best-developer-award',
      title: 'Best Developer Award',
      description:
        'Awarded for outstanding coding practices, clean code architecture, and technical excellence.',
      category: 'award',
      date: '2024',
      image: '/awards/best-dev-award.jpg',
    },

    // News Articles
    {
      id: 'sih-news-coverage',
      title: 'Smart India Hackathon 2025 – Grand Finalist Feature',
      description:
        'Featured in national tech news for qualifying as a Grand Finalist in Smart India Hackathon 2025.',
      category: 'news',
      date: '2025',
      image: '/news/sih-news.jpg',
      articleUrl: 'https://example-tech-news.com/sih-2025',
    },
    {
      id: 'startup-interview',
      title: 'Young Developer Spotlight - Tech Industry Profile',
      description:
        'Interview featuring my journey in full-stack development and contributions to innovative tech projects.',
      category: 'news',
      date: '2024',
      image: '/news/startup-interview.jpg',
      articleUrl: 'https://example-startup-news.com/developer-profile',
    },
    {
      id: 'tech-contribution',
      title: 'Open Source Contributions Making Impact',
      description:
        'Coverage of significant contributions to open-source web development projects and community involvement.',
      category: 'news',
      date: '2024',
      image: '/news/opensource-coverage.jpg',
      articleUrl: 'https://example-dev-news.com/opensource-contributions',
    },
  ];

  const filteredAchievements =
    activeCategory === 'all'
      ? achievements
      : achievements.filter((item) => item.category === activeCategory);

  return (
    <div className={styles.achievementsPage}>
      <div className={styles.header}>
        <h1>Achievements & Certificates</h1>
        <p>A collection of my accomplishments, certifications, events, and media coverage</p>
      </div>

      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.active : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'certificate' ? styles.active : ''}`}
          onClick={() => setActiveCategory('certificate')}
        >
          Certificates
        </button>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'event' ? styles.active : ''}`}
          onClick={() => setActiveCategory('event')}
        >
          Events
        </button>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'award' ? styles.active : ''}`}
          onClick={() => setActiveCategory('award')}
        >
          Awards
        </button>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'news' ? styles.active : ''}`}
          onClick={() => setActiveCategory('news')}
        >
          News Articles
        </button>
      </div>

      <div className={styles.achievementsGrid}>
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`${styles.achievementCard} ${styles[achievement.category]}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
            viewport={{ once: true }}
          >
            {achievement.image && (
              <div className={styles.imageContainer}>
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.category}>{achievement.category}</span>
                <span className={styles.date}>{achievement.date}</span>
              </div>
              <h3 className={styles.title}>{achievement.title}</h3>
              <p className={styles.description}>{achievement.description}</p>

              {achievement.downloadUrl && (
                <a
                  href={achievement.downloadUrl}
                  className={styles.downloadBtn}
                  download
                >
                  📥 Download Certificate
                </a>
              )}

              {achievement.articleUrl && (
                <a
                  href={achievement.articleUrl}
                  className={styles.downloadBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📰 Read News Article
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className={styles.emptyState}>
          <p>No achievements found in this category yet.</p>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Achievements' },
  };
}
