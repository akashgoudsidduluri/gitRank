const express=require("express");
require("dotenv").config();
const cors=require("cors");
const profileRoutes = require("./routes/profileRoutes");
const app=express();
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json());
app.use(profileRoutes);

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    });
});

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(process.env.GITHUB_TOKEN
    ? "GitHub token loaded"
    : "No GitHub token");
    console.log(`server started at ${port}`);
    
});