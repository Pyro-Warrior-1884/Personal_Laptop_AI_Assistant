import mongoose from "mongoose";

const customCommandSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  user_response: { type: String, default: null },
  bmo_response: { type: String, default: null }
});

export default mongoose.models.CustomCommand ||
  mongoose.model("CustomCommand", customCommandSchema, "custom_commands");
