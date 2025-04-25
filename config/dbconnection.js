const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://malaviyapunam3:punam123@cluster0.nsfj2.mongodb.net/admin-panel');

        console.log('MongoDB Connected');
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
module.exports = connectDB();

