import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/article/${article.id}`);
  };

  const truncatedTitle = article.title.length > 15 ? `${article.title.slice(0, 25)}...` : article.title;
  const truncatedDescription = article.description.length > 30 ? `${article.description.slice(0, 70)}...` : article.description;

  return (
    <div
      key={article.id} className="relative group bg-white dark:bg-box rounded-lg overflow-hidden shadow-lg p-4">
      <img src={article.imageUrl} alt={article.title} className="w-full h-32 object-cover rounded-lg mb-4 transition-transform duration-300 transform group-hover:scale-105"/>
      <h2 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
        {truncatedTitle}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
        {truncatedDescription}
      </p>
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleReadMore}
          className="inline-flex items-center text-primary dark:text-blue-400">
          <span className="text-sm">Read More</span>
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ArticleCard);
