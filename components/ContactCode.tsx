import styles from '@/styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'whoisharshit.vercel.app',
    href: 'https://whoisharshit.vercel.app',
  },
  {
    social: 'email',
    link: 'mishra9759harshit@gmail.com',
    href: 'mailto:mishra9759harshit@gmail.com',
  },
  {
    social: 'github',
    link: 'mishra9759harshit',
    href: 'https://github.com/mishra9759harshit',
  },
  {
    social: 'linkedin',
    link: 'harshit-mishra-mr-robot',
    href: 'https://www.linkedin.com/in/harshit-mishra-mr-robot/',
  },
  {
    social: 'twitter',
    link: 'mishra9759harshit',
    href: 'https://www.twitter.com/mishra9759harshit',
  },
  {
    social: 'telegram',
    link: '@securecoderdev',
    href: 'https://t.me/securecoderdev',
  },
  {
    social: 'Dev.to',
    link: 'mishra9759harshit',
    href: 'https://dev.to/mishra9759harshit',
  },
   {
    social: 'buymeacoffee',
    link: 'bitrolabs',
    href: 'https://buymeacoffee.com/bitrolabs',
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
