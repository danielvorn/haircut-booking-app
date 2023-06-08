import { Request, Response } from "express"
import mongoose from "mongoose"
import { Appointment, ISlot } from "../models/appointment.model"
import { Barber } from "../models/barber.model"
import dayjs from "dayjs"

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
    const barberId = req.query.barberId as string
    const dateParam = req.query.date as string
    const durationMinutes = Number(req.query.duration)

    if (!barberId || !dateParam || isNaN(durationMinutes)) {
      return res.status(400).json({ error: "Invalid query parameters" })
    }

    const barber = await Barber.findById(barberId)
    if (!barber) {
      return res.status(400).json({ error: "Barber not found" })
    }

    const reservedSlots = await Appointment.find({ barber: barberId }, "slot")

    const date = dayjs(dateParam)
    const startTime = date.set("hour", 9).set("minute", 0).set("second", 0)
    const endTime = date.set("hour", 17).set("minute", 0).set("second", 0)

    const timeSlots = []
    let currentTime = startTime.valueOf()
    const today = dayjs()
    while (true) {
      const slotEndTime = dayjs(currentTime).add(durationMinutes, "minute")

      if (slotEndTime.valueOf() > endTime.valueOf()) {
        break
      }

      const isReserved = reservedSlots.some((appointment: any) =>
        isTimeSlotOverlap(currentTime, slotEndTime.valueOf(), appointment.slot)
      )

      const timeSlot = {
        startTime: dayjs(currentTime).toDate(),
        endTime: slotEndTime.toDate(),
        isAvailable: !isReserved,
      }

      if (
        date.format("YYYY-MM-DD") === today.format("YYYY-MM-DD") &&
        today.valueOf() > dayjs(currentTime).valueOf()
      ) {
        timeSlot.isAvailable = false
      }

      timeSlots.push(timeSlot)
      currentTime += 15 * 60 * 1000
    }

    res.json(timeSlots)
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch slot availability" })
  }
}

function isTimeSlotOverlap(
  startTime: number,
  endTime: number,
  appointmentSlot: ISlot
) {
  const slotStartTime = dayjs(appointmentSlot.startTime).valueOf()
  const slotEndTime = dayjs(appointmentSlot.endTime).valueOf()

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
