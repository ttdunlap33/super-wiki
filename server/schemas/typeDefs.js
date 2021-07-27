const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String
    gameCount: Int
    savedGames: [Game]
  }
  type Game {
    gameId: ID!
    name: String!
    released: String
    image: String
    platforms: String
    genres: String
    metacritic: Int
    esrb_rating: String
  }
  input SavedGame {
    gameId: Int
    name: String
    released: String
    image: String
    platforms: String
    genres: String
    metacritic: Int
    esrb_rating: String
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveGame(gameData: SavedGame!): User
    removeGame(gameId: ID!): User
  }
  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;