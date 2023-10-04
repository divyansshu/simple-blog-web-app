const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const blogModel = require("../modals/blog");
const commentModel = require("../modals/comments");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
   const filename = `${Date.now()}-${file.originalname}`
   cb(null, filename);
    }
});

const upload = multer({ storage: storage })

router.get("/add-new", (req,res) => {
    return res.render("addBlog", {
        user: req.user
    });
}); 

router.post("/", upload.single('coverImage'), async (req, res) => {
const {title, content} = req.body;
 
   const blog = await blogModel.create({
    title: title,
    content: content,
    createdBy: req.user._id,    
    coverImage: `/uploads/${req.file.filename}`
   });
    return res.redirect(`/blog/${blog._id}`);
});


router.get("/:id", async (req,res) => {
    const id = req.params.id;
    console.log(id);
    const blog = await blogModel.findById({_id: id}).populate("createdBy");
    const comments = await commentModel.find({blogId: id}).populate("createdBy");
    console.log("comments", comments);
    return res.render("viewBlog", {
    user: req.user,
    blog,
    comments
   });
});

router.post("/comment/:blogId", async (req,res) => {
    const blogId = req.params.blogId;
     await commentModel.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;