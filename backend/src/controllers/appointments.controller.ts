import { Request, Response } from "express"
import mongoose from "mongoose"
import { Appointment, ISlot } from "../models/appointment.model"
import { Barber } from "../models/barber.model"

const createAppointment = async (req: Request, res: Response) => {
  try {
    const { barber, client, service, slot } = req.body
    const appointment = new Appointment({ barber, client, service, slot })
    const newAppointment = await appointment.save()
    return res.status(201).json(newAppointment)
  } catch (error) {
    res.status(400).json({ error: "Failed to create appointment" })
  }
}

const getAppointmentsByBarberId = async (req: Request, res: Response) => {
  try {
    const barberId = req.params.barberId as string
    if (!barberId) {
      return res.status(400).json({ error: "Barber ID is required" })
    }

    const appointments = await Appointment.find({ barber: barberId })
      .populate("barber", "name")
      .populate("client", "name")
      .populate("service", "name")

    res.json(appointments)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch appointments" })
  }
}

const getAppointmentsByClientId = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.client
    if (!clientId) {
      return res.status(400).json({ error: "Client ID is required" })
    }

    const time = req.query.time
    if (!time || (time !== "upcoming" && time !== "history")) {
      return res.status(400).json({
        error:
          "Please specify a query param of 'time' with value 'upcoming' or 'history'",
      })
    }

    const page = Number(req.query.page) || 1 // Current page number
    const pageSize = Number(req.query.pageSize) || 2 // Number of appointments per page

    const filter: any = { client: new mongoose.Types.ObjectId(clientId) }

    if (time === "upcoming") {
      filter["slot.startTime"] = { $gt: new Date().toISOString() }
    } else if (time === "history") {
      filter["slot.endTime"] = { $lt: new Date().toISOString() }
    }

    const totalAppointmentsQuery = Appointment.countDocuments(filter).exec()
    const totalPagesQuery = totalAppointmentsQuery.then((count) =>
      Math.ceil(count / pageSize)
    )

    const [totalAppointments, totalPages] = await Promise.all([
      totalAppointmentsQuery,
      totalPagesQuery,
    ])

    const skip = (page - 1) * pageSize // Calculate the number of documents to skip

    const appointments = await Appointment.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
      {
        $lookup: {
          from: "barbers",
          localField: "barber",
          foreignField: "_id",
          as: "barber",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: "$barber",
      },
      {
        $unwind: "$service",
      },
      {
        $project: {
          _id: 0,
          barber: {
            _id: 0,
          },
          service: {
            _id: 0,
          },
          // Include other appointment fields as needed
        },
      },
    ])

    // res.json(appointments)
    res.json({ appointments, totalPages, currentPage: page })
  } catch (error) {
    res.status(400).json(error)
  }
}

const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
    res.json(appointments)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch appointments" })
  }
}

const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (appointment) {
      res.json(appointment)
    } else {
      res.status(404).json({ error: "Appointment not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch appointment" })
  }
}

const updateAppointmentById = async (req: Request, res: Response) => {
  try {
    const { barber, client, service, slot } = req.body
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { barber, client, service, slot },
      { new: true }
    )
    if (updatedAppointment) {
      res.json(updatedAppointment)
    } else {
      res.status(404).json({ error: "Appointment not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update appointment" })
  }
}

const deleteAppointmentById = async (req: Request, res: Response) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    )
    if (deletedAppointment) {
      res.json({ message: "Appointment deleted successfully" })
    } else {
      res.status(404).json({ error: "Appointment not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete appointment" })
  }
}

const getAvailability = async (req: Request, res: Response) => {
  try {
    const barberId = req.query.barberId as string // Assuming the barber ID is passed as a query parameter
    const dateParam = req.query.date as string // Assuming the date is passed as a query parameter
    const durationMinutes = Number(req.query.duration) // Assuming the duration is passed in minutes

    if (!barberId || !dateParam || isNaN(durationMinutes)) {
      return res.status(400).json({ error: "Invalid query parameters" })
    }

    const barber = await Barber.findById(barberId)
    if (!barber) {
      return res.status(400).json({ error: "Barber not found" })
    }

    // Find all reserved slots for the barber
    const reservedSlots = await Appointment.find({ barber: barberId }, "slot")

    // Parse the date query parameter in ISO 8601 format
    const date = new Date(dateParam)

    const startTime = new Date(date.getTime())
    date.setUTCHours(14, 0, 0, 0); // Convert date to 9 AM EST (UTC+9)
    const endTime = new Date(date.getTime())
    endTime.setUTCHours(22, 0, 0, 0); // Convert date to 5 PM EST (UTC+9)

    const timeSlots = []
    let currentTime = startTime.getTime()
    const today = new Date()
    while (true) {
      const slotEndTime = new Date(currentTime + durationMinutes * 60000)

      if (slotEndTime.getTime() > endTime.getTime()) {
        break // Stop generating time slots if the next slot would exceed endTime
      }

      const isReserved = reservedSlots.some((appointment: any) =>
        isTimeSlotOverlap(currentTime, slotEndTime.getTime(), appointment.slot)
      )

      const timeSlot = {
        startTime: new Date(currentTime).toISOString(), // Convert to ISO string
        endTime: slotEndTime.toISOString(), // Convert to ISO string
        isAvailable: !isReserved,
      }

      if (
        date.toDateString() === today.toDateString() &&
        today.getTime() > new Date(currentTime).getTime()
      ) {
        timeSlot.isAvailable = false // Set isAvailable to false for slots that have elapsed today
      }

      timeSlots.push(timeSlot)
      currentTime += 15 * 60 * 1000 // Move to the next time slot (15 minutes)
    }

    res.json(timeSlots)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch slot availability" })
  }
}

// Function to check if a time slot overlaps with a given appointment slot
function isTimeSlotOverlap(
  startTime: number,
  endTime: number,
  appointmentSlot: ISlot
) {
  const slotStartTime = new Date(appointmentSlot.startTime).getTime()
  const slotEndTime = new Date(appointmentSlot.endTime).getTime()

  return startTime < slotEndTime && endTime > slotStartTime
}

export {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByBarberId,
  getAppointmentsByClientId,
  updateAppointmentById,
  deleteAppointmentById,
  getAvailability,
}
