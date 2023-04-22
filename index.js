const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

const { check, validationResult } = require('express-validator');

// mongoose.connect('mongodb://localhost:27017/movieAPIdb', 
// { useNewUrlParser: true, 
//   useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');



app.use(express.static('public'));
//log requests to server
app.use(morgan('common'));



app.get('/', (req, res) => {
  res.send('Welcome to Movie app!!');
});


// This will return all movies.
//any request to the “movies” endpoint will require a JWT from the client.
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  // app.get('/movies', (req, res) => {
  Movies.find()
    .populate('GenreID')
    .populate('DirectorID')
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});



// Return a movie by name
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .populate('GenreID')
    .then((movie) => {
      res.json(movie);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});


// This will return all genres.
app.get('/genres', (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Return a genre by name
app.get('/genres/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// This will return all directors.
app.get('/directors', (req, res) => {
  Directors.find()
    .then((director) => {
      res.status(201).json(director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Return a genre by name
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// This will return a JSON object containing data about all users.
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .populate('FavoriteMovies')
    .then((user) => {

      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add new movies
app.post('/movies', (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((title) => {
      if (title) {
        return res.status(400).send(req.body.Title + ' already exist');
      } else {
        Movies.create({
          Title: req.body.Title,
          Description: req.body.Description,
          GenreID: req.body.GenreID,
          DirectorID: req.body.DirectorID,
          ImageURL: req.body.ImageURL,
          Featured: req.body.Featured
        }).then((title) => { res.status(201).json(title) }).catch((error => {
          console.error(error);
          res.status(500).send('Error:' + error);
        }))
      }
    });
});


//Add new Genre
app.post('/genres', (req, res) => {
  Genres.findOne({ Name: req.body.Name })
    .then((name) => {
      if (name) {
        return res.status(400).send(req.body.Name + ' already exist');
      } else {
        Genres.create({
          Name: req.body.Name,
          Description: req.body.Description
        }).then((name) => { res.status(201).json(name) }).catch((error => {
          console.error(error);
          res.status(500).send('Error:' + error);
        }))
      }
    });
});

//Add new Director
app.post('/directors', (req, res) => {
  Directors.findOne({ Name: req.body.Name })
    .then((name) => {
      if (name) {
        return res.status(400).send(req.body.Name + ' already exist');
      } else {
        Directors.create({
          Name: req.body.Name,
          Bio: req.body.Bio,
          DateofBirth: req.body.DateofBirth
        }).then((name) => { res.status(201).json(name) }).catch((error => {
          console.error(error);
          res.status(500).send('Error:' + error);
        }))
      }
    });
});


//Add new users
app.post('/users',
  [
    check('Username', 'Username is required.').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    //Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exist');
        } else {
          Users.create({
            Name: req.body.Name,
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            DateofBirth: req.body.DateofBirth,
            FavoriteMovies: req.body.FavoriteMovies
          }).then((user) => { res.status(201).json(user) }).catch((error => {
            console.error(error);
            res.status(500).send('Error:' + error);
          }))
        }
      })
      .catch((error => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      }));
  });

// Update user's info.
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Name: req.body.Name,
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      DateofBirth: req.body.DateofBirth
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Update movies's info.
app.put('/movies/:Title', (req, res) => {
  Movies.findOneAndUpdate({ Title: req.params.Title }, {
    $set:
    {
      Title: req.body.Title,
      Description: req.body.Description,
      DirectorID: req.body.DirectorID,
      GenreID: req.body.GenreID,
      ImageURL: req.body.ImageURL
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    });
});

// Update director's info.
app.put('/directors/:Name', (req, res) => {
  Directors.findOneAndUpdate({ Name: req.params.Name }, {
    $set:
    {
      Name: req.body.Name,
      Bio: req.body.Bio,
      DateofBirth: req.body.DateofBirth
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Delete a movie to a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


//Remove existing user
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' has been deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Remove existing movie
app.delete('/movies/:Title', (req, res) => {
  Movies.findOneAndRemove({ Title: req.params.Title })
    .then((title) => {
      if (!title) {
        res.status(400).send(req.params.Title + ' was not found');
      } else {
        res.status(200).send(req.params.Title + ' has been deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Remove existing genre
app.delete('/genres/:Name', (req, res) => {
  Genres.findOneAndRemove({ Name: req.params.Name })
    .then((name) => {
      if (!name) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' has been deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Remove existing genre
app.delete('/directors/:Name', (req, res) => {
  Directors.findOneAndRemove({ Name: req.params.Name })
    .then((name) => {
      if (!name) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' has been deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});