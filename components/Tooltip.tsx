import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/Tooltip.module.css';

interface TooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
}

const Tooltip = ({
  title,
  description,
  children,
  position = 'top',
  icon,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    top: styles.tooltipTop,
    bottom: styles.tooltipBottom,
    left: styles.tooltipLeft,
    right: styles.tooltipRight,
  };

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      suppressHydrationWarning
    >
      {children}

      <AnimatePresence mode="wait">
        {showTooltip && (
          <motion.div
            className={`${styles.tooltip} ${positionClasses[position]}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {icon && <img src={icon} alt="" className={styles.tooltipIcon} suppressHydrationWarning />}
            <div className={styles.tooltipContent}>
              <h4 className={styles.tooltipTitle}>{title}</h4>
              <p className={styles.tooltipDescription}>{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
