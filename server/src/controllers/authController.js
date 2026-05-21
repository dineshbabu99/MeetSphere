const bcrypt = require("bcryptjs");
const User =  require("../models/User");

const generateToken =  require("../utils/generateToken");


// REGISTER USER
const registerUser = async (req,res) => {
try {
    const {name,email,password,} = req.body;

    // Check existing user
    const userExists =await User.findOne({email,});

    if (userExists) {
      return res
        .status(400)
        .json({message: "User already exists",});
    }

    // Hash password
    const salt =await bcrypt.genSalt(10);

    const hashedPassword =await bcrypt.hash(password, salt);

    // Create user
    const user =await User.create({name,email,password:hashedPassword,});

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user._id
      ),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }

};


const LoginUser = async(req, res)=> {
    try {
          const {email,password,} = req.body;
          const userExist = await User.findOne({email});

          if(!userExist){
                return res
        .status(400)
        .json({message: "Account not exists, Create Account",});
    }

    const isPasswordCorrect = await bcrypt.compare(password, userExist.password);

    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Invalid Email or password",
        })
    }
    return res.status(200).json ({
        _id: userExist.id,
          _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      role: userExist.role,
      token: generateToken(userExist._id),
    })



    }
    catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
}
};

const getCurrentUser =
  async (req, res) => {

    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  };

const updateCurrentUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      if (
        email &&
        email !== user.email
      ) {

        const emailExists =
          await User.findOne({
            email,
            _id: {
              $ne: user._id,
            },
          });

        if (emailExists) {

          return res
            .status(400)
            .json({
              message:
                "Email already in use",
            });
        }
      }

      user.name =
        name || user.name;

      user.email =
        email || user.email;

      if (password) {

        const salt =
          await bcrypt.genSalt(10);

        user.password =
          await bcrypt.hash(
            password,
            salt
          );
      }

      const updatedUser =
        await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(
          updatedUser._id
        ),
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getUsers =
  async (req, res) => {

    try {

      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        users
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const updateUserRole =
  async (req, res) => {

    try {

      const {
        role,
      } = req.body;

      if (
        ![
          "SuperAdmin",
          "Admin",
          "User",
        ].includes(role)
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid user role",
          });
      }

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            role,
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      res.status(200).json({
        message:
          "User role updated",
        user,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };




module.exports = {
  registerUser,
  LoginUser,
  getCurrentUser,
  updateCurrentUser,
  getUsers,
  updateUserRole,
};
