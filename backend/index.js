const express=require("express");
require("dotenv").config();
const profileRoutes = require("./routes/profileRoutes");
const app=express();

app.use(express.json());
app.use(profileRoutes);

const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server started at ${port}`);
});