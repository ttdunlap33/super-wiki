const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String
    gameCount: Int
    savedGames: [Game]
  }
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
  type Game {
    gameId: ID!
    name: String!
    released: String
    image: String
    platforms: String
    genres: String
    metacritic: String
    esrb_rating: String
  }
  input SavedGame {
    gameId: String
    name: String
    released: String
    image: String
    platforms: String
    genres: String
    metacritic: String
    esrb_rating: String
  }
  input savedBook {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
  type Query {
    me: User
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: savedGame!): User
    removeBook(bookId: ID!): User
  }
  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;