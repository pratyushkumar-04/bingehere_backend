import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGOOSE_STRING) {
            throw new Error("MONGOOSE_STRING is missing from .env file");
        }
        await mongoose.connect(process.env.MONGOOSE_STRING);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Connection Error:", err.message);
        process.exit(1); // Stop the server if DB fails
    }
};

export default connectDB;