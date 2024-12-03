import bcrypt from 'bcryptjs'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import database from './database.mjs'
import jwt from 'jsonwebtoken'
import {CLIENT} from '../constants/auth.mjs'
import passport from 'passport'
const findUserByEmail = async(email) => {
  const [rows] = await database.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows[0];
}

const findUserById = async (id) => {
  const [rows] = await database.query(
    `SELECT users.*, roles.access_secret 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE users.id = ?`,
    [id]
  );
  return rows[0]; 
};

export default function configurePassport(passport){
  passport.use(
    new LocalStrategy({usernameField: "email"}, async(email, password, done) => {
      try {
        const user = await findUserByEmail(email)
        if(!user)
          return done(null, false, { message: "Email not registered" });

        const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user)
      } catch (error) {
        return done(error)
      }
    })
  )

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async(accessToken, refreshToken, profile, done) => {
        try {
          let user = await findUserByEmail(profile.emails[0].value);
          if (!user) {
            const [result] = await database.query(
              `INSERT INTO users (google_id, fullname, email, role_id) VALUES (?, ?, ?, ?)`,
              [profile.id, profile.displayName, profile.emails[0].value, CLIENT]
            );
            user = {
              id: result.insertId,
              fullname: profile.displayName,
              email: profile.emails[0].value,
              google_id: profile.id,
            };
          }
          done(null, user)
        } catch (error) {
          console.error("Error during Google authentication:", error);
          done(error, null);
        }
      }
    )
  )
}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
  try {
    console.log(`Deserializing user with ID: ${id}`);
      const user = await findUserById(id);
      if (!user) {
        console.log(`User not found for ID: ${id}`);
        return done(null, false);
      }
      done(null, user);
  } catch (error) {
    console.error(`Error deserializing user: ${error.message}`);
    done(error, null);
  }
})