import { Schema, model } from "mongoose";

export const eventSchema = new Schema(
  {
    id_user: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      publicId: {
        type: String,
      },
      secureUrl: {
        type: String,
      },
    },
    date: {
      type: Date,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model("Event", eventSchema);
