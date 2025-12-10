import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubCategory {
  name: string;
  slug: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  subcategories: ISubCategory[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    subcategories: [
      {
        name: { type: String, required: true },
        slug: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
