const db = require('../db/queries');
const { body, validationResult } = require('express-validator');
const isImageURL = require('image-url-validator').default;

const yearIntErr = 'must be an integer';
const yearLengthErr = 'must be 4 digits long';
const yearRangeErr = 'must be between 1800 and the current year';

const imageValidUrlErr = 'must be a valid URL';
const imageValidImageUrlErr = 'must be a valid URL of an image';

const validateMovie = [
  body('release_year')
    .trim()
    .isInt()
    .withMessage(`Release year ${yearIntErr}`)
    .isLength({ min: 4, max: 4 })
    .withMessage(`Release year ${yearLengthErr}`)
    .custom((value) => {
      return value >= 1800 && value <= new Date().getFullYear();
    })
    .withMessage(`Release year ${yearRangeErr}`),

  body('image_url')
    .isURL()
    .withMessage(`Image URLLL ${imageValidUrlErr}`)
    .custom(async (value) => {
      const isValidUrl = await isImageURL(value);
      if (!isValidUrl) {
        return Promise.reject();
      }
    })
    .withMessage(`Image URL ${imageValidImageUrlErr}`),
];

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

exports.addMoviePost = [
  validateMovie,

  async (req, res) => {
    console.log('Starting Validation');
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genres = await db.getAllGenres();

      return res.status(400).render('index', {
        errors: errors.array(),
        partial: 'addMovie',
        title: 'Add Movie',
        genres: genres,
      });
    }
    console.log(errors);
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
    if (genres) {
      genres.forEach((genre_id) => {
        console.log('HERE');
        console.log({ movie_id, genre_id });
        db.addMovieGenre({ movie_id, genre_id });
      });
    }

    res.redirect('/');
  },
];

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
