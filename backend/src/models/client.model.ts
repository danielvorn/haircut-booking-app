import mongoose, { Model, Schema } from "mongoose"

interface IClient extends mongoose.Document {
  username: string
  password: string
  name: string
  email: string
  phoneNumber: string
}

const clientSchema: Schema<IClient> = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
})

const Client: Model<IClient> = mongoose.model<IClient>("Client", clientSchema)

export { Client }
