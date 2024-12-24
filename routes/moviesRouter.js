const { Router } = require('express');
const moviesController = require('../controllers/moviesController');
const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/addMovie', moviesController.addMovieGet);
moviesRouter.post('/addMovie', moviesController.addMoviePost);
moviesRouter.get('/addGenre', moviesController.addGenreGet);
moviesRouter.post('/addGenre', moviesController.addGenrePost);
moviesRouter.get('/movies/:movie_id', moviesController.getViewMovie);
moviesRouter.get('/genres/:genre_id', moviesController.getMoviesByGenre);
moviesRouter.get('/genres', moviesController.getGenreList);

module.exports = moviesRouter;
