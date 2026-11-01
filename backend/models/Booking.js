import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    bloodGroup: { type: String, required: true },
    diabetes: { type: Boolean, default: false },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number },
  destination: { type: String },
  phone: { type: String, required: true },
  altPhone: { type: String },
  guests: { type: Number, required: true },
  checkin: [{ type: Date, required: true }],
  checkout: [{ type: Date }],
  totalAmount: { type: Number, required: true },
  hiText: { type: String, required: true },
  status: { type: String, enum: ["pending", "paid", "Waiting...", "confirmed", "cancelled"], default: "pending" },
  utrNumber: { type: String },
  paymentScreenshot: { type: String },
  paymentAccessTokenHash: { type: String, select: false },
  guestDetails: {
    type: [guestSchema],
    default: [],
  },
});

export default mongoose.model("Booking", bookingSchema);

