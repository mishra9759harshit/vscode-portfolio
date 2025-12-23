import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  VscSettings,
  VscMail,
  VscGithubAlt,
  VscCode,
  VscFiles,
  VscEdit,
  VscBook,
  VscSymbolMethod,
  VscLibrary,
  VscTerminal,
} from 'react-icons/vsc';
import { SiDocker, SiArduino } from 'react-icons/si';

import styles from '@/styles/Sidebar.module.css';
import Tooltip from './Tooltip';

const sidebarTopItems = [
  { Icon: VscFiles, path: '/', label: 'Home', description: 'Welcome to my portfolio. View introduction and quick links.' },
  { Icon: VscGithubAlt, path: '/github', label: 'GitHub', description: 'Browse my GitHub repositories and programming statistics.' },
  { Icon: VscCode, path: '/projects', label: 'Projects', description: 'Explore my featured projects and recent work.' },
  { Icon: VscEdit, path: '/articles', label: 'Articles', description: 'Read my technical blog posts and articles.' },
  { Icon: VscBook, path: '/achievements', label: 'Achievements', description: 'View my achievements, awards, and certificates.' },
  { Icon: VscSymbolMethod, path: '/skills', label: 'Skills', description: 'See my technical skills and expertise.' },
  { Icon: VscLibrary, path: '/education', label: 'Education', description: 'View my educational background and qualifications.' },
  { Icon: VscMail, path: '/contact', label: 'Contact', description: 'Get in touch with me. Contact form and information.' },
];

const sidebarBottomItems = [
  { path: '/about', isProfileImage: true, label: 'Profile', description: 'View my profile and about me.' },
  { Icon: VscSettings, path: '/settings', label: 'Settings', description: 'Customize portfolio appearance and preferences.' },
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path, label, description }) => (
          <Tooltip key={path} title={label} description={description} position="right">
            <Link href={path}>
              <div
                className={`${styles.iconContainer} ${
                  router.pathname === path && styles.active
                }`}
              >
                <Icon
                  size={16}
                  fill={
                    router.pathname === path
                      ? 'rgb(225, 228, 232)'
                      : 'rgb(106, 115, 125)'
                  }
                  className={styles.icon}
                />
              </div>
            </Link>
          </Tooltip>
        ))}
      </div>
      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map((item) => {
          const IconComponent = item.Icon;
          return (
            <Tooltip key={item.path} title={item.label} description={item.description} position="right">
              <div className={styles.iconContainer}>
                {item.isProfileImage ? (
                  <Link href="/about">
                    <Image
                      src="/profile/profile.jpg"
                      alt="Profile"
                      className={`${styles.profileImage} ${
                        router.pathname === '/about' ? styles.activeProfile : ''
                      }`}
                      width={48}
                      height={48}
                    />
                  </Link>
                ) : (
                  <Link href={item.path}>
                    {IconComponent && (
                      <IconComponent
                        fill={
                          router.pathname === item.path
                            ? 'rgb(225, 228, 232)'
                            : 'rgb(106, 115, 125)'
                        }
                        className={styles.icon}
                      />
                    )}
                  </Link>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
