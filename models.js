const mongoose = require('mongoose');
const uuid = require('uuid');
const bcrypt = require('bcrypt');


//The schema has been defined for documents in the “Movies” collection
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    GenreID: {type: mongoose.Schema.Types.ObjectID, ref: 'Genre'},
    DirectorID: {type: mongoose.Schema.Types.ObjectID, ref: 'Director'},
    ImageURL: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    DateofBirth: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectID, ref: 'Movie' }],
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password)
}

let directorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: String,
    DateofBirth: Date
});

let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
});

// This will create collections called “db.movies”, “db.users”, "db.directors", and "db.genre".
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

//Exporting the Models
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;