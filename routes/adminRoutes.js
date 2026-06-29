const express = require("express");
const router = express.Router();
const adminController =
    require("../controllers/adminController");
const auth =
    require("../middleware/authMiddleware");


router.get("/login", (req, res) => {
    res.render("admin/login");
});

router.get(
    "/dashboard",
    auth.isAuthenticated,
    adminController.showDashboard
);

router.get(
    "/add-service",
    auth.isAuthenticated,
    adminController.showAddService
);

router.post(
    "/add-service",
    auth.isAuthenticated,
    adminController.addService
);

router.post(
    "/delete-service/:id",
    auth.isAuthenticated,
    adminController.deleteService
);

router.get(
    "/edit-service/:id",
    auth.isAuthenticated,
    adminController.showEditService
);

router.post(
    "/edit-service/:id",
    auth.isAuthenticated,
    adminController.updateService
);

router.get(
    "/bookings",
    auth.isAuthenticated,
    adminController.showBookings
);

router.post(
    "/update-booking-status/:id",
    auth.isAuthenticated,
    adminController.updateBookingStatus
);

router.get(
    "/payment-settings",
    auth.isAuthenticated,
    adminController.showPaymentSettings
);

router.post(
    "/payment-settings",
    auth.isAuthenticated,
    adminController.savePaymentSettings
);

router.get(
    "/availability",
    auth.isAuthenticated,
    adminController.showAvailabilitySettings
);

router.post(
    "/availability",
    auth.isAuthenticated,
    adminController.saveAvailabilitySettings
);

router.get(
    "/login",
    adminController.showLogin
);

router.post(
    "/login",
    adminController.login
);

router.get(
    "/logout",
    adminController.logout
);

module.exports = router;