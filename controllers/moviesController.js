const db = require('../db/queries');

exports.moviesListGet = async (req, res) => {
  const movies = await db.getAllMoviesWithGenreNames();
  res.render('index', {
    partial: 'movieGrid',
    title: 'Movie List',
    movies: movies,
  });
};

exports.addMovieGet = async (req, res) => {
  const genres = await db.getAllGenres();

  res.render('index', {
    partial: 'addMovie',
    title: 'Add Movie',
    genres: genres,
  });
};

exports.addMoviePost = async (req, res) => {
  console.log(req.body);
  const { movie_name, release_year, director, image_url, genres } = req.body;
  console.log(image_url);
  const movie_result = await db.addMovie({
    movie_name,
    release_year,
    director,
    image_url,
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

exports.updateMovieGet = async (req, res) => {
  const movie_id = req.params.movie_id;
  const movie = await db.getMovieWithGenreNames(movie_id);
  const genres = await db.getAllGenres();
  const movie_genres_raw = await db.getMovieGenres(movie_id);
  const movie_genres = movie_genres_raw.map((x) => x.genre_id);
  res.render('index', {
    partial: 'updateMovie',
    title: 'Update Movie',
    movie: movie,
    genres: genres,
    movie_genres: movie_genres,
  });
};

exports.updateMoviePost = async (req, res) => {
  const movie_id = req.params.movie_id;
  const { movie_name, release_year, director, image_url, genres } = req.body;
  db.updateMovie({ movie_id, movie_name, release_year, director, image_url });
  await db.deleteMovieGenresByMovie(movie_id);
  genres.forEach((genre_id) => {
    console.log({ movie_id, genre_id });
    db.addMovieGenre({ movie_id, genre_id });
  });
  res.redirect('/');
};

exports.addGenreGet = (req, res) => {
  res.render('index', { partial: 'addGenre', title: 'Add Genre' });
};

exports.addGenrePost = (req, res) => {
  const { genre_name } = req.body;
  db.addGenre({ genre_name });
  res.redirect('/genres');
};

exports.getViewMovie = async (req, res) => {
  const movie_id = req.params.movie_id;
  console.log(movie_id);
  const movie = await db.getMovieWithGenreNames(movie_id);
  console.log(movie);
  res.render('index', {
    partial: 'viewMovie',
    title: 'Movie Details',
    movie: movie,
  });
};

exports.getMoviesByGenre = async (req, res) => {
  const genre_id = req.params.genre_id;
  const [genre, movies] = await Promise.all([
    db.getGenre(genre_id),
    db.getMoviesFromGenre(genre_id),
  ]);

  res.render('index', {
    partial: 'movieGrid',
    title: genre['genre_name'],
    movies: movies,
  });
};

exports.getGenreList = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render('index', {
    title: 'Genres',
    genres: genres,
    partial: 'genreList',
  });
};

exports.deleteMovieGet = async (req, res) => {
  const movie_id = req.params.movie_id;
  await db.deleteMovieGenresByMovie(movie_id);
  await db.deleteMovie(movie_id);
  res.redirect('/');
};

exports.updateGenreGet = async (req, res) => {
  const genre_id = req.params.genre_id;
  const genre = await db.getGenre(genre_id);
  console.log(genre);
  res.render('index', {
    partial: 'updateGenre',
    title: 'Update Genre',
    genre: genre,
  });
};

exports.updateGenrePost = async (req, res) => {
  const genre_id = req.params.genre_id;
  const { genre_name } = req.body;
  await db.updateGenre({ genre_id, genre_name });
  res.redirect('/genres');
};

exports.deleteGenreGet = async (req, res) => {
  const genre_id = req.params.genre_id;
  await db.deleteMovieGenresByGenre(genre_id);
  await db.deleteGenre(genre_id);
  res.redirect('/genres');
};
