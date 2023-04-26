import passport from "passport";
import passportGoogle, {
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
const GoogleStrategy = passportGoogle.Strategy;
import User from "../models/Users";
import { CLIENT_ID, CLIENT_SECRET } from "../utils/secrets";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  if (user) done(null, user.id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (
      accessToken,
      refreshToken,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const user = await User.findOne({ googleId: profile.id });
      //TODO: Create a new user if not exists
      if (!user) {
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
        });
        if (newUser) {
          done(null, newUser);
        }
      } else {
        done(null, user);
      }
    }
  )
);
