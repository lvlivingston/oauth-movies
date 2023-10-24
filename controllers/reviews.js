const Movie = require('../models/movie');

module.exports = {
  create,
  show,
  update: updateReview,
  delete: deleteReview
};

function show(req, res) {
  //find data
  Movie.findOne({
    'reviews._id': req.params.id,
    'reviews.user': req.user._id
  })
  .then(function(movie) {
    if (!movie) return res.redirect('/movies');
    const reviewToUpdate = movie.reviews.find(review => review._id.toString() === req.params.id);
    // console.log(reviewToUpdate);
    res.render('movies/update', {title: 'Update Movie Review', reviewToUpdate});
  }) 
}

function updateReview(req, res, next) {
  // Note the cool "dot" syntax to query for a movie with a review nested within the array
  Movie.findOne({
    'reviews._id': req.params.id,
    'reviews.user': req.user._id
  }).then(function(movie) {
    if (!movie) return res.redirect('/movies');
    const reviewToUpdate = movie.reviews.find(review => review._id.toString() === req.params.id);
    if (!reviewToUpdate) return res.redirect(`/movies/${movie._id}`);
    reviewToUpdate.content = req.body.content;
    movie.save().then(function() {
      res.redirect(`/movies/${movie._id}`);
    }).catch(function(err) {
      return next(err);
    });
  });
}

function deleteReview(req, res, next) {
  // Note the cool "dot" syntax to query for a movie with a review nested within the array
  Movie.findOne({
    'reviews._id': req.params.id,
    'reviews.user': req.user._id
  }).then(function(movie) {
    if (!movie) return res.redirect('/movies');
    movie.reviews.remove(req.params.id);
    movie.save().then(function() {
      res.redirect(`/movies/${movie._id}`);
    }).catch(function(err) {
      return next(err);
    });
  });
}

async function create(req, res) {
  const movie = await Movie.findById(req.params.id);
  // We need these before the push.... to add the user-centric info to req.body in the push (the new review)
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;  
  // We can push (or unshift) subdocs into Mongoose arrays
  movie.reviews.push(req.body);
  try {
    // Save any changes made to the movie doc
    await movie.save();
  } catch (err) {
    console.log(err);
  }
  // Step 5:  Respond to the Request (redirect if data has been changed)
  res.redirect(`/movies/${movie._id}`);
}