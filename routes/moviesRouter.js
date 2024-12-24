const { Router } = require('express');
const moviesController = require('../controllers/moviesController');
const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/addMovie', moviesController.addMovieGet);
moviesRouter.post('/addMovie', moviesController.addMoviePost);
moviesRouter.get('/addGenre', moviesController.addGenreGet);
moviesRouter.post('/addGenre', moviesController.addGenrePost);
moviesRouter.get('/movies/:movie_id', moviesController.getViewMovie);
moviesRouter.get('/movies/:movie_id/update', moviesController.updateMovieGet);
moviesRouter.post('/movies/:movie_id/update', moviesController.updateMoviePost);

moviesRouter.get('/movies/:movie_id/delete', moviesController.deleteMovieGet);

moviesRouter.get('/genres/:genre_id', moviesController.getMoviesByGenre);
moviesRouter.get('/genres/:genre_id/update', moviesController.updateGenreGet);
moviesRouter.post('/genres/:genre_id/update', moviesController.updateGenrePost);
moviesRouter.get('/genres/:genre_id/delete', moviesController.deleteGenreGet);

moviesRouter.get('/genres', moviesController.getGenreList);

module.exports = moviesRouter;
