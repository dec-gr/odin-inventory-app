#! /usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const SQL = `

CREATE TABLE IF NOT EXISTS directors (
  director_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  director_name TEXT
);

CREATE TABLE IF NOT EXISTS genres (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre_name TEXT
);



CREATE TABLE IF NOT EXISTS movies (
    movie_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name TEXT,
    release_year INT,
    director_id INT,
    FOREIGN KEY(director_id) REFERENCES  directors(director_id)
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

INSERT INTO directors (director_name) 
VALUES 
    ('Robert Zemeckis'), 
    ('Christopher Nolan'), 
    ('Hayao Miyazaki');

INSERT INTO movies (movie_name, release_year, director_id)
VALUES
    ('Forrest Gump', 1994, 1),
    ('Interstellar', 2014, 2),
    ('Spirited Away', 2001, 3);

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
