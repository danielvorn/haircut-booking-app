import mongoose, { Model, Schema } from "mongoose"

export interface IService extends mongoose.Document {
  name: string
  description: string
  price: number
  duration: number
  barbers: mongoose.Types.ObjectId[]
}

const serviceSchema: Schema<IService> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  barbers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Barber" }],
})

const Service: Model<IService> = mongoose.model<IService>(
  "Service",
  serviceSchema
)

export { Service }
