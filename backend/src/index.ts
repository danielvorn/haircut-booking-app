import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import passport from "passport"
import "./passport.config"
import appointmentRoutes from "./routes/appointment.routes"
import authenticationRoutes from "./routes/authentication.routes"
import barberRoutes from "./routes/barber.routes"
import clientRoutes from "./routes/client.routes"
import serviceRoutes from "./routes/service.routes"
import userRoutes from "./routes/user.routes"
import { FRONTEND_URL, MONGO_URI, PORT } from "./utils/secrets"

export const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: FRONTEND_URL, // allow the server to accept request from different origin
    methods: ["GET", "POST"], // Specify the allowed HTTP methods
    credentials: true, // Allow cookies to be sent cross-origin
  })
)

app.use(passport.initialize())

mongoose.connect(MONGO_URI)

app.use("/barbers", barberRoutes)
app.use("/clients", clientRoutes)
app.use("/services", serviceRoutes)
app.use("/appointments", appointmentRoutes)
app.use("/users", userRoutes)
app.use("/auth", authenticationRoutes)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
