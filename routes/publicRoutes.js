const express = require("express");
const router = express.Router();

const serviceController =
    require("../controllers/serviceController");

router.get(
    "/services",
    serviceController.getServices
);

const bookingController =
    require("../controllers/bookingController");

router.get(
    "/track-booking",
    bookingController.showTrackingPage
);

router.post(
    "/track-booking",
    bookingController.trackBooking
);

module.exports = router;