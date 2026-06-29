const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

require("dotenv").config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,

        // Only use HTTPS cookies in production
        secure: process.env.NODE_ENV === "production",

        sameSite: "strict"
    }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const publicRoutes = require("./routes/publicRoutes");
const adminRoutes =
    require("./routes/adminRoutes");
const bookingRoutes =
    require("./routes/bookingRoutes");

app.use("/", publicRoutes);
app.use("/admin", adminRoutes);
app.use("/", bookingRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});