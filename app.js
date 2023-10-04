const path = require("path");
const express = require("express");
require('dotenv').config()
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/addblog");
const blogModel = require("./modals/blog");

const { checkForAuthentication } = require("./middlewares/auth");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then((e) => {
    console.log("mongodb connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));


app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
    const allBlogs = await blogModel.find({}).sort({createdAt: -1});
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
});

app.listen(port, () => {
    console.log(`server started on Port ${port}`);
});