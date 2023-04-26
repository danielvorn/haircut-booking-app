import { UserDocument } from "../../models/Users";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
