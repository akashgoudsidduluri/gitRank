const express=require("express")
const router=express.Router();
const {analyzeProfile} =require("../controllers/profileController");
router.get("/api/analyze/:username",analyzeProfile);
module.exports=router;