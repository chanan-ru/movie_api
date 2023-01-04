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

mongoose.connect('mongodb://localhost:27017/movieAPIdb', 
{ useNewUrlParser: true, 
  useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  Movies.find()
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
  }).catch((err) =>{
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
  }).catch((err) =>{
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
  }).catch((err) =>{
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
      
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});




//Add new users
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) =>{ 
    if (user) {
        return res.status(400).send(req.body.Username + 'already exist');
      }else{
        Users.create({
          Name: req.body.Name,
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          DateofBirth: req.body.Date,
          FavoriteMovies: req.body.FavoriteMovies
        }).then((user) => {res.status(201).json(user)}).catch((error => {
          console.error(error);
          res.status(500).send('Error:' + error);
        }))
      }
    });
});

// Update user's info.
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Name: req.body.Name,
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
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
    if(!user){
      res.status(400).send(req.params.Username + ' was not found');
    }else{
      res.status(200).send(req.params.Username + ' has been deleted');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});



app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});