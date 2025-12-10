import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICarousel extends Document {
  title: string;
  image: string;
  link: string; // URL to redirect to
  order: number;
}

const CarouselSchema = new Schema<ICarousel>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Carousel: Model<ICarousel> = mongoose.models.Carousel || mongoose.model<ICarousel>('Carousel', CarouselSchema);

export default Carousel;
