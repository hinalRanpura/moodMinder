const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit:"50mb",extended: true }))
app.use(fileUpload())



const user = require("./routes/userRoute");
const activity = require("./routes/activityRoute");

app.use("/api/v1",user);
app.use("/api/v1",activity);

  
//Middleware error
app.use(errorMiddleware);

module.exports = app