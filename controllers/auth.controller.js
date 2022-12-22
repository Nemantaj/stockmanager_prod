const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.getToken = (req, res, next) => {
  const pass = req.body.pass;

  if (!pass) {
    const error = new Error("Error occured while trying to retrieve token!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  const permaPass =
    "$2a$12$Kra9pHrz2mOnajfZICzwqOx5M0te0pPZzTdNDdmowBzbtpnLa4JLG";

  bcryptjs
    .compare(pass, permaPass)
    .then((passMatch) => {
      if (!passMatch) {
        const error = new Error("The password you entered is incorrect!.");
        error.title = "Error Occured!";
        error.statusCode = 422;
        throw error;
      }

      const token = jwt.sign(
        {
          tokens: crypto.randomBytes(12),
        },
        "secret"
      );

      res.json({ token: token, success: true });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
