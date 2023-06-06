import express, { Request, Response } from "express"
import { Client } from "../models/client.model"

const router = express.Router()

// Create a new client
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, phoneNumber } = req.body
    const client = new Client({ username, password, name, email, phoneNumber })
    const newClient = await client.save()
    res.status(201).json(newClient)
  } catch (error) {
    res.status(400).json({ error: "Failed to create client" })
  }
})

// Get all clients
router.get("/", async (req: Request, res: Response) => {
  try {
    const clients = await Client.find()
    res.json(clients)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch clients" })
  }
})

// Get a client by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id)
    if (client) {
      res.json(client)
    } else {
      res.status(404).json({ error: "Client not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch client" })
  }
})

// Update a client by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, phoneNumber } = req.body
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { username, password, name, email, phoneNumber },
      { new: true }
    )
    if (updatedClient) {
      res.json(updatedClient)
    } else {
      res.status(404).json({ error: "Client not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update client" })
  }
})

// Delete a client by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id)
    if (deletedClient) {
      res.json({ message: "Client deleted successfully" })
    } else {
      res.status(404).json({ error: "Client not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete client" })
  }
})

export default router
