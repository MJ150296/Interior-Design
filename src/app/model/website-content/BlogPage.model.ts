import mongoose, { Document, Schema } from "mongoose";

export interface IHeroContent {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export interface IArticle {
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
}

export interface IFeaturedPost {
  title: string;
  post: IArticle;
}

export interface INewsletterContent {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
}

export interface IBlogContent extends Document {
  hero: IHeroContent;
  featured: IFeaturedPost;
  categories: string[];
  articles: IArticle[];
  newsletter: INewsletterContent;
}

const BlogPageSchema: Schema = new Schema({
  hero: {
    backgroundImageUrl: { type: String, required: true },
    preTitle: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    searchPlaceholder: { type: String, required: true },
  },
  featured: {
    title: { type: String, required: true },
    post: {
      imageUrl: { type: String, required: true },
      category: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      author: { type: String, required: true },
      date: { type: String, required: true },
    },
  },
  categories: [{ type: String, required: true }],
  articles: [
    {
      imageUrl: { type: String, required: true },
      category: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      author: { type: String, required: true },
      date: { type: String, required: true },
    },
  ],
  newsletter: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    placeholder: { type: String, required: true },
    buttonText: { type: String, required: true },
    privacyText: { type: String, required: true },
  },
});

export default mongoose.models.BlogPage ||
  mongoose.model<IBlogContent>("BlogPage", BlogPageSchema);
