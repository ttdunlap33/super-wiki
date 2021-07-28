import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button, Modal, Tab, Nav, Row } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeGameId } from '../utils/localStorage';

import { GET_ME } from '../utils/queries';
import { REMOVE_GAME } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';

import SignUpForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

const SavedGames = () => {  
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  const { loading, data } = useQuery(GET_ME);
  const [removeGame, {error}] = useMutation(REMOVE_GAME);

  const userData = data?.me || [];

  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const handleDeleteGame = async (gameId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeGame({
        variables: { gameId }
      });

      if (error) {
        throw new Error('something went wrong!');
      }

      // upon success, remove game's id from localStorage
      removeGameId(gameId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDescription = async (gameId) => {
    const API_KEY = process.env.REACT_APP_API_KEY
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`)
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

  const handleTrailer = async (gameId, gameName) => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${API_KEY}`)
    const body = await response.json();

    if (body.count != 0) {
      setShowTrailerModal(true)

      var trailerContent = document.getElementById("trailer");
      trailerContent.src = body.results[0].data.max;
    }
    else {
      window.alert(`No trailer found for '${gameName}'`);
    }
  }

  const handleLink = async (gameId) => {
    const API_KEY = process.env.REACT_APP_API_KEY
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`)
    const body = await response.json();

    var url = body.reddit_url;
    if (url) {
      window.open(url, '_blank');
    }
    else {
      window.alert(`No subreddit for '${body.name}'`)
    }
  }

  const favoriteGames = async () => {
    window.location.href='/'
  }

  if (loading) {
    return <h2>LOADING...</h2>
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-light' style={{ backgroundImage: `url(screenshot.png)`, backgroundSize: 'cover' }}>
        <Container>
          <h1>Viewing saved Video Games!</h1>
          {Auth.loggedIn() ? (
            <>
              <Button className="mt-3 mr-2" variant="dark" onClick={favoriteGames}>Search for a Game!</Button>
              <Button className="mt-3 ml-2 mr-2" variant="light" onClick={Auth.logout}>Logout</Button>
            </>
          ) : (
            <Button className="mt-3 mr-2" variant="dark" onClick={() => setShowModal(true)}>Login/Sign Up</Button>
          )}
        </Container>
      </Jumbotron>
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component*/}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>

      <Modal
        id='trailerModal'
        size='lg'
        show={showTrailerModal}
        onHide={() => setShowTrailerModal(false)}
        aria-labelledby='trailer-modal'>
        {/* tab container to do either signup or login component*/}
        <Modal.Header closeButton></Modal.Header>
        <iframe id='trailer' height="300"></iframe>
        <p id='trailerError'></p>
      </Modal>

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
        <Row xs={5}>
          {userData.savedGames?.map((game) => {
            return (
              <Card key={game.gameId} border='dark' className="m-4">
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
                    className='btn-block btn-dark'
                    onClick={() => handleDescription(game.gameId)}>
                    Description
                  </Button>
                  <Button variant="dark"
                      className='btn-block btn-info'
                      onClick={() => handleTrailer(game.gameId, game.name)}>
                      Trailer
                    </Button>
                    <Button variant="dark"
                      className='btn-block btn-info'
                      onClick={() => handleLink(game.gameId)}>
                      Reddit
                    </Button>
                <Button className='btn-block' variant='outline-danger' onClick={() => handleDeleteGame(game.gameId)}>
                  Remove from Favorites
                </Button>
              </Card.Body>
            </Card>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedGames;
