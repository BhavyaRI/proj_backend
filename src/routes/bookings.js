const express = require('express');
const bookingController = require('./../controller/bookingcontroller');

const router = express.Router();

router.get('/', bookingController.getBookings);
router.post('/', bookingController.bookslot);
router.get('/venue/:venue', bookingController.getVenueDetails);

module.exports = router;