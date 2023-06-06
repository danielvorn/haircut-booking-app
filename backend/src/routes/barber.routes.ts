import express from "express"
import {
  createBarber,
  deleteBarberById,
  getAllBarbers,
  getBarberById,
  updateBarberById,
} from "../controllers/barbers.controllers"

const router = express.Router()

// Create a new barber or barbers
router.post("/", createBarber)

// Get all barbers
router.get("/", getAllBarbers)

// Get a barber by ID
router.get("/:id", getBarberById)

// Update a barber by ID
router.put("/:id", updateBarberById)

// Delete a barber by ID
router.delete("/:id", deleteBarberById)

export default router
