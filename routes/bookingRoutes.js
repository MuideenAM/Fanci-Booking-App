const express = require("express");
const router = express.Router();

const bookingController =
    require("../controllers/bookingController");

router.get(
    "/book/:id",
    bookingController.showBookingForm
);

router.post(
    "/book/:id",
    bookingController.createBooking
);

module.exports = router;