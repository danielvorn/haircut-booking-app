import express, { Request, Response } from "express"
import { User } from "../models/user.model"

const router = express.Router()

// Create a new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password, role, email } = req.body
    const user = new User({ username, password, role, email })
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ error: "Failed to create user", info: error })
  }
})

// Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch users" })
  }
})

// Get a user by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch user" })
  }
})

// Update a user by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, password, role },
      { new: true }
    )
    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" })
  }
})

// Delete a user by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (deletedUser) {
      res.json({ message: "User deleted successfully" })
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete user" })
  }
})

export default router
