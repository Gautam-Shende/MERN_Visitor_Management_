import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import visitorRoutes from "./routes/visitorRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import passRoutes from "./routes/passRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import exportRoutes from "./routes/exportRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import visitorAuthRoutes from "./routes/visitorAuthRoutes.js"
// import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
// app.use(cors({
//   origin: "https://mern-visitor-managment-frontend.onrender.com",
//   credentials: true
// }));

app.use(express.json());

connectDB();

app.use("/", authRoutes);
app.use("/", visitorRoutes);
app.use("/", appointmentRoutes);
app.use("/", passRoutes);
app.use("/", dashboardRoutes);
app.use("/", reportRoutes);
app.use("/", exportRoutes);
app.use("/", userRoutes);
app.use("/", visitorAuthRoutes);

// // ✅ TEST EMAIL ROUTE
// app.get("/test-email", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "https://api.emailjs.com/api/v1.0/email/send",
//       {
//         service_id: process.env.EMAILJS_SERVICE_ID,
//         template_id: process.env.EMAILJS_TEMPLATE_ID,
//         user_id: process.env.EMAILJS_PUBLIC_KEY,
//         accessToken: process.env.EMAILJS_PRIVATE_KEY,
//         template_params: {
//           name: "Gautam",
//           email: "shendegautam13@gmail.com", // 👉 apna email daalo
//           message: "Test email from backend 🚀",
//         },
//       }
//     );

//     res.json({
//       success: true,
//       message: "Email sent successfully",
//       data: response.data,
//     });
//   } catch (error) {
//     console.error(error.response?.data || error.message);

//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// });


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});