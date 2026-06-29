const db = require("../config/firebase");
const bcrypt = require("bcrypt");

exports.showLogin = (req, res) => {

    res.render("admin/login");

};


exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const snapshot = await db
            .collection("admins")
            .where("email", "==", email)
            .get();

        console.log(
            "Number of matching admins:",
            snapshot.size
        );

        if (snapshot.empty) {

            return res.render(
                "admin/login",
                {
                    error: "Invalid credentials"
                }
            );

        }

        let adminUser;

        snapshot.forEach(doc => {

            adminUser = {
                id: doc.id,
                ...doc.data()
            };

        });

        // Debugging
        console.log("Admin found:", adminUser);
        console.log("Entered password:", password);
        console.log(
            "Stored hash:",
            adminUser.password
        );

        const valid = await bcrypt.compare(
            password,
            adminUser.password
        );

        console.log(
            "Password valid:",
            valid
        );

        if (!valid) {

            return res.render(
                "admin/login",
                {
                    error: "Invalid credentials"
                }
            );

        }

        req.session.admin = {
            id: adminUser.id,
            email: adminUser.email
        };

        console.log("Session after login:");
        console.log(req.session);

        res.redirect("/admin/dashboard");

    } catch (error) {

        console.log(error);
        res.send("Login failed");

    }

};


exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect(
            "/admin/login"
        );

    });

};

exports.showAddService = (req, res) => {
    res.render("admin/add-service");
};

exports.addService = async (req, res) => {

    try {

        const {
            name,
            category,
            description,
            price,
            duration
        } = req.body;

        await db.collection("services").add({
            name,
            category,
            description,
            price: Number(price),
            duration,
            createdAt: new Date()
        });

        res.redirect("/admin/dashboard");

    } catch (error) {

        console.log(error);
        res.send("Error saving service");
    }
};


exports.showDashboard = async (req, res) => {

    try {

        const snapshot =
            await db.collection("services").get();

        let services = [];

        snapshot.forEach(doc => {

            services.push({
                id: doc.id,
                ...doc.data()
            });

        });

        res.render("admin/dashboard", {
            services
        });

    } catch (error) {

        console.log(error);
        res.send("Error loading dashboard");
    }
};


exports.deleteService = async (req, res) => {

    try {

        const id = req.params.id;

        await db
            .collection("services")
            .doc(id)
            .delete();

        res.redirect("/admin/dashboard");

    } catch (error) {

        console.log(error);

        res.send("Error deleting service");
    }
};


exports.showEditService = async (req, res) => {

    try {

        const id = req.params.id;

        const doc = await db
            .collection("services")
            .doc(id)
            .get();

        if (!doc.exists) {
            return res.send("Service not found");
        }

        const service = {
            id: doc.id,
            ...doc.data()
        };

        res.render("admin/edit-service", {
            service
        });

    } catch (error) {

        console.log(error);

        res.send("Error loading service");
    }
};


exports.updateService = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            name,
            category,
            description,
            price,
            duration
        } = req.body;

        await db
            .collection("services")
            .doc(id)
            .update({

                name,
                category,
                description,
                price: Number(price),
                duration,
                updatedAt: new Date()

            });

        res.redirect("/admin/dashboard");

    } catch (error) {

        console.log(error);

        res.send("Error updating service");
    }
};


exports.showBookings = async (req, res) => {

    try {

        const snapshot = await db
            .collection("bookings")
            .orderBy("createdAt", "desc")
            .get();

        let bookings = [];

        snapshot.forEach(doc => {

            bookings.push({
                id: doc.id,
                ...doc.data()
            });

        });

        res.render(
            "admin/bookings",
            { bookings }
        );

    } catch (error) {

        console.log(error);

        res.send("Error loading bookings");
    }

};


exports.updateBookingStatus = async (req, res) => {

    try {

        const id = req.params.id;

        const status = req.body.status;

        await db
            .collection("bookings")
            .doc(id)
            .update({
                status
            });

        res.redirect("/admin/bookings");

    } catch (error) {

        console.log(error);

        res.send("Error updating booking");
    }

};


exports.showPaymentSettings = async (req, res) => {

    try {

        const doc = await db
            .collection("settings")
            .doc("payment")
            .get();

        let settings = {};

        if (doc.exists) {
            settings = doc.data();
        }

        res.render(
            "admin/payment-settings",
            { settings }
        );

    } catch (error) {

        console.log(error);

        res.send("Error loading settings");
    }

};


exports.savePaymentSettings = async (req, res) => {

    try {

        await db
            .collection("settings")
            .doc("payment")
            .set(req.body);

        res.redirect(
            "/admin/payment-settings"
        );

    } catch (error) {

        console.log(error);

        res.send("Error saving settings");
    }

};



exports.showAvailabilitySettings = async (req, res) => {

    try {

        const doc = await db
            .collection("settings")
            .doc("availability")
            .get();

        let settings = {};

        if (doc.exists) {
            settings = doc.data();
        }

        res.render(
            "admin/availability-settings",
            { settings }
        );

    } catch (error) {

        console.log(error);

        res.send("Error loading availability settings");
    }

};


exports.saveAvailabilitySettings = async (req, res) => {

    try {

        let { workingDays } = req.body;

        if (!workingDays) {
            workingDays = [];
        }

        if (!Array.isArray(workingDays)) {
            workingDays = [workingDays];
        }

        let blockedDates = req.body.blockedDates || [];

        if (!Array.isArray(blockedDates)) {
            blockedDates = [blockedDates];
        }

        const {
            openingTime,
            closingTime
        } = req.body;

        await db
            .collection("settings")
            .doc("availability")
            .set({

                workingDays,
                openingTime,
                closingTime,
                blockedDates

            });

        res.redirect(
            "/admin/availability"
        );

    } catch (error) {

        console.log(error);

        res.send("Error saving settings");
    }

};