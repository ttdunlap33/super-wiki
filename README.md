# super-wiki
Cleanup the failed server-side fetch code

<Row xs={5}>
          {searchedGames ? searchedGames.map((game) => {
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
                      disabled={savedGameIds?.some((savedGameId) => savedGameId === game.gameId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveGame(game.gameId)}>
                      {savedGameIds?.some((savedGameId) => savedGameId === game.gameId)
                        ? 'You favorited this game!'
                        : 'Favorite this Game!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          }) : null}
        </Row>