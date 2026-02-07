import mongoose, { Schema, Document } from "mongoose";

export interface IGPSData extends Document {
  tripId: mongoose.Types.ObjectId;
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: "on" | "off";
  speed: number;
}

const GPSDataSchema = new Schema<IGPSData>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    ignition: {
      type: String,
      enum: ["on", "off"],
      required: true,
    },
    speed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  },
);

export default mongoose.model<IGPSData>("GPSData", GPSDataSchema);
