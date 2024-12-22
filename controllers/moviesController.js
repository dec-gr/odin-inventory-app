const db = require('../db/queries');

exports.moviesListGet = async (req, res) => {
  const movies = await db.getAllMoviesWithDirectorsAndGenreNames();
  res.render('index', {
    title: 'Movie List',
    movies: movies,
  });
};

exports.addMovieGet = async (req, res) => {
  const [genres, directors] = await Promise.all([
    db.getAllGenres(),
    db.getAllDirectors(),
  ]);
  console.log(genres);
  console.log(directors);

  genres.forEach((genre) => {
    console.log(genre.genre_id);
    console.log(genre.genre_name);
  });

  res.render('addMovie', {
    title: 'Add Movie',
    genres: genres,
    directors: directors,
  });
};

exports.addMoviePost = async (req, res) => {
  console.log(req.body);
  const { movie_name, release_year, director_id, genres } = req.body;
  const movie_result = await db.addMovie({
    movie_name,
    release_year,
    director_id,
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

exports.addDirectorGet = (req, res) => {
  res.render('addDirector', { title: 'Add Director' });
};

exports.addDirectorPost = (req, res) => {
  const { director_name } = req.body;
  db.addDirector({ director_name });
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
