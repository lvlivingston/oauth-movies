const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// POST /movies/:id/reviews (create review for a movie)
router.post('/movies/:id/reviews', ensureLoggedIn, reviewsCtrl.create);
// DELETE /reviews/:id (delete review on a movie)
router.delete('/reviews/:id', ensureLoggedIn, reviewsCtrl.delete);

//GET /reviews/:id/update (going to the update page)
router.get('/reviews/:id/update', ensureLoggedIn, reviewsCtrl.show);
// UPDATE /reviews/:id (update review on a movie)
router.put('/reviews/:id', ensureLoggedIn, reviewsCtrl.update);

module.exports = router;