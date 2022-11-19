const express = require('express'),
      morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to Movie app!!');
  });

// This will return a JSON object containing data about top 10 movies.
app.get('/movies', (req, res) => {
    res.send('Here is top 10 movies.');
});



// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
//   });


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});