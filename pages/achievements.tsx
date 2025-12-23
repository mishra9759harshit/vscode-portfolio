import { useState } from 'react';
import Image from 'next/image';
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
      image: '/event/evaluation.jpg',
    },
    {
      id: 'Photoshot with HOD & Director-2025',
      title: 'Photoshot with Director & HOD 2025',
      description:
        'Photo shot with the Director and Head of Department during the Smart India Hackathon 2025 event.',
      category: 'event',
      date: '2025',
      image: '/event/img-with-director.jpg',
    },
    {
      id: 'Taking feedback from judges-2025',
      title: 'Taking feedback from judges 2025',
      description:
        'Competed in national level hackathon with advanced web technologies. Team ranked in top 10.',
      category: 'event',
      date: '2025',
      image: '/event/judges.jpg',
    },
    {
      id: 'I2IT Pune-2025',
      title: 'I2IT Pune 2025',
      description:
        'Attended the I2IT Pune event where I get a chance to meet many Respected CEOs, Directors, government officials from Higher Education and Defence Ministry.',
      category: 'event',
      date: '2025',
      image: '/event/Team_Nova_Minds.jpg',
    },
    {
      id: 'taking workshop At Bareilly College, Bareilly -2025',
      title: 'GitHub and Professional LinkedIn Profile Summit 2025',
      description:
        'I Get chance to Introduce Linkedin and GitHub to my Juniours.',
      category: 'event',
      date: '2025',
      image: '/event/clg1.jpg',
    },

    // Certificates
    {
      id: 'sih-certificate',
      title: 'SIH Finalist Certificate',
      description:
        'Official certificate of participation and recognition as a Grand Finalist in SIH 2025.',
      category: 'certificate',
      date: '2025',
      image: '/certificates/sih_cert.jpg',
      downloadUrl: '/certificates/SIH_Certificate_Harshit_Mishra.pdf',
    },
    {
      id: 'IBM Cybersecurity Cert',
      title: 'IBM Cybersecurity Certificate',
      description:
        'Certification in Cybersecurity Fundamentals from IBM, covering key concepts and practices in the field.',
      category: 'certificate',
      date: '2024',
      image: '/certificates/IBM.jpg',
      downloadUrl: '/certificates/IBM.jpg',
    },
    {
      id: 'Cybersecurity Job Simulation',
      title: 'Cybersecurity Job Simulation from Mastercard',
      description:
        'Cybersecurity Job Simulation certification from Mastercard, focusing on real-world security scenarios and solutions.',
      category: 'certificate',
      date: '2024',
      image: '/certificates/Visa.jpg',
      downloadUrl: '/certificates/Visa.jpg',
    },
    
    // {
    //   id: 'cybersec-cert',
    //   title: 'Cybersecurity & Ethical Hacking Basics',
    //   description:
    //     'Introduction to cybersecurity concepts, penetration testing basics, and security best practices.',
    //   category: 'certificate',
    //   date: '2024',
    //   image: '/certificates/cybersec-cert.jpg',
    //   downloadUrl: '/certificates/cybersecurity-certificate.pdf',
    // },

    // Awards
    {
      id: 'SIH Participation Award -2025',
      title: 'SIH Participation Award 2025',
      description:
        'It is My Honor to receive this certificate of participation in Smart India Hackathon 2025. From Priciple Of I2IT Pune, Vice Precident At Winjit technologies, AICTE Nodal Officer. with signatures of Pricniple of I2IT, SH. Veenit Joshi (Secetary Department of Higher Education, Ministry Of Education, Govt of India), Prof. T.G. Sitaram (Director, AICTE, Ministry of Education, Govt of India), and Dr. Abhay Jere (Vice Chairman AICTE, Cheif Innovation Officer).',
      category: 'award',
      date: '2025',
      image: '/awards/certification.jpg',
    },
    {
      id: 'Swags Award -2025',
      title: 'Swags Award From I2IT Pune -2025',
      description:
        'Received Swags from I2IT Pune on behalf of Smart India Hackathon 2025 Participation.',
      category: 'award',
      date: '2025',
      image: '/awards/Swags_.jpg',
    },

    // News Articles
    {
      id: 'sih-news-coverage',
      title: 'Smart India Hackathon 2025 – Grand Finalist Feature',
      description:
        'Featured in national tech news for qualifying as a Grand Finalist in Smart India Hackathon 2025.',
      category: 'news',
      date: '2025',
      image: '/articals/sih_artical.jpeg',
      articleUrl: 'https://example-tech-news.com/sih-2025',
    },
    {
      id: 'Created e-Learning Platform',
      title: 'Created e-Learning Platform for Students',
      description:
        'Coverage of the development and launch of an innovative e-learning platform aimed at enhancing student learning experiences. with Online Attendance System, Real-time Performance Analytics, Interactive Content, and Gamified Learning Modules.',
      category: 'news',
      date: '2024',
      image: '/articals/eCampus.jpg',
      articleUrl: 'https://example-startup-news.com/developer-profile',
    },
    // {
    //   id: 'tech-contribution',
    //   title: 'Open Source Contributions Making Impact',
    //   description:
    //     'Coverage of significant contributions to open-source web development projects and community involvement.',
    //   category: 'news',
    //   date: '2024',
    //   image: '/news/opensource-coverage.jpg',
    //   articleUrl: 'https://example-dev-news.com/opensource-contributions',
    // },
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
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  className={styles.image}
                  width={200}
                  height={200}
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
