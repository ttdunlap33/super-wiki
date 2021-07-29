export const getSavedGameIds = () => {
  const savedGameIds = localStorage.getItem('saved_games')
    ? JSON.parse(localStorage.getItem('saved_games'))
    : [];

  return savedGameIds;
};

export const saveGameIds = (gameIdArr) => {
  if (gameIdArr.length) {
    localStorage.setItem('saved_games', JSON.stringify(gameIdArr));
  } else {
    localStorage.removeItem('saved_games');
  }
};

export const removeGameId = (gameId) => {
  console.log('removeGameId');
  const savedGameIds = localStorage.getItem('saved_games')
    ? JSON.parse(localStorage.getItem('saved_games'))
    : null;

  console.log(`Saved Game Ids: ${savedGameIds}`);
  console.log(`Is Array: ${Array.isArray(savedGameIds)}`)

  console.log(`Game ID Type: ${typeof(gameId)}`);

  if (!savedGameIds) {
    return false;
  }

  for (var i = 0; i < savedGameIds.length; i++) {
    console.log(`Type: ${typeof(savedGameIds[i])} and ${savedGameIds[i]}`);
  }

  const index = savedGameIds.indexOf(parseInt(gameId, 10));
  console.log(`Index: ${index}`);
  if (index >= 0) {
    savedGameIds.splice(index, 1);
    console.log(savedGameIds);
  }

  // const updatedSavedGameIds = savedGameIds?.filter((savedGameId) => savedGameId !== gameId);

  // console.log(`After Filter: ${updatedSavedGameIds}`);

  // localStorage.setItem('saved_games', JSON.stringify(updatedSavedGameIds));
  localStorage.setItem('saved_games', JSON.stringify(savedGameIds));


  console.log(`Set: ${localStorage.getItem('saved_games')}`);

  return true;
};
