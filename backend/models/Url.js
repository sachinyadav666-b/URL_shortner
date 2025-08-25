import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },   // matches req.body.longUrl
    shortUrl: { type: String, required: true },
    clicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);

