#! /usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const SQL = `


CREATE TABLE IF NOT EXISTS genres (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre_name TEXT
);



CREATE TABLE IF NOT EXISTS movies (
    movie_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name TEXT,
    release_year INT,
    director TEXT,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id INT,
  genre_id INT,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
  FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

INSERT INTO genres (genre_name)
VALUES
    ('Drama'),
    ('Sci-Fi'),
    ('Animated');



INSERT INTO movies (movie_name, release_year, director, image_url)
VALUES
    ('Forrest Gump', 1994, 'Robert Zemeckis', 'https://resizing.flixster.com/hqcqFfWf1syt2OrGlbW7LDvfj9Y=/fit-in/352x330/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p15829_v_v13_aa.jpg'),
    ('Interstellar', 2014, 'Christopher Nolan', 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg'),
    ('Spirited Away', 2001, 'Hayao Miyazaki' , 'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg');

INSERT INTO movie_genres (movie_id, genre_id)
VALUES
    (1,1),
    (2,2),
    (3,3);    
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
