const { Router } = require('express');
const moviesController = require('../controllers/moviesController');
const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/addMovie', moviesController.addMovieGet);
moviesRouter.post('/addMovie', moviesController.addMoviePost);

module.exports = moviesRouter;
