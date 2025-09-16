// models/TestimonialPage.ts
import mongoose, { Document, Schema } from "mongoose";

// Define interfaces
export interface ITestimonial {
  id: number;
  imageUrl: string;
  category: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface IStat {
  value: string;
  label: string;
}

export interface IHeroContent {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
}

export interface ICategory {
  name: string;
}

export interface ICtaContent {
  title: string;
  description: string;
}

export interface ITestimonialContent extends Document {
  hero: IHeroContent;
  categories: ICategory[];
  testimonials: ITestimonial[];
  stats: IStat[];
  cta: ICtaContent;
}

// Define Schemas
const TestimonialSchema = new Schema({
  id: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  quote: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true },
});

const StatSchema = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const HeroSchema = new Schema({
  backgroundImageUrl: { type: String, required: true },
  preTitle: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
});

const CategorySchema = new Schema({
  name: { type: String, required: true },
});

const CtaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Main Testimonial Page Schema
const TestimonialPageSchema = new Schema({
  hero: { type: HeroSchema, required: true },
  categories: [CategorySchema],
  testimonials: [TestimonialSchema],
  stats: [StatSchema],
  cta: { type: CtaSchema, required: true },
});

export default mongoose.models.TestimonialPage ||
  mongoose.model<ITestimonialContent>("TestimonialPage", TestimonialPageSchema);
