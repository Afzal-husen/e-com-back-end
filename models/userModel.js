import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxLength: [30, "name cannot exceed 30 characters"],
      minLength: [4, "name cannot be less than 4 character"],
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlenght: [8, "password cannot be less than 8 character"],
      select: false,
    },
    avatar: {
      public_key: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetTimeLimit: {
      type: Date,
    },
  },
  { timestamps: true },
);

//pre hook middleware, makes changes to schema before document creation
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt);
});


//JWT Token
//use methods property of schema to create your own custome middleware
//call sign method of jwt, then pass an object, a key, an some options to generate a signed token
userSchema.methods.createJwtToken = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
  return token;
};

//create a method to compare user password and hashed password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}


//create a method to create a reset password token
//set the reset pasword token to

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const date = Date.now() + 15 * 60 * 1000;
  this.resetTimeLimit = date;

  console.log(resetToken)
  return resetToken
};

export default mongoose.model("User", userSchema);


