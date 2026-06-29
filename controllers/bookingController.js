const db = require("../config/firebase");

exports.showBookingForm = async (req, res) => {

    try {

        const id = req.params.id;

        // Fetch service
        const serviceDoc = await db
            .collection("services")
            .doc(id)
            .get();

        if (!serviceDoc.exists) {
            return res.send("Service not found");
        }

        const service = {
            id: serviceDoc.id,
            ...serviceDoc.data()
        };

        // Fetch availability settings
        const availabilityDoc = await db
            .collection("settings")
            .doc("availability")
            .get();

        let availability = {
            workingDays: [],
            openingTime: "09:00",
            closingTime: "18:00"
        };

        if (availabilityDoc.exists) {
            availability = availabilityDoc.data();
        }

        // Generate time slots
        let timeSlots = [];

        let openingHour =
            parseInt(availability.openingTime.split(":")[0]);

        let closingHour =
            parseInt(availability.closingTime.split(":")[0]);

        for (
            let hour = openingHour;
            hour <= closingHour;
            hour++
        ) {

            let slot =
                hour.toString().padStart(2, "0") + ":00";

            timeSlots.push(slot);
        }

        res.render(
            "book-service",
            {
                service,
                availability,
                timeSlots
            }
        );

    } catch (error) {

        console.log(error);
        res.send("Error loading booking page");
    }

};


exports.createBooking = async (req, res) => {

    try {

        const id = req.params.id;

        const serviceDoc = await db
            .collection("services")
            .doc(id)
            .get();

        const service = serviceDoc.data();

        const {
            customerName,
            email,
            phone,
            date,
            time,
            paymentMethod,
            notes
        } = req.body;

        const availabilityDoc = await db
            .collection("settings")
            .doc("availability")
            .get();

        if (availabilityDoc.exists) {

            const availability =
                availabilityDoc.data();

            if (
                availability.blockedDates &&
                availability.blockedDates.includes(date)
            ) {

                return res.send(
                    "This date is unavailable for booking."
                );

            }

            const days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];

            const selectedDay =
                days[new Date(date).getDay()];

            if (
                !availability.workingDays.includes(
                    selectedDay
                )
            ) {

                return res.send(
                    "Bookings are not available on " +
                    selectedDay
                );
            }

        }

        const bookingRef =
            "FANCI-" + Date.now();

        await db.collection("bookings").add({

            bookingRef,

            customerName,
            email,
            phone,

            serviceId: id,
            serviceName: service.name,

            date,
            time,

            paymentMethod,

            notes,

            status: "Pending",

            createdAt: new Date()

        });

        const settingsDoc = await db
            .collection("settings")
            .doc("payment")
            .get();

        let paymentInstructions = "";

        if (settingsDoc.exists) {

            const settings = settingsDoc.data();

            switch (paymentMethod) {

                case "PayPal":
                    paymentInstructions = settings.paypal;
                    break;

                case "Venmo":
                    paymentInstructions = settings.venmo;
                    break;

                case "Chime":
                    paymentInstructions = settings.chime;
                    break;

                case "Zelle":
                    paymentInstructions = settings.zelle;
                    break;

                case "Apple Pay":
                    paymentInstructions = settings.applePay;
                    break;

                case "Crypto":
                    paymentInstructions = settings.crypto;
                    break;

                case "Gift Card":
                    paymentInstructions = settings.giftCard;
                    break;
            }
        }

        res.render("booking-success", {
            bookingRef,
            serviceName: service.name,
            date,
            time,
            paymentMethod,
            paymentInstructions
        });

    } catch (error) {

        console.log(error);

        res.send("Error creating booking");
    }

};



exports.showTrackingPage = (req, res) => {

    res.render(
        "track-booking",
        {
            booking: null,
            error: null
        }
    );

};


exports.trackBooking = async (req, res) => {

    try {

        const { bookingRef } =
            req.body;

        const snapshot =
            await db.collection("bookings")
            .where(
                "bookingRef",
                "==",
                bookingRef
            )
            .get();

        if (snapshot.empty) {

            return res.render(
                "track-booking",
                {
                    booking: null,
                    error:
                    "Booking not found"
                }
            );

        }

        let booking;

        snapshot.forEach(doc => {

            booking = {
                id: doc.id,
                ...doc.data()
            };

        });

        res.render(
            "track-booking",
            {
                booking,
                error: null
            }
        );

    } catch (error) {

        console.log(error);

        res.send(
            "Error tracking booking"
        );
    }

};