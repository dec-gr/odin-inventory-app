const db = require('../db/queries');

exports.moviesListGet = async (req, res) => {
  const movies = await db.getAllMovies();
  res.render('index', {
    title: 'Movie List',
    movies: movies,
  });
};

exports.addMovieGet = (req, res) => {
  res.render('addMovie', {
    title: 'Add Movie',
  });
};

exports.addMoviePost = async (req, res) => {
  const { movie_name, release_year, director } = req.body;
  db.addMovie({ movie_name, release_year, director });
  res.redirect('/');
};
