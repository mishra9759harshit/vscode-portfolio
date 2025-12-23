import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/SkillsPage.module.css';

import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiDocker,
  SiKubernetes,
  SiArduino,
  SiEspressif,
  SiC,
  SiLinux,
  SiParrotsecurity,
  SiArchlinux,
  SiFedora,
  SiPycharm,
  SiJupyter,
  SiGooglecloud,
  SiMetasploit,
  SiAdobephotoshop,
  SiCoreldraw,
  SiCanva,
} from 'react-icons/si';
import {
  FaCogs,
  FaTools,
  FaTerminal,
  FaMicrochip,
  FaNetworkWired,
  FaShieldAlt,
  FaVideo,
  FaPodcast,
  FaPenNib,
  FaUserTie,
  FaPuzzlePiece,
  FaComments,
  FaLeaf,
  FaDatabase,
  FaChalkboardUser,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface Skill {
  name: string;
  iconComponent: IconType;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
  description: string;
}

export default function SkillsPage() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [githubLanguages, setGithubLanguages] = useState<
    { name: string; percentage: number; color: string }[]
  >([]);

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      Python: '#3776ab',
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      'C++': '#00599c',
      Java: '#007396',
      HTML: '#e34c26',
      CSS: '#563d7c',
      React: '#61dafb',
      Node: '#339933',
    };
    return colors[language] || '#858585';
  };

  const fetchGithubLanguages = useCallback(async () => {
    try {
      const response = await fetch('https://api.github.com/users/mishra9759harshit/repos');
      const repos = (await response.json()) as Array<{ language: string | null; size: number }>;

      const languageStats: { [key: string]: number } = {};
      let totalSize = 0;

      repos.forEach((repo) => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + repo.size;
          totalSize += repo.size;
        }
      });

      const languages = Object.entries(languageStats)
        .map(([name, size]) => ({
          name,
          percentage: Math.round(((size as number) / totalSize) * 100),
          color: getLanguageColor(name),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6);

      setGithubLanguages(languages);
    } catch {
      console.log('GitHub API fetch note: Update with your username');
    }
  }, []);

  useEffect(() => {
    fetchGithubLanguages();
  }, [fetchGithubLanguages]);

  const skillCategories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      description: 'Core programming languages for full-stack development',
      skills: [
        { name: 'Python', iconComponent: SiPython, level: 'advanced', category: 'Language' },
        { name: 'JavaScript', iconComponent: SiJavascript, level: 'expert', category: 'Language' },
        { name: 'TypeScript', iconComponent: SiTypescript, level: 'advanced', category: 'Language' },
        { name: 'C++', iconComponent: SiCplusplus, level: 'intermediate', category: 'Language' },
        { name: 'HTML', iconComponent: SiHtml5, level: 'expert', category: 'Language' },
        { name: 'CSS', iconComponent: SiCss3, level: 'advanced', category: 'Language' },
        { name: 'Node.js', iconComponent: SiNodedotjs, level: 'advanced', category: 'Runtime' },
      ],
    },
    {
      name: 'Frontend Frameworks & Libraries',
      description: 'Modern frontend technologies for building interactive UIs',
      skills: [
        { name: 'React.js', iconComponent: SiReact, level: 'expert', category: 'Framework' },
        { name: 'Next.js', iconComponent: SiNextdotjs, level: 'advanced', category: 'Framework' },
        { name: 'TailwindCSS', iconComponent: SiTailwindcss, level: 'advanced', category: 'CSS' },
        { name: 'Bootstrap', iconComponent: SiBootstrap, level: 'intermediate', category: 'CSS' },
        // Generic animation icon (no official Framer Motion logo in react-icons)
        { name: 'Framer Motion', iconComponent: FaCogs, level: 'advanced', category: 'Animation' },
      ],
    },
    {
      name: 'DevOps & Containerization',
      description: 'Container orchestration and deployment technologies',
      skills: [
        { name: 'Docker', iconComponent: SiDocker, level: 'intermediate', category: 'DevOps' },
        { name: 'Kubernetes', iconComponent: SiKubernetes, level: 'beginner', category: 'DevOps' },
        { name: 'CI/CD', iconComponent: FaTools, level: 'intermediate', category: 'DevOps' },
      ],
    },
    {
      name: 'Microcontrollers & IoT',
      description: 'Embedded systems and hardware programming',
      skills: [
        { name: 'Arduino', iconComponent: SiArduino, level: 'intermediate', category: 'Hardware' },
        { name: 'ESP32', iconComponent: SiEspressif, level: 'intermediate', category: 'Hardware' },
        { name: 'Embedded C', iconComponent: SiC, level: 'intermediate', category: 'Language' },
      ],
    },
    {
      name: 'Linux & Operating Systems',
      description: 'Various Linux distributions and OS administration',
      skills: [
        { name: 'Linux (General)', iconComponent: SiLinux, level: 'advanced', category: 'OS' },
        { name: 'Kali Linux', iconComponent: SiKali, level: 'advanced', category: 'OS' },
        { name: 'Parrot OS', iconComponent: SiParrotsecurity, level: 'advanced', category: 'OS' },
        { name: 'Arch Linux', iconComponent: SiArchlinux, level: 'intermediate', category: 'OS' },
        { name: 'Fedora OS', iconComponent: SiFedora, level: 'intermediate', category: 'OS' },
      ],
    },
    {
      name: 'Development Environments',
      description: 'Tools and IDEs for development and coding',
      skills: [
        { name: 'VS Code', iconComponent: SiVisualstudiocode, level: 'expert', category: 'IDE' },
        { name: 'PyCharm', iconComponent: SiPycharm, level: 'advanced', category: 'IDE' },
        { name: 'Geany', iconComponent: FaTerminal, level: 'intermediate', category: 'IDE' },
        { name: 'Jupyter Notebook', iconComponent: SiJupyter, level: 'advanced', category: 'IDE' },
        {
          name: 'Google Cloud Workspace',
          iconComponent: SiGooglecloud,
          level: 'intermediate',
          category: 'Cloud',
        },
      ],
    },
    {
      name: 'Cybersecurity & Linux Tools',
      description: 'Penetration testing, security, and system tools',
      skills: [
        { name: 'Metasploit', iconComponent: SiMetasploit, level: 'intermediate', category: 'Security' },
        { name: 'Nmap', iconComponent: FaNetworkWired, level: 'intermediate', category: 'Security' },
        { name: 'Hydra', iconComponent: FaNetworkWired, level: 'intermediate', category: 'Security' },
        { name: 'John the Ripper', iconComponent: FaShieldAlt, level: 'beginner', category: 'Security' },
        { name: 'SQL Injection Testing', iconComponent: FaDatabase, level: 'intermediate', category: 'Security' },
        { name: 'SEtoolkit', iconComponent: FaTools, level: 'beginner', category: 'Security' },
      ],
    },
    {
      name: 'Video Editing & Design',
      description: 'Multimedia content creation and editing tools',
      skills: [
        { name: 'Canva', iconComponent: SiCanva, level: 'advanced', category: 'Design' },
        { name: 'VSDC', iconComponent: FaVideo, level: 'advanced', category: 'Video' },
        {
          name: 'Photoshop',
          iconComponent: SiAdobephotoshop,
          level: 'intermediate',
          category: 'Design',
        },
        { name: 'CorelDraw', iconComponent: SiCoreldraw, level: 'intermediate', category: 'Design' },
      ],
    },
    {
      name: 'Personal & Soft Skills',
      description: 'Communication, creativity, and interpersonal abilities',
      skills: [
        { name: 'Video Editing', iconComponent: FaVideo, level: 'advanced', category: 'Creative' },
        { name: 'Podcast Recording', iconComponent: FaPodcast, level: 'advanced', category: 'Creative' },
        { name: 'Content Creation', iconComponent: FaPenNib, level: 'advanced', category: 'Creative' },
        { name: 'Narrating', iconComponent: FaMicrochip, level: 'advanced', category: 'Creative' },
        {
          name: 'Teaching',
          iconComponent: FaChalkboardUser,
          level: 'advanced',
          category: 'Soft Skills',
        },
        {
          name: 'Problem Solving',
          iconComponent: FaPuzzlePiece,
          level: 'expert',
          category: 'Soft Skills',
        },
        { name: 'Communication', iconComponent: FaComments, level: 'advanced', category: 'Soft Skills' },
        { name: 'Nature & Exploration', iconComponent: FaLeaf, level: 'advanced', category: 'Interest' },
      ],
    },
  ];

  const levelConfig: { [key: string]: { bg: string; text: string; width: string } } = {
    beginner: { bg: 'rgba(255, 193, 7, 0.2)', text: '#ffc107', width: '25%' },
    intermediate: { bg: 'rgba(33, 150, 243, 0.2)', text: '#2196f3', width: '50%' },
    advanced: { bg: 'rgba(76, 175, 80, 0.2)', text: '#4caf50', width: '75%' },
    expert: { bg: 'rgba(233, 30, 99, 0.2)', text: '#e91e63', width: '100%' },
  };

  return (
    <div className={styles.skillsPage}>
      <div className={styles.header}>
        <h1>Skills &amp; Expertise</h1>
        <p>Comprehensive toolkit of technologies, tools, and personal capabilities</p>
      </div>

      {githubLanguages.length > 0 && (
        <div className={styles.githubSection}>
          <h2>GitHub Language Distribution</h2>
          <div className={styles.languageChart}>
            {githubLanguages.map((lang) => (
              <div key={lang.name} className={styles.languageBar}>
                <div className={styles.languageLabel}>
                  <span className={styles.languageName}>{lang.name}</span>
                  <span className={styles.languagePercent}>{lang.percentage}%</span>
                </div>
                <div
                  className={styles.languageProgress}
                  style={{
                    background: lang.color,
                    width: `${lang.percentage}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.name}
          className={styles.skillCategory}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
          viewport={{ once: true }}
        >
          <div className={styles.categoryHeader}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>

          <div className={styles.skillsGrid}>
            {category.skills.map((skill, skillIndex) => (
              <motion.div
                key={skill.name}
                className={`${styles.skillCard} ${
                  hoveredSkill === skill.name ? styles.hovered : ''
                }`}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: categoryIndex * 0.1 + skillIndex * 0.05,
                }}
                whileHover={{ y: -8, scale: 1.05 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={styles.skillIcon}
                  animate={{
                    rotateZ: hoveredSkill === skill.name ? 10 : 0,
                    scale: hoveredSkill === skill.name ? 1.2 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <skill.iconComponent />
                </motion.div>

                <h3 className={styles.skillName}>{skill.name}</h3>

                <div className={styles.skillLevel}>
                  <div className={styles.levelLabel}>{skill.level}</div>
                  <div
                    className={styles.levelBar}
                    style={{
                      backgroundColor: levelConfig[skill.level].bg,
                    }}
                  >
                    <motion.div
                      className={styles.levelFill}
                      initial={{ width: 0 }}
                      whileInView={{
                        width: levelConfig[skill.level].width,
                      }}
                      transition={{
                        duration: 1,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      style={{
                        backgroundColor: levelConfig[skill.level].text,
                      }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className={styles.legendSection}>
        <h2>Skill Levels</h2>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#ffc107' }} />
            <span>Beginner - Basic knowledge and practical experience</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#2196f3' }} />
            <span>Intermediate - Good proficiency with regular usage</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#4caf50' }} />
            <span>Advanced - Strong expertise and problem-solving ability</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#e91e63' }} />
            <span>Expert - Master-level proficiency and teaching capability</span>
          </div>
        </div>
      </div>

      <div className={styles.philosophySection}>
        <h2>My Technical Philosophy</h2>
        <div className={styles.philosophyContent}>
          <p>
            I&apos;m driven by curiosity and a passion for continuous learning. My skill set reflects a
            diverse range of interests spanning from web development to cybersecurity, creative content
            production to system administration. I believe in:
          </p>
          <ul>
            <li>Building robust, scalable, and maintainable solutions</li>
            <li>Understanding security best practices in all aspects of development</li>
            <li>Sharing knowledge through teaching and mentoring</li>
            <li>Exploring new technologies and pushing technical boundaries</li>
            <li>Balancing technical excellence with creative expression</li>
            <li>Learning from nature and applying those lessons to problem-solving</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Skills' },
  };
}
