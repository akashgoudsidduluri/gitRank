const express=require("express")
const router=express.Router();
const { analyzeProfile, getContributors } = require("../controllers/profileController");

router.get("/api/analyze/:username", analyzeProfile);
router.get("/api/repo-contributors/:owner/:repo", getContributors);

module.exports=router;