const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "BhoominIsaGood#oy";

//ROUTE 1 : create a user using : POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter the valid Name").isLength({ min: 3 }),
    body("email", "Enter the valid Email").isEmail(),
    body("password", "Password is too sort").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors , then return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {
      //check wheather the user with this email already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email is already exist" });
      }
      //Create a New User
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      //Token authenticate signature
      const authtoken = jwt.sign(data, JWT_SECRET);
      
      success = true;
      res.json({ success,authtoken });

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internel server error occure");
    }
  }
);

//ROUTE 2 : Authenticate a user using : POST "/api/auth/login". login required

router.post(
  "/login",
  [
    body("email", "Enter the valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors , then return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credential" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internel server error occure");
    }
  }
);

//ROUTE 3 : GET a user using : POST "/api/auth/getuser". login required
router.post(
    "/getuser",
    fetchuser,
    async (req, res) => {
try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
    
} catch (error) {
    console.log(error.message);
        res.status(500).send("Internel server error occure");
}
})

module.exports = router;
