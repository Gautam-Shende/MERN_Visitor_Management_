import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

import connectDB from '../config/database/db.js'
import User from '../models/User.js'
import Visitor from '../models/Visitor.js'

dotenv.config()

// Test example users for adding data base 
const users = [
  {
    name: 'Admin User',
    email: 'admin@mail.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Employee User',
    email: 'employee@mail.com',
    password: 'employee123',
    role: 'employee',
  },
  {
    name: 'Security User',
    email: 'security@mail.com',
    password: 'security123',
    role: 'security',
  },
]

// Test example visitors 
const visitors = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@mail.com',
    phone: '9876543210',
    password: 'rahul123',
    purpose: 'Business Meeting',
    status: 'pending',
  },
  {
    name: 'Priya Patel',
    email: 'priya@mail.com',
    phone: '9876543211',
    password: 'priya123',
    purpose: 'Interview',
    status: 'pending',
  },
]

const seedDatabase = async () => {
  try {
    // connect to MongoDB
    await connectDB()
    console.log('\n Starting database seeding...')

    // clear existing or old users who present in database data first
    await User.deleteMany()
    await Visitor.deleteMany()
    console.log(' Old users and visitors cleared')

    // hash passwords for users
    const usersToInsert = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    )

    // hash passwords for visitors
    const visitorsToInsert = await Promise.all(
      visitors.map(async (v) => ({
        ...v,
        password: await bcrypt.hash(v.password, 10),
      }))
    )

    // direct insert into MongoDB
    const createdUsers = await User.insertMany(usersToInsert)
    const createdVisitors = await Visitor.insertMany(visitorsToInsert)

    // show the data of seed users
    console.log('\n Users seeded:')
    createdUsers.forEach((user) => {
      console.log(`   • ${user.name} (${user.email}) [${user.role}]`)
    })

    console.log('\n Visitors seeded:')
    createdVisitors.forEach((visitor) => {
      console.log(`   • ${visitor.name} (${visitor.email}) | Phone: ${visitor.phone}`)
    })

    console.log('\n Test credentials:')
    console.log(' Admin    → admin@mail.com / admin123')
    console.log(' Employee → employee@mail.com / employee123')
    console.log('  Security → security@mail.com / security123')
    console.log('  Visitor  → rahul@mail.com / rahul123')
    console.log('  Visitor  → priya@mail.com / priya123')

    console.log(`\n Seeding complete! ${createdUsers.length} users and ${createdVisitors.length} visitors added to MongoDB.\n`)

    process.exit(0)
  } catch (err) {
    console.error('\n Seeding failed:', err.message)
    process.exit(1)
  }
}

seedDatabase()
