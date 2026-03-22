import mongoose, { Document, Schema } from "mongoose";

export interface IServiceSection {
  heading: string;
  paragraphs: string[];
  highlightedLink: { url: string; text: string };
  image: { src: string; alt: string };
}

export interface IService extends Document {
  slug: string;
  title: string;
  backgroundImage?: string;
  button: {
    text: string;
    link: string;
  };
  sections: IServiceSection[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSectionSchema = new Schema<IServiceSection>(
  {
    heading: { type: String, required: true },
    paragraphs: [{ type: String, required: true }],
    highlightedLink: {
      url: { type: String, required: true },
      text: { type: String, required: true },
    },
    image: {
      src: { type: String, required: true },
      alt: { type: String, required: true },
    },
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    backgroundImage: { type: String },
    button: {
      text: { type: String, required: true },
      link: { type: String, required: true },
    },
    sections: [serviceSectionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);
