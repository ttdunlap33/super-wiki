import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { GET_ME } from '../utils/queries';
import { REMOVE_GAME } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});
  
  const { loading, data } = useQuery(GET_ME);
  const [removeGame, {error}] = useMutation(REMOVE_GAME);

  const userData = data?.me || [];

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       console.log(response);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (gameId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await deleteBook(gameId, token);

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // const updatedUser = await response.json();

      console.log(gameId);

      await removeGame({
        variables: { gameId }
      });

      if (error) {
        throw new Error('something went wrong!');
      }

      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(gameId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDescription = async (gameId) => {
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=00c0301752f8469e917d550c6ce3fb22`)
    const body = await response.json();

    var modal = document.getElementById("myModal");
    var content = document.getElementById("myDescription");
    content.innerHTML = body.description;

    // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block"

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  if (loading) {
    return <h2>LOADING...</h2>
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-light' style={{ backgroundImage: `url(screenshot.png)`, backgroundSize: 'cover' }}>
        <Container>
          <h1>Viewing saved Video Games!</h1>
        </Container>
      </Jumbotron>
      <Container>
      <div id="myModal" class="customModal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p id="myDescription"></p>
        </div>
      </div>
        <h2>
          {userData.savedGames?.length
            ? `Viewing ${userData.savedGames.length} saved ${userData.savedGames.length === 1 ? 'video game' : 'video games'}:`
            : 'You have no saved video games!'}
        </h2>
        <CardColumns>
          {userData.savedGames?.map((game) => {
            return (
              <Card key={game.gameId} border='dark'>
              {game.image ? (
                <Card.Img src={game.image} alt={`The cover for ${game.name}`} variant='top' />
              ) : null}
              <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                {game.metacritic ? <p><b>Metacritic:</b> {game.metacritic}</p> : null }
                {game.released ? <p><b>Released on:</b> {game.released}</p> : null}
                {game.esrb_rating ? <p><b>ESRB Rating:</b> {game.esrb_rating}</p> : null}
                {game.genres ? <p><b>Genres:</b> {game.genres}</p> : null}
                {game.platforms ? <p><b>Platforms:</b> {game.platforms}</p> : null}
                <Button
                    className='btn-block btn-info'
                    onClick={() => handleDescription(game.gameId)}>
                    Description
                  </Button>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(game.gameId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
