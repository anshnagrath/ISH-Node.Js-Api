import { mongoose } from "../../config/database";
import { Document, Model, Schema } from "mongoose";
export interface agentsLocation extends Document {
    mobile: String,
    agentName: String,
    location: {
        type: [Number],
        index: '2d'
    }
}

export interface agentsLocationModel extends Model<agentsLocation> {
}

let schema: Schema = new Schema({
    mobile: String,
    agentName: { type: String },
    location: {
        type: [Number],
        index: '2d'
    }
}, { timestamps: true });
schema.index({ loc: '2d' });

export const agentLocation = mongoose.model<agentsLocation>("agentLocation", schema) as agentsLocationModel;
