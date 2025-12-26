import Image from 'next/image';
import { useState } from 'react';

import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${styles.card} ${project.featured ? styles.featured : ''} ${
      expanded ? styles.expanded : ''
    }`}>
      <div className={styles.previewArea}>
        {showPreview ? (
          <div className={styles.iframeWrapper}>
            <iframe
              title={`${project.title} preview`}
              src={project.link}
              className={styles.iframe}
              sandbox="allow-forms allow-same-origin allow-scripts allow-popups allow-modals"
            />
          </div>
        ) : (
          <div className={styles.previewPlaceholder}>Preview hidden</div>
        )}

        <div className={styles.toolbar}>
          <button
            className={styles.iconButton}
            onClick={() => window.open(project.link, '_blank', 'noopener')}
            aria-label="Open in new tab"
            title="Open in new tab"
          >
            Open
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setShowPreview((s) => !s)}
            aria-label="Toggle preview"
            title="Toggle preview"
          >
            {showPreview ? 'Hide' : 'Show'}
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setExpanded((e) => !e)}
            aria-label="Expand preview"
            title="Expand preview"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
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
        </div>

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

        <div className={styles.cta}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Visit
          </a>
          <button
            className={styles.underline}
            onClick={() => setShowPreview((s) => !s)}
            type="button"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
