const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("***..Mongo DB connected successfully.. ****");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

module.exports = { connectDB };