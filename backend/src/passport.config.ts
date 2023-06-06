import bcrypt from "bcrypt"
import jwt, { Secret } from "jsonwebtoken"
import passport from "passport"
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20"
import { Strategy as LocalStrategy } from "passport-local"
import { IUser, User, UserRole } from "./models/user.model"
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from "./utils/secrets"

const ACCESS_TOKEN_EXPIRATION = "60m"

// Configure Passport for username/password authentication
passport.use(
  new LocalStrategy(
    { usernameField: "username" }, // Assuming the username field is "username"
    async (username: string, password: string, done: any) => {
      try {
        // Find the user by username
        const user: IUser | null = await User.findOne({
          "local.username": username,
        })

        // If the user doesn't exist, return an error
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          })
        }
        // Verify the password
        const isMatch = await bcrypt.compare(password, user.local.password)
        // If the password doesn't match, return an error

        if (!isMatch) {
          return done(null, false, {
            message: "Incorrect username or password.",
          })
        }

        // If user and password are valid, return the user
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

// Configure Passport for Google OAuth authentication
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken,
      refreshToken,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // Check if the user already exists in the database based on their Google ID
        let user = await User.findOne({ "google.googleId": profile.id })

        if (user) {
          // Update user data
          user.google = {
            googleId: profile.id,
            displayName: profile.displayName,
            profilePicture: profile.photos?.[0]?.value,
            email: profile.emails?.[0]?.value,
          }
        }

        if (!user) {
          // Create a new user if they don't exist
          user = new User({
            google: {
              googleId: profile.id,
              displayName: profile.displayName,
              profilePicture: profile.photos?.[0]?.value,
              email: profile.emails?.[0]?.value,
            },
            role: UserRole.Client,
          })
        }

        await user.save()

        done(null, user)
      } catch (error) {
        done(error as Error)
      }
    }
  )
)

// Generate a JWT access token
export function generateAccessToken(user: any): string {
  try {
    const token = jwt.sign(user, JWT_SECRET as Secret, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    })
    return token
  } catch (err) {
    console.log({ err })
  }
}

export default passport
