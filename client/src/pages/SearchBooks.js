import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns, Row, CardGroup, Tab, Modal, Nav } from 'react-bootstrap';

import Auth from '../utils/auth';
// import { saveBook, searchGoogleBooks } from '../utils/API';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_GAME } from '../utils/mutations';

import SignUpForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

import { Link } from 'react-router-dom';


const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState(null);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved gameId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveGame, { error }] = useMutation(SAVE_GAME);

  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);
      console.log(response);

      if (!response.ok) {
        setSearchedBooks([]);
      }
      else {
      var json = await response.json();
      const body = json.results;

      // const { items } = await response.json();

      const gameData = body.map((game) => ({
        gameId: game.id,
        name: game.name, 
        released: game.released,
        image: game.background_image,
        platforms: game.platforms,
        genres: game.genres,
        metacritic: game.metacritic,
        esrb_rating: game.esrb_rating ? game.esrb_rating.name : null,
      }));

      gameData.forEach(function (game) {
        if (game.genres) {
          var allGenres = "";
          game.genres.forEach(function (genre) {
            allGenres += genre.name + ", ";
          });
          game.genres = allGenres.substring(0, allGenres.length - 2);
        }

        if (game.platforms) {
          var allPlatforms = "";
          game.platforms.forEach(function (platform) {
            allPlatforms += platform.platform.name + ", ";
          });
          game.platforms = allPlatforms.substring(0, allPlatforms.length - 2);
        }
      });

      // setSearchedBooks(bookData);
      setSearchedBooks(gameData);
      setSearchInput('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (gameId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((game) => game.gameId === gameId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await saveBook(bookToSave, token);

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // // if book successfully saves to user's account, save book id to state
      // setSavedBookIds([...savedBookIds, bookToSave.gameId]);
      
      const { data } = await saveGame({
        variables: { gameData: { ...bookToSave } },
      });
      setSavedBookIds([...savedBookIds, bookToSave.gameId]);

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

  const handleTrailer = async (gameId, gameName) => {
    
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=00c0301752f8469e917d550c6ce3fb22`)
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
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=00c0301752f8469e917d550c6ce3fb22`)
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
    window.location.href='/saved'
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-light' style={{ backgroundImage: `url(screenshot.png)`, backgroundSize: 'cover' }}>
        <Container>
          <h1>Find a game!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a video game'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='dark' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
          {Auth.loggedIn() ? (
            <>
              <Button className="mt-3 mr-2" variant="dark" onClick={favoriteGames}>Favorite Games</Button>
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
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey='login' variant="dark">Login</Nav.Link>
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
        <h3>
          {searchedBooks ? searchedBooks.length ? 
            `Your games:` : `No games found.`
            : ``}
        </h3>

        <Row xs={5}>
          {searchedBooks ? searchedBooks.map((game) => {
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
                  <Button variant="dark"
                      className='btn-block btn-info'
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
                  {Auth.loggedIn() && (
                    <Button variant="dark"
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === game.gameId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(game.gameId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === game.gameId)
                        ? 'You favorited this game!'
                        : 'Favorite this Game!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          }) : null}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;

// {searchedBooks ? searchedBooks.map((game) => {
//   return (
//     <Card key={game.gameId} border='dark'>
//       <Card.Body>
//         <Card.Text>{game.description}</Card.Text>
//       </Card.Body>
//     </Card>
//   );
// }) : null}