const express = require("express");
const userModel = require("../modals/user");
const router = express.Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});


router.post("/signup", async (req, res) => {
    const { Fname, email, password } = req.body;
    await userModel.create({
        name: Fname,
        email: email,
        password: password
    });

    return res.redirect("/");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userModel.matchPassword(email, password);
        if(token) {
            return res.cookie("token", token).redirect("/");
        }else {
            return res.render("signin", {error: "Invalid email or Password"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).render("signin", { error: "Invalid email or Password" });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

module.exports = router;