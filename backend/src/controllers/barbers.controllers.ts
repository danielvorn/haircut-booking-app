import { Request, Response } from "express"
import { Barber } from "../models/barber.model"
import { User, UserRole } from "../models/user.model"
import { hashPassword } from "../utils/hashPassword"

// Create a new barber or barbers
const createBarber = async (req: Request, res: Response) => {
  try {
    const barbersData = Array.isArray(req.body) ? req.body : [req.body]

    const newBarbers = await Promise.all(
      barbersData.map(
        async (barberData: { user: any; name: string; biography: string }) => {
          const { user, name, biography } = barberData
          const { username, password, email } = user

          // Hash the password
          const hashedPassword = await hashPassword(password)

          // Create a new User
          const newUser = new User({
            local: {
              username,
              password: hashedPassword,
              email,
            },
            role: UserRole.Barber,
            phoneNumber: user.phoneNumber,
          })

          const savedUser = await newUser.save()

          // Create a new Barber using the created User's ID
          const newBarber = new Barber({
            user: savedUser._id,
            name,
            biography,
          })

          const savedBarber = await newBarber.save()

          return savedBarber
        }
      )
    )

    res.status(201).json(newBarbers)
  } catch (error) {
    console.log({ error })
    res.status(400).json({ error })
  }
}

// Get all barbers
const getAllBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await Barber.find()
    res.json(barbers)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch barbers" })
  }
}

// Get a barber by ID
const getBarberById = async (req: Request, res: Response) => {
  try {
    const barber = await Barber.findById(req.params.id)
    if (barber) {
      res.json(barber)
    } else {
      res.status(404).json({ error: "Barber not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch barber" })
  }
}

// Update a barber by ID
const updateBarberById = async (req: Request, res: Response) => {
  try {
    const { user, specialization } = req.body
    const updatedBarber = await Barber.findByIdAndUpdate(
      req.params.id,
      { user, specialization },
      { new: true }
    )
    if (updatedBarber) {
      res.json(updatedBarber)
    } else {
      res.status(404).json({ error: "Barber not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update barber" })
  }
}

// Delete a barber by ID
const deleteBarberById = async (req: Request, res: Response) => {
  try {
    const deletedBarber = await Barber.findByIdAndDelete(req.params.id)
    if (deletedBarber) {
      res.json({ message: "Barber deleted successfully" })
    } else {
      res.status(404).json({ error: "Barber not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete barber" })
  }
}

export {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarberById,
  deleteBarberById,
}
