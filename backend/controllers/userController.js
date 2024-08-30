const User = require('../models/userModel');
const Feedback = require('../models/feedbackModel');
const ErrorHander = require('../utils/errorhander');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require('../utils/jwtToken');
const sendEmail = require("../utils/sendEmail")
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//register --
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatar",
        width: 150,
        crop: "scale",
    })
    const { name, email, password, gender, phone, dob } = req.body;

    const user = await User.create({
        name,
        dob,
        email,
        password,
        gender,
        phone,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 200, res);
});

//login --
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);

});

//logout --
exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "logged out user",
    })
})

//forgot password --
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONT_END_URL}/password/reset/${resetToken}`

    const message = `Your Password reset Token is : \n\n ${resetPasswordUrl} 
    \n\n If you not requested this email then, plese ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: `MoodMinder Password Recovery`,
            message,

        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;


        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500))
    }
})

//reset password --
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    console.log(resetPasswordToken)

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    console.log(user)

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired.", 400))
    }

    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHander("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Reset Successfully",
    })
})

// Get User Detail --
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
})

// update password --
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not match", 400))
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);

})

// update profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatar",
        width: 150,
        crop: "scale",
    })

    let user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHander("User not found", 404))
    }

    const userData = {
        name: req.body.name,
        dob: req.body.dob,
        phone: req.body.phone,
        gender: req.body.gender,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    
    user = await User.findByIdAndUpdate(req.user.id, userData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
        message: "Profile updated successfully",
    })
})

// get all users -admin  --
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
})

// update user role -admin  *
exports.upadateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    user.role = req.body.role;

    await user.save();

    res.status(200).json({
        success: true,
        user,
        message: "User role updated successfully",
    })
})

// delete user  -admin *
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    })


})

// view user details  -admin *
exports.viewUserDatail = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    })
})

// add fedback *
exports.giveFeedback = catchAsyncErrors(async (req, res, next) => {
    const { comment, rating } = req.body;

    if (!comment || !rating) {
        return next(new ErrorHander("Please enter comment and rating", 400))
    }

    const feedback = await Feedback.create({
        comment,
        rating: Number(rating),
        user: req.user._id,
        name: req.user.name,
    })

    res.status(200).json({
        success: true,
        feedback,
        message: "Feedback added successfully",
    })
})

// view feedback -admin 
exports.viewFeedback = catchAsyncErrors(async (req, res, next) => {

    const feedbacks = await Feedback.find();

    res.status(200).json({
        success: true,
        feedbacks,
    })
})
