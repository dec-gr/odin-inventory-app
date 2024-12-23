const { Router } = require('express');
const moviesController = require('../controllers/moviesController');
const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/addMovie', moviesController.addMovieGet);
moviesRouter.post('/addMovie', moviesController.addMoviePost);
moviesRouter.get('/addDirector', moviesController.addDirectorGet);
moviesRouter.post('/addDirector', moviesController.addDirectorPost);
moviesRouter.get('/addGenre', moviesController.addGenreGet);
moviesRouter.post('/addGenre', moviesController.addGenrePost);
moviesRouter.get('/movies/:movie_id', moviesController.getViewMovie);

module.exports = moviesRouter;
