const express = require('express');
const app = express();
const moviesRouter = require('./routes/moviesRouter');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/', moviesRouter);

const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Express app running on port ${PORT}`));
