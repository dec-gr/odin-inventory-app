const db = require('../db/queries');

exports.moviesListGet = async (req, res) => {
  const movies = await db.getAllMoviesWithGenreNames();
  res.render('index', {
    title: 'Movie List',
    movies: movies,
  });
};

exports.addMovieGet = async (req, res) => {
  const genres = await db.getAllGenres();

  res.render('addMovie', {
    title: 'Add Movie',
    genres: genres,
  });
};

exports.addMoviePost = async (req, res) => {
  console.log(req.body);
  const { movie_name, release_year, director, genres } = req.body;
  const movie_result = await db.addMovie({
    movie_name,
    release_year,
    director,
  });
  const movie_id = movie_result.rows[0].movie_id;
  console.log('Result');
  genres.forEach((genre_id) => {
    console.log('HERE');
    console.log({ movie_id, genre_id });
    db.addMovieGenre({ movie_id, genre_id });
  });
  res.redirect('/');
};

exports.addGenreGet = (req, res) => {
  res.render('addGenre', { title: 'Add Genre' });
};

exports.addGenrePost = (req, res) => {
  const { genre_name } = req.body;
  db.addGenre({ genre_name });
  res.redirect('/');
};

exports.getViewMovie = async (req, res) => {
  const movie_id = req.params.movie_id;
  console.log(movie_id);
  const movie = await db.getMovieWithGenreNames(movie_id);
  console.log(movie);
  res.render('movies/viewMovie', { title: 'Movie Details', movie: movie });
};

exports.getMoviesByGenre = async (req, res) => {
  const genre_id = req.params.genre_id;
  const [genre_name, movies] = await Promise.all([
    db.getGenre(genre_id),
    db.getMoviesFromGenre(genre_id),
  ]);

  res.render('index', { title: genre_name['genre_name'], movies: movies });
};

exports.getGenreList = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render('genreList', { title: 'Genres', genres: genres });
};
