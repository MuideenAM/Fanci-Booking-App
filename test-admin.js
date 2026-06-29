const admin = require("firebase-admin");

console.log(admin);
console.log("credential:", admin.credential);
console.log("cert:", admin.cert);
console.log("getApps:", admin.getApps);
console.log("initializeApp:", admin.initializeApp);