import bcrypt from "bcryptjs";
import passport from "passport";
import database from "../config/database.mjs";
import { CLIENT } from "../constants/auth.mjs";
import jwt from "jsonwebtoken";
import 'dotenv/config'

export const findUserByEmail = async (email) => {
  const [rows] = await database.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows[0];
};

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const [newUser] = await database.query(
      `INSERT INTO users (fullname, email, password, role_id) VALUES (?,?,?, ?)`,
      [fullname, email, hashedPassword, CLIENT]
    );

    if (newUser.affectedRows === 0) {
      return res.status(500).json({
        status: "error",
        error: "Failed to register.",
        err_code: "AUTH_SIGNUP_ERR",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Account created.",
    });
  } catch (error) {
    console.error(`Register Error: ${error.message}`, error);
    return res.status(500).json({
      status: "error",
      error: "Failed to register.",
      err_code: "AUTH_SIGNUP_ERR",
    });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ message: info.message });

    // Log in the user
    req.logIn(user, async (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });

      // Generate JWT token for the user
      const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
        expiresIn: "1h",
      });

      try {
        // Query to get user data including role information
        const [userData] = await database.query(
          `SELECT u.id, u.role_id, r.access_secret
           FROM users u
           JOIN roles r ON u.role_id = r.id
           WHERE u.id = ?`,
          [user.id]
        );

        // Check if userData exists
        if (!userData || userData.length === 0) {
          return res.status(404).json({ message: "User data not found" });
        }

        const { id, access_secret } = userData[0];

        res.cookie("token", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000,
        });

        res.cookie("user", id, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000,
        });

        res.cookie("access_secret", access_secret, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000,
        });

        return res.json({
          message: "Login successful",
          user: { id: user.id, email: user.email, fullname: user.fullname },
        });

      } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Error fetching user data" });
      }
      
    });
  })(req, res, next);
};


export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = (req, res) => {
  passport.authenticate(
    "google", async(err, user) => {
      if (err) return res.status(500).json({ message: "Authentication failed" });

      req.logIn(user, async(err) => {
        if (err) return res.status(500).json({ message: "Login failed" });

        const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
          expiresIn: "1h",
        });

        const [userData] = await database.query(
          `SELECT u.id, u.role_id, r.access_secret 
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
          [user.id]
        );
  
        const { id, access_secret } = userData[0];

        res.cookie("token", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000, 
        })
        res.cookie("user", id, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000, 
        })
        res.cookie("access_secret", access_secret, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 3600000, 
        })

      return res.redirect("http://localhost:5173/");


      })
    }
  )(req, res)
}