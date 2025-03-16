import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Auth Routes Working!");
});




export default router;
