import React from 'react';
import { useQuery } from '@apollo/client';
import ArticleCard from './articleCard';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GET_ARTICLES } from '../../queries/articleQueries';
import Spinner from '../loading/Spinner';
import Message from '../message/Message';

const Articles: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Message 
          width="w-fit" 
          title="Attention Needed" 
          padding="p-5" 
          titleMarginBottom="mb-2" 
          message={`Error: ${error.message}`} 
          type="error" 
        />
      </div>
    );
  }

  const articles = data.getArticles;

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className='p-4 sm:p-10'>
      <div className="flex items-center mb-4">
        <button 
          type="button" 
          className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm" 
          onClick={() => navigate(-1)}>
          <FaArrowLeft size={17} />
        </button>
        <h1 className="text-xl font-semibold text-left dark:text-white">Articles</h1>
      </div>
      
      <p className="text-base text-left text-gray-600 dark:text-gray-300 mb-8">
        Discover the latest tips, guides, and adventures from our blog.
      </p>
      
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5">
          {articles.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <Message 
          width="w-full" 
          title="No Articles Found" 
          padding="p-5" 
          titleMarginBottom="mb-2" 
          message="There are currently no articles available. Please check back later." 
          type="info" 
        />
      )}
    </div>
    </div>
  );
};

export default Articles;
