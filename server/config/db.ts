import mongoose from "mongoose";
import colors from "colors";

const dburl: string = process.env.MONGO_URL || "";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dburl);
    console.log(`Mongodb Connected ${mongoose.connection.host}`.bgGreen.black);
  } catch (error: any) {
    console.log(`Mongodb Server Issue ${error}`.bgRed.black);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
