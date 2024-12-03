import database from '../config/database.mjs'

export const hasRole = (roleNames) => {
 return async(req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [roleResults] = await database.query(
      `SELECT id FROM roles WHERE name IN (?)`,
      [roleNames]
    );

    if (roleResults.length === 0) {
      return res.status(404).json({ message: "Roles not found" }); // Roles do not exist
    }

    const roleIds = roleResults.map((role) => role.id);

    const [userResult] = await database.query(
      `SELECT role_id FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" }); // User does not exist
    }

    const userRoleId = userResult[0].role_id;

    if (roleIds.includes(userRoleId)) {
      return next(); // User has one of the correct roles
    } else {
      return res.status(403).json({ message: "Forbidden" }); // User does not have the correct role
    }
  } catch (error) {
    
  }
  
 }


}