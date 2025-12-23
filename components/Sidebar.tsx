import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Github,
  Code,
  BookOpen,
  Award,
  Zap,
  GraduationCap,
  Mail,
  Settings,
} from 'lucide-react';

import styles from '@/styles/Sidebar.module.css';

const sidebarTopItems = [
  { Icon: Home, path: '/', label: 'Home' },
  { Icon: Github, path: '/github', label: 'GitHub' },
  { Icon: Code, path: '/projects', label: 'Projects' },
  { Icon: BookOpen, path: '/articles', label: 'Articles' },
  { Icon: Award, path: '/achievements', label: 'Achievements' },
  { Icon: Zap, path: '/skills', label: 'Skills' },
  { Icon: GraduationCap, path: '/education', label: 'Education' },
  { Icon: Mail, path: '/contact', label: 'Contact' },
];

const sidebarBottomItems = [
  { path: '/about', isProfileImage: true },
  { Icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path }) => (
          <Link href={path} key={path}>
            <div
              className={`${styles.iconContainer} ${
                router.pathname === path && styles.active
              }`}
            >
              <Icon
                size={20}
                color={
                  router.pathname === path
                    ? 'rgb(225, 228, 232)'
                    : 'rgb(106, 115, 125)'
                }
                className={styles.icon}
              />
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map((item) => {
          const IconComponent = item.Icon;
          return (
            <div className={styles.iconContainer} key={item.path}>
              <Link href={item.path}>
                {item.isProfileImage ? (
                  <img
                    src="/profile/profile-img.jpg"
                    alt="Profile"
                    className={`${styles.profileImage} ${
                      router.pathname === item.path ? styles.activeProfile : ''
                    }`}
                  />
                ) : (
                  IconComponent && (
                    <IconComponent
                      size={20}
                      color={
                        router.pathname === item.path
                          ? 'rgb(225, 228, 232)'
                          : 'rgb(106, 115, 125)'
                      }
                      className={styles.icon}
                    />
                  )
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
