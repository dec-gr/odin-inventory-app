#! /usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name TEXT,
    release_year INT,
    director TEXT
);

INSERT INTO movies (movie_name, release_year, director)
VALUES
    ('Forrest Gump', 1994, 'Robert Zemeckis'),
    ('Interstellar', 2014, 'Christopher Nolan'),
    ('Spirited Away', 2001, 'Hayao Miyazaki');
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
