import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_GAME = gql`
  mutation saveGame($gameData: SavedGame!) {
    saveGame(gameData: $gameData) {
      _id
      username
      email
      savedGames {
        gameId
        name
        released
        image
        platforms
        genres
        metacritic
        esrb_rating
      }
    }
  }
`;

export const REMOVE_GAME = gql`
  mutation removeGame($gameId: ID!) {
    removeGame(gameId: $gameId) {
      _id
      username
      email
      savedGames {
        gameId
        name
        released
        image
        platforms
        genres
        metacritic
        esrb_rating
      }
    }
  }
`;