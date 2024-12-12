import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ARTICLE } from '../../queries/articleQueries';
import Spinner from '../loading/Spinner';
import Message from '../message/Message';
import { FaArrowLeft } from 'react-icons/fa';

const SingleArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_ARTICLE, {
    variables: { id },
  });

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

  const article = data?.getArticle;

  if (!article) {
    return <p>Article not found</p>;
  }

  const formattedDate = !isNaN(Number(article.createdAt))
  ? new Date(Number(article.createdAt)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  : 'Invalid Date';

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className="p-4 sm:p-10">
        <div className="flex items-center mb-6 bg-white dark:bg-box p-5 rounded-lg">
          <button 
            type="button" 
            className="mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm" 
            onClick={() => navigate(-1)}>
            <FaArrowLeft size={17} />
          </button>
          <h1 className="text-xl font-semibold text-black dark:text-white">{article.title}</h1>
          
        </div>

        

        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-72 object-cover rounded-lg mt-6 mb-6" 
        />
        <div className="prose prose-lg text-accent dark:text-gray-300 max-w-none mb-5 bg-white dark:bg-box p-5 rounded-lg blog">

        <p className="text-sm text-black dark:text-white mb-4">
          Posted on: {formattedDate}
        </p>
          <div dangerouslySetInnerHTML={{ __html: article.description }}></div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;
