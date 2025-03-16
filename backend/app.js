import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import residentRoutes from "./routes/residentRoutes.js";
import db from "./config/db.js"; // Ensure this file exists
import authRoutes from "./routes/authRoutes.js"; // Ensure this file exists
const app = express();
const PORT = process.env.PORT || 5001;
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());

//app.use("/api",authRoutes);
app.use("/test", authRoutes);


app.use("/api/residents", residentRoutes);
app.get("/dashboard",(req,res)=> {
    res.render("dashboard",{title:"Admin Dashboard"});
});


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
