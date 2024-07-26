//IMPORT PACKAGE
const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const otpRouter = require("./routes/otp");
const eventRouter = require("./routes/event");
const volunteerRouter = require("./routes/volunteer");
const roleRouter = require("./routes/role");
const volunteerRolesRouter = require("./routes/volunteerRoleRouter");
const postRouter = require("./routes/postRouter");
const cors = require("cors");
const bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(express.json());

app.use(express.static("./public"));

//CORS middleware
app.use(cors());

//USING ROUTES
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/role", roleRouter);
app.use("/api/volunteerRole", volunteerRolesRouter);
app.use("/api/post", postRouter);

module.exports = app;
