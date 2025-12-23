import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/Titlebar.module.css';

const Titlebar = () => {
  const [showGuide, setShowGuide] = useState(false);

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
          <p className={styles.helpButton} onClick={() => setShowGuide(true)}>
            Help
          </p>
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

      <AnimatePresence>
        {showGuide && (
          <motion.div
            className={styles.guideOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              className={styles.guideModal}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.guideHeader}>
                <h2>Portfolio Guide</h2>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowGuide(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.guideContent}>
                <div className={styles.guideSection}>
                  <h3> Sidebar Navigation</h3>
                  <p>The left sidebar contains your main navigation:</p>
                  <ul>
                    <li><strong>Home Icon</strong> - Main portfolio landing page</li>
                    <li><strong>GitHub Icon</strong> - View GitHub repositories and activity</li>
                    <li><strong>Code Icon</strong> - Browse your projects</li>
                    <li><strong>Articles Icon</strong> - Read technical articles and blog posts</li>
                    <li><strong>Achievements Icon</strong> - View achievements, certificates, awards, and news</li>
                    <li><strong>Skills Icon</strong> - Explore your technical skills and expertise</li>
                    <li><strong>Education Icon</strong> - View educational background and certifications</li>
                    <li><strong>Mail Icon</strong> - Contact information and forms</li>
                    <li><strong>Profile Picture</strong> - Navigate to about page</li>
                    <li><strong>Settings Icon</strong> - Access portfolio settings and preferences</li>
                  </ul>
                </div>

                <div className={styles.guideSection}>
                  <h3> Tab Bar</h3>
                  <p>The top tab bar shows open &quot;files&quot; representing different pages:</p>
                  <ul>
                    <li><strong>home.tsx</strong> - Home page with introduction</li>
                    <li><strong>about.html</strong> - About page with profile details</li>
                    <li><strong>contact.css</strong> - Contact form and information</li>
                    <li><strong>projects.js</strong> - JavaScript project showcase</li>
                    <li><strong>articles.json</strong> - Article collection</li>
                    <li><strong>github.md</strong> - GitHub integration</li>
                    <li><strong>achievements.tsx</strong> - Achievements and certificates</li>
                    <li><strong>skills.tsx</strong> - Technical skills catalog</li>
                    <li><strong>education.tsx</strong> - Educational timeline</li>
                  </ul>
                  <p className={styles.tip}>💡 Click on any tab to navigate to that section</p>
                </div>

                <div className={styles.guideSection}>
                  <h3> Explorer Panel</h3>
                  <p>The left explorer shows all available portfolio sections with file icons:</p>
                  <ul>
                    <li>Organized by file type for easy identification</li>
                    <li>Each icon represents the file type or technology used</li>
                    <li>Click any item to navigate to that page</li>
                  </ul>
                </div>

                <div className={styles.guideSection}>
                  <h3> Key Features</h3>
                  <ul>
                    <li><strong>Smooth Animations</strong> - Framer Motion provides fluid transitions</li>
                    <li><strong>Grayscale Effects</strong> - Profile image turns color on hover</li>
                    <li><strong>Responsive Design</strong> - Works on all device sizes</li>
                    <li><strong>GitHub Integration</strong> - Real-time language statistics</li>
                    <li><strong>Dark Theme</strong> - VS Code inspired color scheme</li>
                  </ul>
                </div>

                <div className={styles.guideSection}>
                  <h3> Tips & Tricks</h3>
                  <ul>
                    <li>Hover over cards and elements for interactive effects</li>
                    <li>The sidebar icons change color when on their respective page</li>
                    <li>Filter achievements and skills by category</li>
                    <li>Expand education items to see detailed information</li>
                    <li>Scroll through each page to see all content</li>
                  </ul>
                </div>

                <div className={styles.guideFooter}>
                  <p>Click anywhere outside this guide to close it</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Titlebar;
