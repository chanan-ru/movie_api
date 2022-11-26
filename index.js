const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser')
      uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let users = [
    {
      id: 1,
      username: "James Todd",
      favoriteMovie: [ ]
    },
    {
      id: 2,
      username: "Emma",
      favoriteMovie: ["Black Panther"]
    }
]

let movies = [
  {
    "Title": "Black Panther",
    "Description": "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    "Genre": {
      "Name": "Action",
      "Description": "the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    "Director":{
      "Name": "Ryan Coogler",
      "Bio": "Ryan Kyle Coogler is an African-American filmmaker and producer who is from Oakland, California. He is known for directing the Black Panther film series, Creed, a Rocky spin-off and Fruitvale Station. He frequently casts Michael B. Jordan in his works. He produced the Creed sequels, Judas and the Black Messiah and Space Jam: A New Legacy. He is married to Zinzi since 2016.",
      "Birth": "May 23, 1986"
    },
    "imageURL": "https://www.imdb.com/title/tt1825683/mediaviewer/rm966220288/?ref_=tt_ov_i"

  },
  {
    "Title": "Avatarr",
    "Description": "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    "Genre": {
      "Name": "Fantasy",
      "Description": "a genre of speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore. Its roots are in oral traditions, which then became fantasy literature and drama."
    },
    "Director":{
      "Name": "James Cameron",
      "Bio": "James Francis Cameron CC is a Canadian filmmaker. He is known for making science fiction and epic films, and first gained recognition for writing and directing The Terminator (1984). Cameron found further success with Aliens (1986), The Abyss (1989), Terminator 2: Judgment Day (1991), and the action comedy True Lies (1994). He also wrote and directed Titanic (1997) and Avatar (2009), with Titanic earning him Academy Awards in Best Picture, Best Director and Best Film Editing. Avatar, filmed in 3D technology, earned him nominations in the same categories.",
      "Birth": "August 16, 1954"
    },
    "imageURL": "https://www.imdb.com/title/tt0499549/mediaviewer/rm371527425/?ref_=tt_ov_i"
  },

  {
    "Title": "Forrest Gump",
    "Description": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    "Genre": {
      "Name": "Drama",
      "Description": "drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone"
    },
    "Director":{
      "Name": "Robert Zemeckis",
      "Bio": "A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert's earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects.",
      "Birth": "May 14, 1952"
    },
    "imageURL": "https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i"

  },

  {
    "Title": "Inside Out",
    "Description": "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.",
    "Genre": {
      "Name": "Animation",
      "Description": "Animations are made with computer-generated imagery (CGI). Computer animation can be very detailed 3D animation, while 2D computer animation (which may have the look of traditional animation) can be used for stylistic reasons, low bandwidth, or faster real-time renderings. Other common animation methods apply a stop motion technique to two- and three-dimensional objects like paper cutouts, puppets, or clay figures."
    },
    "Director":{
      "Name": "Pete Docter",
      "Bio": "Pete Docter is the Oscar®-winning director of 'Monsters, Inc.,' 'Up,' and 'Inside Out,' and Chief Creative Officer at Pixar Animation Studios. He is currently directing Pixar's feature film 'Soul' with producer Dana Murray, which is set to release June 19, 2020.Starting at Pixar in 1990 as the studio's third animator, Docter collaborated and help develop the story and characters for 'Toy Story,' Pixar's first full-length animated feature film, for which he also was supervising animator. He served as a storyboard artist on 'A Bug's Life,' and wrote initial story treatments for both 'Toy Story 2' and 'WALL.E'.",
      "Birth": "October 9, 1968"
    },
    "imageURL": "https://www.imdb.com/title/tt2096673/mediaviewer/rm3662344960/?ref_=tt_ov_i"
  },

  {
    "Title": "Up",
    "Description": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.",
    "Genre": {
      "Name": "Animation",
      "Description": "Animations are made with computer-generated imagery (CGI). Computer animation can be very detailed 3D animation, while 2D computer animation (which may have the look of traditional animation) can be used for stylistic reasons, low bandwidth, or faster real-time renderings. Other common animation methods apply a stop motion technique to two- and three-dimensional objects like paper cutouts, puppets, or clay figures."
    },
    "Director":{
      "Name": "Pete Docter",
      "Bio": "Pete Docter is the Oscar®-winning director of 'Monsters, Inc.,' 'Up,' and 'Inside Out,' and Chief Creative Officer at Pixar Animation Studios. He is currently directing Pixar's feature film 'Soul' with producer Dana Murray, which is set to release June 19, 2020.Starting at Pixar in 1990 as the studio's third animator, Docter collaborated and help develop the story and characters for 'Toy Story,' Pixar's first full-length animated feature film, for which he also was supervising animator. He served as a storyboard artist on 'A Bug's Life,' and wrote initial story treatments for both 'Toy Story 2' and 'WALL.E'.",
      "Birth": "October 9, 1968"
    },
    "imageURL": "https://www.imdb.com/title/tt1049413/mediaviewer/rm2582959360/?ref_=tt_ov_i"
  },

  {
    "Title": "Top Gun: Maverick",
    "Description": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    "Genre": {
      "Name": "Action",
      "Description": "the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    "Director":{
      "Name": "Joseph Kosinski",
      "Bio": "Joseph Kosinski is a director whose uncompromising style has quickly made a mark in the filmmaking zeitgeist. His feature film debut, 'Tron: Legacy' for Walt Disney Studios, grossed over $400 million worldwide and was nominated for several awards, including an Academy Award for Sound Editing and a Grammy for the score by Daft Punk.",
      "Birth": "May 3, 1974"
    },
    "imageURL": "https://www.imdb.com/title/tt1745960/mediaviewer/rm3294367489/?ref_=tt_ov_i"
  },

  {
    "Title": "Joker",
    "Description": "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
    "Genre": {
      "Name": "Crime",
      "Description": "Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film,[1] but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir."
    },
    "Director":{
      "Name": "Todd Phillips",
      "Bio": "Todd Phillips is an American filmmaker and actor who got his start by directing the comedy films Road Trip and Old School, the earlier inspired EuroTrip. He also directed Starsky & Hutch, The Hangover trilogy, Due Date, War Dogs and School for Scoundrels. Phillips directed Joker, a Taxi Driver style film set in the universe of Batman and starring Joaquin Phoenix. Joker is the highest grossing R-rated film of all time.",
      "Birth": "December 20, 1970"
    },
    "imageURL": "https://www.imdb.com/title/tt7286456/mediaviewer/rm1850840833/?ref_=tt_ov_i"
  },

  {
    "Title": "WALL·E",
    "Description": "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    "Genre": {
      "Name": "Animation",
      "Description": "Animations are made with computer-generated imagery (CGI). Computer animation can be very detailed 3D animation, while 2D computer animation (which may have the look of traditional animation) can be used for stylistic reasons, low bandwidth, or faster real-time renderings. Other common animation methods apply a stop motion technique to two- and three-dimensional objects like paper cutouts, puppets, or clay figures."
    },
    "Director":{
      "Name": "Andrew Stanton",
      "Bio": "Andrew Stanton has been a major creative force at Pixar Animation Studios since 1990, when he became the second animator and ninth employee to join the company's elite group of computer animation pioneers. As Vice President, Creative he currently oversees all shorts and feature projects at the studio. Stanton wrote and directed the Academy Award®-winning Disney and Pixar feature film WALL.E, for which he also received a Best Original Screenplay Oscar®-nomination. In 2016 Stanton directed Disney and Pixar's Finding Dory, which, upon release, became the highest-grossing domestic animated feature of all time and in 2019 Stanton served as screenwriter and executive producer of Toy Story 4.",
      "Birth": "December 3, 1965"
    },
    "imageURL": "https://www.imdb.com/title/tt0910970/mediaviewer/rm1659211008/?ref_=tt_ov_i"
  },

  {
    "Title": "Hamilton",
    "Description": "The real life of one of America's foremost founding fathers and first Secretary of the Treasury, Alexander Hamilton. Captured live on Broadway from the Richard Rodgers Theater with the original Broadway cast.",
    "Genre": {
      "Name": "Biography",
      "Description": "Is a film that dramatizes the life of a non-fictional or historically-based person or people. Such films show the life of a historical person and the central character's real name is used.[2] They differ from docudrama films and historical drama films in that they attempt to comprehensively tell a single person's life story or at least the most historically important years of their lives."
    },
    "Director":{
      "Name": "Thomas Kail",
      "Bio": "Thomas Kail is an American theatre director, known for directing the Off-Broadway and Broadway productions of Lin-Manuel Miranda's musicals In the Heights[2] and Hamilton, garnering the 2016 Tony Award for Best Direction of a Musical for the latter. Kail was awarded the Kennedy Center Honor in 2018.",
      "Birth": "January 30, 1978"
    },
    "imageURL": "https://www.imdb.com/title/tt8503618/mediaviewer/rm1749789441/?ref_=tt_ov_i"
  },
]


app.use(express.static('public'));
app.use(morgan('common'));



app.get('/', (req, res) => {
    res.send('Welcome to Movie app!!');
});

//Add new users
app.post('/users', (req, res) => {
  const newUser = req.body;

  if(newUser.username){
    newUser.id = uuid.v4();

    users.push(newUser);

    res.status(200).json(newUser);

  }else{
    res.status(400).send('User needs a name');
  }
});

// This will return a JSON object containing data about all users.
app.get('/users', (req, res) => {
  res.status(200).json(users);
});
  
// This will return a JSON object containing data about top 10 movies.
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// Return a movie by name
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);
  if(movie){
    res.status(200).json(movie);
  } else{
    res.status(400).send('There is no the movie!')
  }
});

//Return data about a genre by title
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;
  if(genre){
    res.status(200).json(genre);
  } else{
    res.status(400).send('There is no genre!')
  }
});

//Return data about a director by name
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;
  if(director){
    res.status(200).json(director);
  } else{
    res.status(400).send('There is no director!')
  }
});

//Update user's info
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if(user){
    user.username = updatedUser.username;
    res.status(200).json(users);

  }else{
    res.status(400).send('Updates incompletetd');
  }
});

//Add a movie to favorite list
app.put('/users/:id/:favoriteMovie', (req, res) => {
  const { id, favoriteMovie } = req.params;

  const user = users.find(user => user.id == id);

  if(user){
    user.favoriteMovie.push(favoriteMovie);
    res.status(200).json(user);
    //res.status(200).send( favoriteMovie + ' has been added to your favorite movies.');

  }else{
    res.status(400).send('Updates incompletetd');
  }
});

//Remove a movie from favorite list
app.delete('/users/:id/:favoriteMovie', (req, res) => {
  const { id, favoriteMovie } = req.params;

  const user = users.find(user => user.id == id);

  if(user){
    user.favoriteMovie = user.favoriteMovie.filter(title => title !== favoriteMovie );
    res.status(200).json(user);
    //res.status(200).send( favoriteMovie + ' has been deleted from your favorite movies.');

  }else{
    res.status(400).send('Updates incompletetd');
  }
});

//Remove existing user
app.delete('/users/:id', (req, res) => {
  let { id } = req.params;

  let user = users.find(user => user.id == id);

  if(user){
    users = users.filter(user => user.id != id );
    res.status(200).json(users);
    //res.status(200).send( favoriteMovie + ' has been added to your favorite movies.');

  }else{
    res.status(400).send('Updates incompletetd');
  }
});



app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});