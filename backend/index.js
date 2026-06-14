const express=require("express");
require("dotenv").config();
const cors=require("cors");
const profileRoutes = require("./routes/profileRoutes");
const app=express();
app.use(cors());
app.use(express.json());
app.use(profileRoutes);

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(process.env.GITHUB_TOKEN
    ? "GitHub token loaded"
    : "No GitHub token");
    console.log(`server started at ${port}`);
    
});