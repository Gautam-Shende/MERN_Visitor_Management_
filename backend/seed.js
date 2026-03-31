import dotenv from "dotenv"
// import express from "express"
// import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import connectDB from "../config/db.js"
import User from "../models/User.js"

dotenv.config()

const users = [
  {
    name: "Admin User",
    email: "admin@mail.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Employee User",
    email: "employee@mail.com",
    password: "employee123",
    role: "employee",
  },
  {
    name: "Security User",
    email: "security@mail.com",
    password: "security123",
    role: "security",
  },
]

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}


const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    console.log("Existing users removed");

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    )

    const createdUsers = await User.insertMany(hashedUsers);

    console.log("✅ Users Seeded Successfully:");
    createdUsers.forEach((u) => {
      console.log(`- ${u.name} (${u.email}) → ${u.role}`);
    });

    process.exit();
  } catch (error) {
    console.error("Seeding Failed:", error.message);
    process.exit(1);
  }
}

importData();

// const destroyData = async () => {
//   try {
//     await connectDB();

//     await User.deleteMany();
//     console.log("All users deleted");

//     process.exit();
//   } catch (error) {
//     console.error("Delete Failed:", error.message);
//     process.exit(1);
//   }
// }

// if (process.argv[2] === "-d") {
//   destroyData();
// } else {
//   importData();
// }