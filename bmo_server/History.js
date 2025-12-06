import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  user_response: { type: String, default: null },
  bmo_response: { type: String, default: null }
});

export default mongoose.models.History ||
  mongoose.model("History", historySchema, "chat"); 

