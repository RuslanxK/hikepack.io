import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: string; 
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();


  const handleReadMore = () => {
    navigate(`/article/${article.id}`);
  };

  const truncatedTitle =
    article.title.length > 25
      ? `${article.title.slice(0, 25)}...`
      : article.title;
  const truncatedDescription =
    article.description.length > 70
      ? `${article.description.slice(0, 70)}...`
      : article.description;


      const formattedDate = !isNaN(Number(article.createdAt))
      ? new Date(Number(article.createdAt)).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      : 'Invalid Date';

  return (
    <div
      key={article.id}
      onClick={handleReadMore}
      className="cursor-pointer shadow-airbnb bg-white dark:bg-box rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-40 object-cover transition-transform duration-300 transform"
      />

      <div className="p-4">
        <p className="text-xs text-accent dark:text-white mb-2">
          {formattedDate}
        </p>
        <h2 className="text-md font-semibold text-black dark:text-white mb-2">
          {truncatedTitle}
        </h2>
        <p className="text-sm text-accent dark:text-gray-300 mb-4">
          {truncatedDescription}
        </p>
        <button
          onClick={handleReadMore}
          className="text-primary text-sm dark:text-button-lightGreen flex items-center font-medium w-full flex justify-end hover:text-button-hover"
        >
          <span>Read More</span>
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
