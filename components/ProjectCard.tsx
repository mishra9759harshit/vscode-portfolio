import Image from 'next/image';

import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${project.featured ? styles.featured : ''}`}
    >
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image
            src={project.logo}
            alt={`${project.title} logo`}
            width={24}
            height={24}
            className={styles.logo}
          />
        </div>
        {project.featured && <span className={styles.badge}>Featured</span>}
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default ProjectCard;
