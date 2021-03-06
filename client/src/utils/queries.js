import gql from 'graphql-tag';

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      gameCount
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

