const jwt = require("jsonwebtoken");

const api_config = require("../config/api.js");

const authenticationVerifier = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, api_config.api.jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.decoded = decoded;
    next();
  });
  //   if (authHeader) {
  //     const tokenParts = authHeader.split(" ");

  //     if (tokenParts.length === 2) {
  //       const token = tokenParts[1];

  //       jwt.verify(token, api_config.api.jwt_secret, (err, user) => {
  //         if (err) {
  //           if (err.name === "TokenExpiredError") {
  //             return res.status(401).json("Token has expired");
  //           } else {
  //             return res.status(401).json("Invalid token");
  //           }
  //         }

  //         req.user = user;
  //         next();
  //       });
  //     } else {
  //       return res.status(401).json("Invalid authorization header format");
  //     }
  //   } else {
  //     return res.status(401).json("You are not authenticated");
  //   }
};

/* check if the current user */
const accessLevelVerifier = (req, res, next) => {
  authenticationVerifier(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to perform this task");
    }
  });
};

/* access_level_verifier('admin') */
const isAdminVerifier = (req, res, next) => {
  authenticationVerifier(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to perform this task");
    }
  });
};

module.exports = {
  authenticationVerifier,
  accessLevelVerifier,
  isAdminVerifier,
};
