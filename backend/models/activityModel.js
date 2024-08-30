const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Activity Name'],
        maxLength: [50, 'Activity name can not exeed 50 characters'],
        minLength: [4, "Activity name Should have more than 4 characters"],
    },
    image: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    type: {
        type: String,
        required: [true, 'Please Enter Activity type'],
    },
    description: {
        type: String,
        required: [true, 'Please Enter Activity description'],
    },
    whether: {
        type: String,
        required: [true, 'Please Enter Particular whether for Activity'],
    },
});


module.exports = mongoose.model("Activity", activitySchema);