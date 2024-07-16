import { Schema, model } from "mongoose";

export const guestSchema = new Schema(
    {
      id_user: {
        ref: "User",
        type: Schema.Types.ObjectId,
        required: true,
      },
      id_event: {
        ref: "Event",
        type: Schema.Types.ObjectId,
        required: true,
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  );
  
  export default model("Guest", guestSchema);
  