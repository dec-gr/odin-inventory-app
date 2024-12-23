const pool = require('./pool');

async function getAllMovies() {
  const { rows } = await pool.query('SELECT * FROM movies');
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
}

async function getGenre(genre_id) {
  const { rows } = await pool.query(
    `SELECT genre_name FROM genres WHERE genre_id = ($1)`,
    [genre_id]
  );
  return rows[0];
}

async function getAllDirectors() {
  const { rows } = await pool.query('SELECT * FROM directors');
  return rows;
}

async function addMovie({ movie_name, release_year, director_id }) {
  const movie_id = await pool.query(
    ' INSERT INTO movies (movie_name, release_year, director_id) VALUES ($1, $2, $3) RETURNING movie_id',
    [movie_name, release_year, director_id]
  );
  return movie_id;
}

async function getAllMoviesWithDirectors() {
  const { rows } = await pool.query(`
    SELECT *
      FROM movies
      LEFT JOIN directors
      ON directors.director_id = movies.director_id
    `);
  return rows;
}

function addMovieGenre({ movie_id, genre_id }) {
  pool.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)`, [
    movie_id,
    genre_id,
  ]);
}

async function getAllMoviesWithDirectorsAndGenreNames() {
  const { rows } = await pool.query(`
   SELECT m.movie_id, m.movie_name, m.release_year, d.director_name, d.director_id, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN directors AS d
ON m.director_id = d.director_id
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
GROUP BY m.movie_id, d.director_name, d.director_id
    `);

  return rows;
}

async function getMoviesWithDirectorsFromGenre(genre_id) {
  const { rows } = await pool.query(
    `
SELECT m.movie_id, m.movie_name, m.release_year, d.director_name, d.director_id, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN directors AS d
ON m.director_id = d.director_id
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
WHERE g.genre_id = ($1)
GROUP BY m.movie_id, d.director_name, d.director_id;
    `,
    [genre_id]
  );

  return rows;
}

async function getMovieWithDirectorsAndGenreNames(movie_id) {
  const { rows } = await pool.query(
    `
SELECT m.movie_id, m.movie_name, m.release_year, d.director_name, d.director_id, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN directors AS d
ON m.director_id = d.director_id
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
WHERE m.movie_id = ($1)
GROUP BY m.movie_id, d.director_name, d.director_id;
    `,
    [movie_id]
  );

  return rows[0];
}

function addDirector({ director_name }) {
  pool.query(' INSERT INTO directors (director_name) VALUES ($1) ', [
    director_name,
  ]);
}

function addGenre({ genre_name }) {
  pool.query(' INSERT INTO genres (genre_name) VALUES ($1) ', [genre_name]);
}

module.exports = {
  getAllMovies,
  addMovie,
  getAllGenres,
  getGenre,
  getAllDirectors,
  getAllMoviesWithDirectors,
  addMovieGenre,
  getAllMoviesWithDirectorsAndGenreNames,
  addDirector,
  addGenre,
  getMovieWithDirectorsAndGenreNames,
  getMoviesWithDirectorsFromGenre,
};

`
SELECT m.movie_id, m.movie_name, m.release_year, d.director_name, d.director_id, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN directors AS d
ON m.director_id = d.director_id
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
GROUP BY m.movie_id, d.director_name, d.director_id
`;

`
SELECT m.movie_id, m.movie_name, m.release_year, d.director_name, d.director_id, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN directors AS d
ON m.director_id = d.director_id
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
WHERE m.movie_id = 1
GROUP BY m.movie_id, d.director_name, d.director_id;
`;
