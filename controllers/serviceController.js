const db = require("../config/firebase");

exports.getServices = async (req, res) => {

    try {

        const snapshot = await db.collection("services").get();

        let services = [];

        snapshot.forEach(doc => {

            services.push({
                id: doc.id,
                ...doc.data()
            });

        });

        res.render("services", {
            services
        });

    } catch (error) {

        console.log(error);
        res.send("Unable to load services");
    }

};