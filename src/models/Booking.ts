import { model, Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: Schema.Types.ObjectId;
  service: Schema.Types.ObjectId;
  status: "pending" | "confirmed" | "completed";
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (this: any, next) {
  this.populate({
    path: "service",
    select: "title description price",
  }).populate({
    path: "user",
    select: "name email",
  });
  next();
});
export default model<IBooking>("Booking", bookingSchema);
