import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from '@/styles/Tab.module.css';
import Tooltip from './Tooltip';

interface TabProps {
  icon: string;
  filename: string;
  path: string;
  description?: string;
}

const Tab = ({ icon, filename, path, description }: TabProps) => {
  const router = useRouter();

  const tabDescriptions: Record<string, string> = {
    '/': 'Home - Welcome to portfolio with introduction',
    '/about': 'About - Profile information and background',
    '/contact': 'Contact - Get in touch with me',
    '/projects': 'Projects - Featured work and recent projects',
    '/articles': 'Articles - Technical blog posts and articles',
    '/github': 'GitHub - Repository statistics and contributions',
    '/achievements': 'Achievements - Certificates and awards',
    '/skills': 'Skills - Technical expertise and tools',
    '/education': 'Education - Academic background and courses',
  };

  const desc = description || tabDescriptions[path] || filename;

  return (
    <Link href={path}>
      <Tooltip title={filename} description={desc} position="bottom">
        <div
          className={`${styles.tab} ${router.pathname === path && styles.active}`}
        >
          <Image src={icon} alt={filename} height={18} width={18} />
          <p>{filename}</p>
        </div>
      </Tooltip>
    </Link>
  );
};

export default Tab;
