export interface Project {
  title: string;
  description: string;
  logo: string;
  link: string;
  slug: string;
  tags?: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'eCampus Management System',
    description: 'A comprehensive digital campus platform enabling seamless online learning, real-time attendance tracking, and integrated academic resource management. Features include student dashboards, teacher profiles, grade tracking, and institutional data management for educational excellence.',
    logo: 'https://bcbecampus.vercel.app/courses/mslogo.png',
    link: 'https://bcbecampus.vercel.app',
    slug: 'ecampus-management-system',
    tags: ['Education', 'Web App', 'Full Stack'],
    featured: true,
  },
  {
    title: 'BCB Computer Department Website',
    description: 'Official institutional website showcasing computer science programs, faculty expertise, and academic initiatives. Designed for prospective students and stakeholders seeking comprehensive information about the department\'s vision and offerings.',
    logo: 'https://bcbecampus.vercel.app/img/logo-2.png',
    link: 'https://bcbcomputerdept.vercel.app',
    slug: 'bcb-computer-department-website',
    tags: ['Web Design', 'Institution', 'Marketing'],
    featured: true,
  },
  {
    title: 'YouTube Video Downloader Pro',
    description: 'Robust desktop utility for downloading YouTube videos in multiple formats and resolutions. Supports offline playback, batch processing, and seamless sharing with an intuitive user interface.',
    logo: '/logos/driwwwle.svg',
    link: 'https://github.com/mishra9759harshit/YouTubeDownloaderPro',
    slug: 'youtube-video-downloader-pro',
    tags: ['Python', 'Desktop App', 'Utility'],
  },
  {
    title: 'Advanced Port Scanner',
    description: 'High-performance network reconnaissance tool built with Python. Provides comprehensive port scanning, service detection, and network analysis for cybersecurity professionals and system administrators.',
    logo: '/logos/vsc.svg',
    link: 'https://github.com/mishra9759harshit/port-scanner',
    slug: 'port-scanner-python',
    tags: ['Python', 'Cybersecurity', 'Networking'],
  },
  {
    title: 'SQL Database Practice Platform',
    description: 'Interactive learning platform for mastering SQL queries and relational database design. Includes hands-on exercises, real-world scenarios, and progressive difficulty levels for learners at all skill stages.',
    logo: '/logos/subtrackt.svg',
    link: 'https://github.com/mishra9759harshit/sqldatabase',
    slug: 'sql-database-practice',
    tags: ['Database', 'Learning', 'SQL'],
  },
  {
    title: 'WiFi Security Analysis Tool',
    description: 'Educational cybersecurity tool for WiFi penetration testing and security analysis. Designed for authorized penetration testers and security professionals to identify vulnerabilities and strengthen network defenses.',
    logo: '/logos/coolify.svg',
    link: 'https://github.com/mishra9759harshit/wifi-attack-tool',
    slug: 'wifi-attack-tool',
    tags: ['Cybersecurity', 'Networking', 'Ethical Hacking'],  },
];