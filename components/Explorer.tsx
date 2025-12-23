import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { VscChevronRight } from 'react-icons/vsc';

import styles from '@/styles/Explorer.module.css';
import Tooltip from './Tooltip';

const explorerItems = [
  {
    name: 'home.tsx',
    path: '/',
    icon: '/logos/react_icon.svg',
    description: 'Home page with introduction',
  },
  {
    name: 'about.html',
    path: '/about',
    icon: '/logos/html_icon.svg',
    description: 'Profile information and background',
  },
  {
    name: 'contact.css',
    path: '/contact',
    icon: '/logos/css_icon.svg',
    description: 'Contact form and information',
  },
  {
    name: 'projects.js',
    path: '/projects',
    icon: '/logos/postgresql-logo.svg',
    description: 'Featured work and recent projects',
  },
  {
    name: 'articles.json',
    path: '/articles',
    icon: '/logos/json_icon.svg',
    description: 'Technical blog posts and articles',
  },
  {
    name: 'github.md',
    path: '/github',
    icon: '/logos/markdown_icon.svg',
    description: 'Repository statistics and contributions',
  },
  {
    name: 'achievements.tsx',
    path: '/achievements',
    icon: '/logos/typescript-official-svgrepo-com.svg',
    description: 'Certificates and awards',
  },
  {
    name: 'skills.tsx',
    path: '/skills',
    icon: '/logos/docker-svgrepo-com.svg',
    description: 'Technical expertise and tools',
  },
  {
    name: 'education.tsx',
    path: '/education',
    icon: '/logos/react_icon.svg',
    description: 'Academic background and courses',
  },
];

const Explorer = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(true);

  return (
    <div className={styles.explorer}>
      <p className={styles.title}>Explorer</p>
      <div>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="portfolio-checkbox"
          checked={portfolioOpen}
          onChange={() => setPortfolioOpen(!portfolioOpen)}
          suppressHydrationWarning
        />
        <label htmlFor="portfolio-checkbox" className={styles.heading}>
          <VscChevronRight
            className={styles.chevron}
            style={portfolioOpen ? { transform: 'rotate(90deg)' } : {}}
          />
          Portfolio
        </label>
        <div
          className={styles.files}
          style={portfolioOpen ? { display: 'block' } : { display: 'none' }}
          suppressHydrationWarning
        >
          {explorerItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <Tooltip title={item.name} description={item.description} position="right">
                <div className={styles.file}>
                  <Image src={item.icon} alt={item.name} height={18} width={18} />{' '}
                  <p>{item.name}</p>
                </div>
              </Tooltip>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
