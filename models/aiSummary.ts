import mongoose, { Model } from "mongoose";
import { IAISummary } from "@/types";

const AISummarySchema = new mongoose.Schema({
  eipNo: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  eipStatus: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

let AISummary: Model<IAISummary>;

try {
  AISummary = mongoose.model<IAISummary>("AISummary");
} catch {
  AISummary = mongoose.model<IAISummary>("AISummary", AISummarySchema);
}

export { AISummary };
