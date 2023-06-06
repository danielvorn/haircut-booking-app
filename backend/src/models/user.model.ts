import mongoose, { CallbackError, Document, Schema, model } from "mongoose"
import { IBarber } from "./barber.model"

enum UserRole {
  Admin = "admin",
  Client = "client",
  Barber = "barber",
}

interface IPhoneNumber {
  countryCode: string
  number: string
}

export interface ILocalAuth {
  username: string
  password: string
  email: string
}

interface IGoogleAuth {
  googleId: string
  displayName: string
  profilePicture: string
  email: string
}

interface IUser extends Document {
  local: ILocalAuth
  google: IGoogleAuth
  role: UserRole
  phoneNumber: IPhoneNumber
  accessToken: string
  refreshToken: string
}

const userSchema = new Schema<IUser>({
  local: {
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String },
  },
  google: {
    googleId: { type: String },
    displayName: { type: String },
    profilePicture: { type: String },
    email: { type: String },
  },
  phoneNumber: {
    countryCode: { type: String },
    number: { type: String },
  },
  role: { type: String, enum: Object.values(UserRole), required: true },
})

// Define pre middleware for User model
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const conditions = this.getQuery()

    // Remove associated Barber when User is deleted
    await model<IBarber>("Barber").deleteOne({ user: conditions._id })
    next()
  } catch (error) {
    next(error as CallbackError | undefined)
  }
})

const User = mongoose.model<IUser>("User", userSchema)

export { User, UserRole, IUser }
