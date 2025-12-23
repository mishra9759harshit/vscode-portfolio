export interface Project {
  title: string;
  description: string;
  logo: string;
  link: string;
  slug: string;
}

export const projects: Project[] = [
  {
    title: 'YouTube Video Downloader Pro',
    description:
      'Download YT videos offline save in your Device and share with anyone.',
    logo: '/logos/driwwwle.svg',
    link: 'https://github.com/mishra9759harshit/YouTubeDownloaderPro',
    slug: 'YTVideoDownloaderPro',
  },
  {
    title: 'Port Scanner',
    description:
      'A simple CLI based port scanner built using Python.',
    logo: '/logos/vsc.svg',
    link: 'https://github.com/mishra9759harshit/port-scanner',
    slug: 'vscode-portfolio',
  },
  {
    title: 'SQL DataBase',
    description:
      'A simple and elegant way to Practice SQL queries.',
    logo: '/logos/subtrackt.svg',
    link: 'https://github.com/mishra9759harshit/sqldatabase',
    slug: 'subtrackt',
  },
  {
    title: 'WiFi Attack Tool',
    description:
      'Wifi attack tool is cybersecurty wifi penetration tool.',
    logo: '/logos/coolify.svg',
    link: 'https://github.com/mishra9759harshit/wifi-attack-tool',
    slug: 'coolify-vscode-extension',
  },
];
