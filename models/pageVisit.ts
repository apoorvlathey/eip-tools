import mongoose, { Model } from "mongoose";
import { IPageVisit } from "@/types";

const PageVisitSchema = new mongoose.Schema({
  eipNo: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

let PageVisit: Model<IPageVisit>;

try {
  PageVisit = mongoose.model<IPageVisit>("PageVisit");
} catch {
  PageVisit = mongoose.model<IPageVisit>("PageVisit", PageVisitSchema);
}

export { PageVisit };
