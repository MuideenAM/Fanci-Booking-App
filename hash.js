const bcrypt = require("bcrypt");

async function hashPassword() {

    const hashed =
        await bcrypt.hash(
            "admin123",
            10
        );

    console.log(hashed);
}

hashPassword();