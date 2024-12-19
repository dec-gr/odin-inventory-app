const pool = require('./pool');

async function getAllMovies() {
  const { rows } = await pool.query('SELECT * FROM movies');
  return rows;
}

async function addMovie({ movie_name, release_year, director }) {
  await pool.query(
    ' INSERT INTO movies (movie_name, release_year, director) VALUES ($1, $2, $3)',
    [movie_name, release_year, director]
  );
}

module.exports = {
  getAllMovies,
  addMovie,
};
