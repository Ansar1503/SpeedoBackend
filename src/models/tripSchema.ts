import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  startTime: Date;
  endTime: Date;
  totalDistance: number;
  totalDuration: number;
  totalIdlingDuration: number;
  totalStoppageDuration: number;
  overspeedDuration: number;
  overspeedDistance: number;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startTime: Date,
    endTime: Date,
    totalDistance: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalIdlingDuration: {
      type: Number,
      default: 0,
    },
    totalStoppageDuration: {
      type: Number,
      default: 0,
    },
    overspeedDuration: {
      type: Number,
      default: 0,
    },
    overspeedDistance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITrip>("Trip", TripSchema);
