const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedGames` array in User.js
const gameSchema = new Schema({
  gameId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  released: {
    type: String,
  },
  image: {
    type: String,
  },
  platforms: {
    type: String,
  },
  genres: {
    type: String,
  },
  metacritic: {
    type: Number,
  },
  esrb_rating: {
    type: String,
  },
});

module.exports = gameSchema;
