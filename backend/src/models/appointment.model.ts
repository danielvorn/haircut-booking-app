import mongoose, { Model, Schema } from "mongoose"

interface IAppointment extends mongoose.Document {
  barber: mongoose.Types.ObjectId
  client: mongoose.Types.ObjectId
  service: mongoose.Types.ObjectId
  slot: mongoose.Types.ObjectId
  createdAt: Date
}

export interface ISlot extends mongoose.Document {
  startTime: string
  endTime: string
}

const slotSchema: Schema<ISlot> = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
})

const appointmentSchema: Schema<IAppointment> = new Schema({
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  slot: slotSchema, // Embed the slot schema directly
  createdAt: { type: Date, default: Date.now },
})

const Appointment: Model<IAppointment> = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
)

export { Appointment }
