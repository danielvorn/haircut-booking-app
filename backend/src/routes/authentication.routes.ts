import express, { Request, Response, Router } from "express"
import {
  authenticateToken,
  ensureAuthenticated,
  ensureRole,
} from "../middleware/authorization.middleware"
import { IUser, User, UserRole } from "../models/user.model"
import passport, { generateAccessToken } from "../passport.config"
import { hashPassword } from "../utils/hashPassword"
import { FRONTEND_URL } from "../utils/secrets"

const router: Router = express.Router()

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, email, role } = req.body

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Required fields are missing" })
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" })
    }

    // Hash and salt the password
    const hashedPassword = await hashPassword(password)

    // Create a new user
    const user = new User({
      local: {
        username,
        password: hashedPassword,
        email,
      },
      role: role || UserRole.Client,
    })

    // Save the user to the database
    const newUser = await user.save()

    return res.status(201).json(newUser)
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to register user", info: error })
  }
})

// Route for Google OAuth authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

// Route for Google OAuth2 callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const user = req.user as IUser

      const payload = {
        userId: user._id,
        googleId: user.google.googleId,
        role: user.role,
        email: user.google.email,
        displayName: user.google.displayName,
        profilePicture: user.google.profilePicture,
      }

      res.cookie("token", generateAccessToken(payload), { httpOnly: true })

      // Redirect to the frontend callback route
      res.redirect(`${FRONTEND_URL}/redirect`)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
)

// Route for traditional username/password authentication
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as IUser

      const payload = {
        userId: user._id,
        username: user.local.username,
        email: user.local.email,
        role: user.role,
      }

      res.cookie("token", generateAccessToken(payload), {
        httpOnly: true,
      })

      res.status(201).json("Login successful")
    } catch (error) {
      res.status(500).json({ error })
    }
  }
)

// Route for logging out the user
router.post("/logout", (req: Request, res: Response) => {
  // Clear the token cookie to log out the user
  res.clearCookie("token")
  res.send("User has been logged out")
  res.redirect(`${FRONTEND_URL}`)
})

// Protect the profile route with authentication
router.get("/profile", ensureAuthenticated, (req: Request, res: Response) => {
  // Return JSON response with the profile data
  return res.status(200).json({ profile: req.user })
})

router.get(
  "/admin-secrets",
  ensureRole(UserRole.Admin),
  (req: Request, res: Response) => {
    return res.status(200).json({ message: "You have unlocked secrets" })
  }
)

// Apply the authentication middleware to protected routes
router.get("/status", authenticateToken, (req: Request, res: Response) => {
  // Access the authenticated user from req.user
  const user = req.user
  return res.json({ isAuthenticated: true, data: user })
})

export default router
