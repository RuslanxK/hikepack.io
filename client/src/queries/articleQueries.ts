import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles {
    getArticles {
      id
      title
      description
      imageUrl
      createdAt
    }
  }
`;


export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    getArticle(id: $id) {
      id
      title
      description
      imageUrl
      createdAt

    }
  }
`;