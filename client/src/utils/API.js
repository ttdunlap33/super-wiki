import $ from 'jquery';

// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const saveBook = (bookData, token) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  // return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    // var apiUrl = `https://superheroapi.com/api/4143178869133177/search/${query}`;
  
    // console.log(apiUrl);    
    // $.ajax({
    //   url: apiUrl,
    //   type: 'GET',
    //   dataType: 'jsonp'
    // }).then (function (response) {
    //   console.log(response);
    // });
//////////////
    // data: {
    //   k: apiKeyTaste,
    //   q: movieName,
    //   type: "movie",
    //   info: 1,
    //   limit: 6,
    // },

    // return $.ajax({
    //   url: `https://superheroapi.com/api/4143178869133177/search/${query}`,
    //   type: "GET",
    //   crossDomain: true,
    //   dataType: "json",
    // })
    query = query.replace(/\s+/g, '-').toLowerCase();
    console.log(query); // "sonic-free-games"

    const API_KEY = process.env.REACT_APP_API_KEY
    console.log(API_KEY)

    return fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&search_precise=false`);
};
