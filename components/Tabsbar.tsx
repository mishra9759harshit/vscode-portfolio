import Tab from '@/components/Tab';

import styles from '@/styles/Tabsbar.module.css';

const Tabsbar = () => {
  return (
    <div className={styles.tabs}>
      <Tab icon="/logos/react_icon.svg" filename="home.tsx" path="/" />
      <Tab icon="/logos/html_icon.svg" filename="about.html" path="/about" />
      <Tab icon="/logos/css_icon.svg" filename="contact.css" path="/contact" />
      <Tab icon="/logos/postgresql-logo.svg" filename="projects.js" path="/projects" />
      <Tab
        icon="/logos/json_icon.svg"
        filename="articles.json"
        path="/articles"
      />
      <Tab
        icon="/logos/markdown_icon.svg"
        filename="github.md"
        path="/github"
      />
      <Tab
        icon="/logos/typescript-official-svgrepo-com.svg"
        filename="achievements.tsx"
        path="/achievements"
      />
      <Tab
        icon="/logos/docker-svgrepo-com.svg"
        filename="skills.tsx"
        path="/skills"
      />
      <Tab
        icon="/logos/react_icon.svg"
        filename="education.tsx"
        path="/education"
      />
    </div>
  );
};

export default Tabsbar;
