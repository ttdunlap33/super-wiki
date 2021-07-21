import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { saveBook, searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

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
        console.log(response)
        throw new Error('something went wrong!');
      }

      // var body = await response.json();
      // console.log(body);

      var body = [await response.json()];

      // const { items } = await response.json();

      // console.log(items)

      // console.log(items);

      // var gameData = {
      //   gameId: body.id,
      //   name: body.name, 
      //   description: body.description,
      //   image: body.background_image,
      //   second_image: body.background_image_additional,
      // };

      const gameData = body.map((game) => ({
        gameId: game.id,
        name: game.name, 
        description: game.description,
        image: game.background_image,
        second_image: game.background_image_additional,
        link: game.website.infoLink,
      }));

      // const bookData = items.map((book) => ({
      //   bookId: book.id,
      //   authors: book.volumeInfo.authors || ['No author to display'],
      //   title: book.volumeInfo.title,
      //   description: book.volumeInfo.description,
      //   image: book.volumeInfo.imageLinks?.thumbnail || '',
      //   link: book.volumeInfo.infoLink,
      // }));

      // setSearchedBooks(bookData);
      setSearchedBooks(gameData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveBook(bookToSave, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-warning'>
        <Container>
          <h1>Search for Games!</h1>
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
                <Button type='submit' variant='info' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h3>
          {searchedBooks.length
            ? `Viewing your results:`
            : ''}
        </h3>
        <CardColumns>
          {searchedBooks.map((game) => {
            return (
              <Card key={game.gameId} border='dark'>
                {game.image ? (
                  <Card.Img src={game.image} alt={`The cover for ${game.name}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{game.name}</Card.Title>
                  <Card.Text>{game.description}</Card.Text>
                  <a href={game.link} target="_blank">Link</a>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === game.gameId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(game.gameId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === game.gameId)
                        ? 'You saved this book!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;
