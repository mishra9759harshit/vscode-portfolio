import ArticleCard from '@/components/ArticleCard';

import { Article } from '@/types';

import styles from '@/styles/ArticlesPage.module.css';

interface ArticlesPageProps {
  articles: Article[];
}

const ArticlesPage = ({ articles }: ArticlesPageProps) => {
  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>My Articles</h1>
      <p className={styles.pageSubtitle}>
        Recent posts from{' '}
        <a
          href="#"
          target="_blank"
          rel="noopener"
          className={styles.underline}
        >
          Who is Harshit
        </a>{' '}
        My Biography.
      </p>
      <div className={styles.container}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  let articles = [];

  try {
    const res = await fetch(
      'https://dev.to/api/articles?username=harshitcodes',
      {
        headers: process.env.DEV_TO_API_KEY
          ? {
              'api-key': process.env.DEV_TO_API_KEY,
            }
          : {},
      }
    );

    if (res.ok) {
      articles = await res.json();
    }
  } catch (error) {
    console.log('Failed to fetch articles from Dev.to API:', error);
    // Return empty articles array if fetch fails
    articles = [];
  }

  return {
    props: { title: 'Articles', articles },
    revalidate: 3600, // Revalidate every hour
  };
}

export default ArticlesPage;
