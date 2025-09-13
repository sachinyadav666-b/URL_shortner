// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import Url from "./models/Url.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,  // e.g. https://myportfolio-sachin.vercel.app
}));


// Connect Database
connectDB();

/* ========================
   AUTH ROUTES
======================== */
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/short", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if(!originalUrl){
      return res.status(500).json({ message: "originalUrl error" });
    }
    const shortUrl = nanoid(8)
    const url = new Url({ originalUrl, shortUrl })
    const myUrl = `process.env.BASE_URL/${shortUrl}`
    const qrCodeimg = await QRCode.toDataURL(myUrl)
    await url.save()
    res.status(200).json({ message: "URL Generated", shortUrl: myUrl, qrCodeimg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl })
    if(url){
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl)
    } else {
        return res.status(404).json({ error: "url not found" });
    }
  } catch (error) {

    res.status(500).json({ error: "Server error" });
  }
})


// Get all URLs (for admin panel)
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
  

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
