import Image from 'next/image';
import styles from '@/styles/Titlebar.module.css';
import { HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

interface TitlebarProps {
  onHelpClick?: () => void;
}

const Titlebar = ({ onHelpClick }: TitlebarProps) => {
  const handleHelpClick = () => {
    onHelpClick?.();
  };

  return (
    <>
      <section className={styles.titlebar}>
        <Image
          src="/logos/vscode_icon.svg"
          alt="VSCode Icon"
          height={15}
          width={15}
          className={styles.icon}
        />
        <div className={styles.items}>
          <p>File</p>
          <p>Edit</p>
          <p>View</p>
          <p>Go</p>
          <p>Run</p>
          <p>Terminal</p>
          <div className={styles.helpContainer}>
            <Tooltip title="Help" description="View portfolio guide and learn how to navigate." position="bottom">
              <button
                className={styles.helpButton}
                onClick={handleHelpClick}
                title="View portfolio guide and tooltips"
                aria-label="Help"
              >
                <HelpCircle size={16} />
              </button>
            </Tooltip>
          </div>
        </div>
        <p className={styles.title}>
          Harshit&apos;s - Visual Studio Code Portfolio
        </p>
        <div className={styles.windowButtons}>
          <span className={styles.minimize}></span>
          <span className={styles.maximize}></span>
          <span className={styles.close}></span>
        </div>
      </section>
    </>
  );
};

export default Titlebar;
