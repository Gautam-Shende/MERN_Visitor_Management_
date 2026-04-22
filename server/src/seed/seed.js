
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/database/db.js";
import User from "../models/User.js";
import Visitor from "../models/Visitor.js";

dotenv.config();

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
];

const visitors = [
  {
    name: "Rahul Sharma",
    email: "rahul@mail.com",
    phone: "9876543210",
    password: "rahul123",
  },
  {
    name: "Priya Patel",
    email: "priya@mail.com",
    phone: "9876543211",
    password: "priya123",
  },
];


const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
};


const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Visitor.deleteMany(),
    ])

    console.log("🧹 Old users and visitors cleared");

    const preparedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await hashPassword(u.password),
      }))
    )

    const preparedVisitors = await Promise.all(
      visitors.map(async (v) => ({
        ...v,
        password: await hashPassword(v.password),
      }))
    )

    const [createdUsers, createdVisitors] = await Promise.all([
      User.insertMany(preparedUsers),
      Visitor.insertMany(preparedVisitors),
    ])

    
    console.log("\n✅ Users Seeded:");
    createdUsers.forEach((user) => {
      console.log(`   • ${user.name} (${user.email}) [${user.role}]`);
    })

    console.log("\n✅ Visitors Seeded:");
    createdVisitors.forEach((visitor) => {
      console.log(
        `   • ${visitor.name} (${visitor.email}) | Phone: ${visitor.phone}`
      )
    })

    console.log("\n🔐 Test Credentials:");
    console.log("   Admin    → admin@mail.com / admin123");
    console.log("   Employee → employee@mail.com / employee123");
    console.log("   Security → security@mail.com / security123");
    console.log("   Visitor  → rahul@mail.com / rahul123");

    console.log("\n🎉 Seeding completed successfully");

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();