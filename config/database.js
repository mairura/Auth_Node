const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Successfully connected to database.Yesss..🔥 ");
      })
      .catch((error) => {
        console.log("Database connection failed. Existing now...😦 ");
        console.error(error);
        process.exit(1);
      })
}