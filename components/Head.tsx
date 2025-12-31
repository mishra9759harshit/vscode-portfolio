import Head from 'next/head';

interface CustomHeadProps {
  title?: string;
  isNewYearPeriod?: boolean;
}

const CustomHead = ({ title = 'Harshit Mishra', isNewYearPeriod = false }: CustomHeadProps) => {
  const displayTitle = isNewYearPeriod ? `🎉 Happy New Year! | ${title}` : title;
  const displayDescription = isNewYearPeriod 
    ? "Celebrating the New Year with an interactive celebration! Share your social media profile and receive personalized New Year wishes with poetical Hindi quotes, animations, and festive effects. Happy 2026!"
    : "I am a passionate tech enthusiast and developer with a strong interest in programming, software development, and emerging technologies. My journey spans web and application development, IoT systems, AI/ML integration, and smart automation solutions. I enjoy building innovative projects—from intelligent dashboards and smart device control systems to futuristic cyberdeck concepts—focused on performance, security, and user experience. Continuously learning and experimenting, I aim to create impactful, scalable, and future-ready technology solutions.";

  return (
    <Head>
      <title>{displayTitle}</title>
      <meta name="description" content={displayDescription} />
      <meta
        name="keywords"
        content={isNewYearPeriod 
          ? "new year 2026, new year celebration, new year wishes, happy new year, harshit mishra, portfolio, celebration, interactive greeting"
          : "harshit mishra, harshit, mishra, harshit mishra portfolio, harshit mishra developer, harshit mishra software developer, harshit web developer, harshit full stack developer, computer science student, mern stack developer, iot developer, ai projects, mqtt esp32 projects, cybersecurity enthusiast, ethical hacking, real time dashboard, vscode portfolio"}
      />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={displayDescription} />
      <meta property="og:image" content="https://whoisharshit.vercel.app/profile.jpg" />
      <meta property="og:url" content="https://whoisharshit.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
      {isNewYearPeriod && (
        <>
          <meta name="theme-color" content="#0ea5a4" />
          <meta property="og:type" content="website" />
          <meta name="twitter:title" content={displayTitle} />
          <meta name="twitter:description" content={displayDescription} />
        </>
      )}
    </Head>
  );
};

export default CustomHead;
