import express from "express"
import {
  createAppointment,
  deleteAppointmentById,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByBarberId,
  getAppointmentsByClientId,
  getAvailability,
  updateAppointmentById,
} from "../controllers/appointments.controller"
import { verifyTokenAndUserId } from "../middleware/authorization.middleware"

const router = express.Router()

router.post("/", createAppointment)
router.get("/", getAllAppointments)
router.get("/:id", getAppointmentById)
router.put("/:id", updateAppointmentById)
router.delete("/:id", deleteAppointmentById)
router.get("/slots/availability", getAvailability)
router.get("/barber/:barberId", getAppointmentsByBarberId)
router.get("/client/:client", verifyTokenAndUserId, getAppointmentsByClientId)

export default router
