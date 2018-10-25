import { mongoose } from "../../config/database";
import { Document, Model, Schema } from "mongoose";


export interface Product extends Document {
    producctName: String,
    quatity: String,
    region: String,
    productSpecifications: Array<Object>,
    currency: String,
    productPrice: String,
    paymentMode: String,
    deliveryAddress: Object,
    agentAssigned: String
}

export interface ProductModel extends Model<Product> {
}

let schema: Schema = new Schema({
    producctName: { type: String },
    quatity: { type: String },
    region: { type: String },
    productSpecifications: { type: Array },
    currency: { type: String },
    productPrice: { type: String },
    paymentMode: { type: String },
    deliveryAddress: { type: Object },
    agentAssigned: { type: String }
}, { timestamps: true });



export const Product = mongoose.model<Product>("product", schema) as ProductModel;
