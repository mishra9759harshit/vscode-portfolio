import Head from 'next/head';

interface CustomHeadProps {
  title: string;
}

const CustomHead = ({ title }: CustomHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="I am a passionate tech enthusiast and developer with a strong interest in programming, software development, and emerging technologies. My journey spans web and application development, IoT systems, AI/ML integration, and smart automation solutions. I enjoy building innovative projects—from intelligent dashboards and smart device control systems to futuristic cyberdeck concepts—focused on performance, security, and user experience. Continuously learning and experimenting, I aim to create impactful, scalable, and future-ready technology solutions."
      />
      <meta
        name="keywords"
        content="harshit mishra, harshit, mishra, harshit mishra portfolio, harshit mishra developer, harshit mishra software developer, harshit web developer, harshit full stack developer, computer science student, mern stack developer, iot developer, ai projects, mqtt esp32 projects, cybersecurity enthusiast, ethical hacking, real time dashboard, vscode portfolio"
      />
      <meta property="og:title" content="Harshit Mishra's Portfolio" />
      <meta
        property="og:description"
        content="A full-stack developer building websites that you'd like to use."
      />
      <meta property="og:image" content="https://imgur.com/4zi5KkQ.png" />
      <meta property="og:url" content="https://whoisharshit.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Nitin Ranganath',
};
