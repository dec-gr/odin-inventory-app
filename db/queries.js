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
    `SELECT * FROM genres WHERE genre_id = ($1)`,
    [genre_id]
  );
  return rows[0];
}

async function getMovieGenres(movie_id) {
  const { rows } = await pool.query(
    `
    SELECT genre_id
    FROM movie_genres
    WHERE movie_id = ($1);
    `,
    [movie_id]
  );
  return rows;
}

async function addMovie({ movie_name, release_year, director, image_url }) {
  const movie_id = await pool.query(
    ' INSERT INTO movies (movie_name, release_year, director, image_url) VALUES ($1, $2, $3, $4) RETURNING movie_id',
    [movie_name, release_year, director, image_url]
  );
  return movie_id;
}

async function deleteMovie(movie_id) {
  pool.query(`DELETE FROM movies WHERE movie_id = ($1)`, [movie_id]);
}

async function deleteMovieGenresByMovie(movie_id) {
  await pool.query(
    `
    DELETE FROM movie_genres WHERE movie_id = ($1)`,
    [movie_id]
  );
}

async function updateMovie({
  movie_id,
  movie_name,
  release_year,
  director,
  image_url,
}) {
  pool.query(
    `
    UPDATE movies
    SET movie_name = ($2), release_year = ($3), director = ($4), image_url = ($5)
    WHERE movie_id = ($1)`,
    [movie_id, movie_name, release_year, director, image_url]
  );
}

function addMovieGenre({ movie_id, genre_id }) {
  pool.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)`, [
    movie_id,
    genre_id,
  ]);
}

async function getAllMoviesWithGenreNames() {
  console.log('HERE');
  const { rows } = await pool.query(`
   SELECT m.movie_id, m.movie_name, m.release_year, m.director, m.image_url, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
GROUP BY m.movie_id
    `);

  return rows;
}

async function getMoviesFromGenre(genre_id) {
  const { rows } = await pool.query(
    `
SELECT m.movie_id, m.movie_name, m.release_year, m.director, m.image_url, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
WHERE g.genre_id = ($1)
GROUP BY m.movie_id
    `,
    [genre_id]
  );

  return rows;
}

async function getMovieWithGenreNames(movie_id) {
  const { rows } = await pool.query(
    `
SELECT m.movie_id, m.movie_name, m.release_year, m.director, m.image_url, array_agg(g.genre_name) FILTER (WHERE g.genre_name IS NOT NULL) AS genres
FROM movies AS m
LEFT JOIN movie_genres AS mg
ON m.movie_id = mg.movie_id
LEFT JOIN genres AS g
ON g.genre_id = mg.genre_id
WHERE m.movie_id = ($1)
GROUP BY m.movie_id;
    `,
    [movie_id]
  );

  return rows[0];
}

function addGenre({ genre_name }) {
  pool.query(' INSERT INTO genres (genre_name) VALUES ($1) ', [genre_name]);
}

function updateGenre({ genre_id, genre_name }) {
  pool.query(
    ` 
    UPDATE genres
    SET genre_name = ($2)
    WHERE genre_id = ($1)`,
    [genre_id, genre_name]
  );
}

async function deleteMovieGenresByGenre(genre_id) {
  await pool.query(
    `
    DELETE FROM movie_genres WHERE genre_id = ($1)`,
    [genre_id]
  );
}

async function deleteGenre(genre_id) {
  await pool.query(
    `
    DELETE FROM genres WHERE genre_id = ($1)
    `,
    [genre_id]
  );
}
module.exports = {
  getAllMovies,
  addMovie,
  updateMovie,
  getAllGenres,
  getGenre,
  getMovieGenres,
  addMovieGenre,
  getAllMoviesWithGenreNames,
  addGenre,
  getMovieWithGenreNames,
  getMoviesFromGenre,
  deleteMovieGenresByMovie,
  deleteMovie,
  updateGenre,
  deleteMovieGenresByGenre,
  deleteGenre,
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
