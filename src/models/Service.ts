import { model, Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  createdBy: Schema.Types.ObjectId;
}

const serviceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model<IService>("Service", serviceSchema);
