import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Harshit Mishra</h1>
        <div className={styles.subtitle}>Software Engineer</div>

        <div className={styles.aboutContent}>
          <section className={styles.section}>
            <p className={styles.paragraph}>
              Hey! I&apos;m a software engineer from UP, India. I primarily
              work with JavaScript / Python and IoT along with webdevelopment.
            </p>
            <p className={styles.paragraph}>
              I&apos;m focused on frontend development with React, but
              you&apos;ll also find me working with Node.js, PostgreSQL and Express
              while building the backend for my personal projects I can also build some crazy Applications and servers using python.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <p className={styles.paragraph}>
              Currently at <span className={styles.highlight}>M.J.P.R.Universty</span> as
              Software Engineering student, working with a lean team of 6 
              engineers to build a next-gen Applications.
            </p>
            <p className={styles.paragraph}>
              I&apos;ve been leading the development efforts for bringing
              next-gen automation and security. I also
              maintain our in-house Cybersecurity.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Writing</h2>
            <p className={styles.paragraph}>
              I&apos;ve had the pleasure of writing for some amazing
              publications like{' '}
              <span className={styles.highlight}>A story of night developer</span>,{' '}
              <span className={styles.highlight}>who is Harshit?</span>,{' '}
              <span className={styles.highlight}>feel of tech</span> and more as a
              freelance technical author.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Beyond Code</h2>
            <p className={styles.paragraph}>
              Aside from programming and writing, I like to read a good
              Sci-fi, Adventure thriller novel, and watch movies and series. listen to music or just laze around.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'About' },
  };
}

export default AboutPage;
