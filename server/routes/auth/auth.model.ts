import { mongoose } from "../../config/database";
import { Document, Model, Schema } from "mongoose";
export interface auth extends Document {
    email: String,
    password: String,
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
    }
}
export interface authModel extends Model<auth> {
}

let schema: Schema = new Schema({
    email: { type: String },
    password: { type: String },
    facebook: {
        id: { type: String },
        token: { type: String },
        email: { type: String },
        name: { type: String }
    }
}, { timestamps: true });

export const auth = mongoose.model<auth>("auth", schema) as authModel;
