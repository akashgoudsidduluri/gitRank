const express=require("express")
const router=express.Router();
const { analyzeProfile, getContributors, recordSnapshotForUser, getHistoryForUser } = require("../controllers/profileController");

router.get("/api/analyze/:username", analyzeProfile);
router.get("/api/repo-contributors/:owner/:repo", getContributors);
router.post("/api/snapshot/:username", recordSnapshotForUser);
router.get("/api/history/:username", getHistoryForUser);

module.exports=router;