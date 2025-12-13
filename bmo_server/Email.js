import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  email_address: { type: String, default: null }
});

export default mongoose.models.Email ||
  mongoose.model("Email", emailSchema, "email_logs");
