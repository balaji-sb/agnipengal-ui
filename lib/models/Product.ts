import mongoose, { Schema, Document, Model } from 'mongoose';
import './Category'; // Ensure Category schema is registered

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  subcategory: string; // Storing slug relative to category
  stock: number;
  attributes?: Record<string, string>; // e.g. { material: 'Silk', brand: 'X' }
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String, required: true },
    stock: { type: Number, default: 0 },
    attributes: { type: Map, of: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for search/filtering could be added here
// ProductSchema.index({ slug: 1 }); // Already unique in schema definition
ProductSchema.index({ category: 1, subcategory: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
