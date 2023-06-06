import express, { Request, Response } from "express"
import { Service } from "../models/service.model"

const router = express.Router()

// Create new services
router.post("/", async (req: Request, res: Response) => {
  try {
    const servicesData = req.body
    const newServices = await Service.create(servicesData)
    res.status(201).json(newServices)
  } catch (error) {
    res.status(400).json({ message: "Failed to create services", error })
  }
})

// Get all services
router.get("/", async (req: Request, res: Response) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch services" })
  }
})

// Get a service by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id)
    if (service) {
      res.json(service)
    } else {
      res.status(404).json({ error: "Service not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch service" })
  }
})

// Update a service by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration, barbers } = req.body
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration, barbers },
      { new: true }
    )
    if (updatedService) {
      res.json(updatedService)
    } else {
      res.status(404).json({ error: "Service not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update service" })
  }
})

// Delete a service by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id)
    if (deletedService) {
      res.json({ message: "Service deleted successfully" })
    } else {
      res.status(404).json({ error: "Service not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete service" })
  }
})

export default router
