const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.getToken = async (req, res, next) => {
  try {
    const pass = req.body.pass;

    if (!pass) {
      const error = new Error("Error occured while trying to retrieve token!.");
      error.title = "Error Occured";
      error.statusCode = 422;
      throw error;
    }

    const permaPass =
      "$2a$12$Kra9pHrz2mOnajfZICzwqOx5M0te0pPZzTdNDdmowBzbtpnLa4JLG";

    const premiumPass =
      "$2a$12$0GLNWQNbr3ns7JNX7I3VK.SMrfyhtax2akf4ZaENC4CjtTlb/36ie";

    let isValid = false;
    const perma = await bcryptjs.compare(pass, permaPass);
    const premium = await bcryptjs.compare(pass, premiumPass);

    if (!perma && !premium) {
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

    res.json({
      token: token,
      level: perma ? "regular" : "premium",
      success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
