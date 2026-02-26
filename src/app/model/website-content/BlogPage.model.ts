import mongoose, { Document, Schema } from "mongoose";

export interface IHeroContent {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export interface IContentBlock {
  type: "paragraph" | "image" | "heading" | "list" | "quote";
  text?: string;
  title?: string;
  url?: string;
  caption?: string;
  items?: string[];
}

export interface IArticleContent {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };

  meta: {
    readTime: string;
  };

  body: IContentBlock[];

  features: string[];

  tips: string[];
}

export interface IArticle {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorBio: string;
  date: string;

  content: IArticleContent;
}

export interface IFeaturedPost {
  title: string;
  postIds: string[];
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
    title: { type: String, required: false }, // Optional
    postIds: [{ type: String, required: false }], // Array of article IDs
  },
  categories: [{ type: String, required: true }],
  articles: [
    {
      id: { type: String, required: false }, // Optional

      imageUrl: { type: String, required: true }, // Required

      category: { type: String, required: false }, // Optional

      title: { type: String, required: true }, // Required

      description: { type: String, required: false }, // Optional

      author: { type: String, required: true }, // Required

      authorBio: { type: String, required: false }, // Optional

      date: { type: String, required: false }, // Optional

      content: {
        hero: {
          title: String,

          subtitle: String,

          imageUrl: String,
        },

        meta: {
          readTime: String,
        },

        body: [
          {
            type: {
              type: String,

              enum: ["paragraph", "image", "heading", "list", "quote"],
            },

            text: String,

            title: String,

            url: String,

            caption: String,

            items: [String],
          },
        ],

        features: [String],

        tips: [String],
      },
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
