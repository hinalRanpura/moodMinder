const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please Enter Your Name'],
        maxLength: [30,'Name can not exeed 30 characters'],
        minLength: [4,"Name Should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true,'Please Enter Your Email'],
        unique: true,
        validate: [validator.isEmail,"Please Enter a valid Email"],
    }, 
    password: {
        type: String,
        required: [true,'Please Enter Your Password'],
        minLength: [6,'Password should be greater than 6 character'],
        select: false,
    },
    avatar :{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    dob: {
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: [true,'Please Select Gender']
    },
    phone:{
        type: Number,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});
  
userSchema.pre("save",async function(next){
    
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcryptjs.hash(this.password,10);
})

//JWT Token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}

userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
  
module.exports = mongoose.model("User", userSchema);