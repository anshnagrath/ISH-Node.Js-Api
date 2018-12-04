import { mongoose } from "../../config/database";
import { Document, Model, Schema } from "mongoose";
export interface mail extends Document {
    name: String,
    email: String,
    message: String,

}
export interface mailModel extends Model<mail> {
}

let schema: Schema = new Schema({
    name: String,
    email: String,
    message: String,
}, { timestamps: true });

export const mail = mongoose.model<mail>("mail", schema) as mailModel;
