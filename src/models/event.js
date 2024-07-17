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
    b_activo: {
      type: Boolean,
      default: true,
    },
    b_cancelado: {
      type: Boolean,
      default: false,
    },
    b_concluido: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model("Event", eventSchema);
