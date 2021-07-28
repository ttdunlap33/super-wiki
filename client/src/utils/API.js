// make a search to rawg api
export const searchVideoGames = (query) => {
    const API_KEY = process.env.REACT_APP_API_KEY

    return fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&search_precise=false`);
};
