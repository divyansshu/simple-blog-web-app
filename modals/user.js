const mongoose = require("mongoose");
const  crypto  = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "/public/defaultImg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {
    timestamps: true
});

UserSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;

    const salt = crypto.randomBytes(16).toString();
    const hashPassword = crypto.createHmac("sha256", salt).update(user.password).digest("hex");


    this.salt = salt;
    this.password = hashPassword;

    next();
});

UserSchema.static("matchPassword", async function(email, password) {

    const user = await this.findOne({email:email});

    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const hashProvidedPass = crypto.createHmac("sha256", salt).update(password).digest("hex");

if(hashedPassword !== hashProvidedPass) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
});


const userModel = new mongoose.model("user", UserSchema);

module.exports = userModel;