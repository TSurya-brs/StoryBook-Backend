import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected to ${connect.connection.host}`);
  } catch (error) {
    console.log("Connection error ", error);
    process.exit(1);
  }
};
export default connectdb;
