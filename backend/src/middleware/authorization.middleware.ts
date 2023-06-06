import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"
import { IUser, UserRole } from "../models/user.model"
import { JWT_SECRET } from "../utils/secrets"

interface JwtData {
  userId: string
  googleId: string
  role: "client" | "barber" | "admin"
  email: string
  displayName: string
  profilePicture: string
  iat: number
  exp: number
}

// Custom middleware to check if the user is authenticated
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  }

  // Return JSON response indicating authentication failure
  return res.status(401).json({ message: "Authentication failed" })
}

// Custom middleware to check if the user is authenticated and has the required role
function ensureRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser
    if (req.isAuthenticated() && user.role === role) {
      return next()
    }
    res.status(403).send("Access denied")
  }
}

// Utility function to verify JWT token
const verifyToken = (token: string): Promise<JwtData> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: VerifyErrors, decoded: JwtData) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

// Middleware to validate JWT token and user id
const verifyTokenAndUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token // Assuming JWT token is stored in the cookie as "jwt"
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    // Verify the token asynchronously
    const decodedToken = await verifyToken(token)
    const userId = req.params.client as string
    // Check if user id matches
    if (decodedToken.userId !== userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // User is authorized, continue to the next middleware or the route handler
    next()
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" })
  }
}

// authentication middleware
const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(200).json({
      isAuthenticated: false,
      reason: "No token provided.",
    })
  }

  try {
    // Verify the token asynchronously
    const decodedToken = await verifyToken(token)

    // Attach the decoded token payload to the request for further use
    req.user = decodedToken

    // Proceed to the next middleware or route handler
    next()
  } catch (error) {
    res.status(200).json({ isAuthenticated: false, reason: error })
  }
}

export {
  ensureAuthenticated,
  ensureRole,
  verifyTokenAndUserId,
  isAuthenticated as authenticateToken,
}
