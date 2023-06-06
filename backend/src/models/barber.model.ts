import mongoose, { Model, Schema } from "mongoose"
import { IService } from "./service.model"
import { IUser } from "./user.model"

export interface IBarber extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId
  name: string
  biography: string
  services: mongoose.Schema.Types.ObjectId[]
}

export const barberSchema: Schema<IBarber> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  biography: { type: String },
})

barberSchema.post("findOneAndDelete", async function (doc) {
  try {
    const Service = mongoose.model<IService>("Service")
    const User = mongoose.model<IUser>("User")

    // Find and delete the associated User
    if (doc) {
      await User.findOneAndDelete({ _id: doc.user })

      // Remove barber reference from associated services
      await Service.updateMany(
        { barbers: doc._id },
        { $pull: { barbers: doc._id } }
      )
    }
  } catch (error) {
    console.error(
      "Failed to delete associated User and update associated Services:",
      error
    )
  }
})

const Barber: Model<IBarber> = mongoose.model<IBarber>("Barber", barberSchema)

export { Barber }
