import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // mongoose.connect(process.env.MONGO_URI, {
    // });
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_Visitor_Managment_main",
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
}

export default connectDB;
