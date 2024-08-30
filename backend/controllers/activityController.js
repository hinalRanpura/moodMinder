const Activity = require('../models/activityModel');
const ErrorHander = require('../utils/errorhander');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require('cloudinary');

//add activity *
exports.createActivity = catchAsyncErrors( async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "activity",
        width: 150,
        crop: "scale",
    }) 

    const { name,type,description,whether } = req.body;
    
    const activity = await Activity.create({
        name,
        type,
        description,
        whether,
        image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }

    });

    res.status(201).json({
        success: true,
        activity
    })

});

//update activity *
exports.updateActivity = catchAsyncErrors( async (req, res, next) => {

        let activity = await Activity.findById(req.params.id);

        if(!activity){
            return next(new ErrorHander("Activity not found", 404));
        }
        
        activity = await Activity.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        
        res.status(200).json({
            success: true,
            activity
        })
})

//activity details *
exports.activityDetails = catchAsyncErrors( async (req, res, next) => {
        const activity = await Activity.findById(req.params.id);

        if(!activity){
            return next(new ErrorHander("Activity not found", 404));
        }

        res.status(200).json({
            success: true,
            activity
        })
})

//all activity --
exports.allActivity = catchAsyncErrors( async (req, res, next) => {
        
        const activities = await Activity.find();
        
        res.status(200).json({
            success: true,
            activities
        })
})

//delete activity --
exports.deleteActivity = catchAsyncErrors( async (req, res, next) => {
        const activity = await Activity.findById(req.params.id);

        if(!activity){
            return next(new ErrorHander("Activity not found", 404));
        }
        await activity.remove();
        res.status(200).json({
            success: true,
            message: "Activity deleted successfully"
        })
})

//reccomend activity
exports.reccomendActivity = catchAsyncErrors( async (req,res,next) => {
    
});  