import mongoose, { Document, Schema } from "mongoose";

export interface IProject {
  title?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  hoverTitle?: string;
  hoverDescription?: string;
  exploreLink?: string;
}

// Define the Quote schema
const QuoteSchema = new Schema({
  text: { type: String },
  author: { type: String },
});

// Define the Project schema
const ProjectSchema = new Schema({
  title: { type: String },
  location: { type: String },
  category: { type: String },
  imageUrl: { type: String },
  hoverTitle: { type: String },
  hoverDescription: { type: String },
  exploreLink: { type: String },
});

// Define the Stat schema
const StatSchema = new Schema({
  value: { type: String },
  label: { type: String },
});

// Define the Hero schema
const HeroSchema = new Schema({
  backgroundImageUrl: { type: String },
  title: { type: String },
  subtitle: { type: String },
  preTitle: { type: String },
});

// Define the CTA schema
const CtaSchema = new Schema({
  title: { type: String },
  description: { type: String },
});

// Define the main Portfolio schema
const PortfolioPageSchema = new Schema({
  hero: HeroSchema,
  quotes: [QuoteSchema], // Array of quotes
  residentialProjects: [ProjectSchema],
  commercialProjects: [ProjectSchema],
  stats: [StatSchema],
  cta: CtaSchema,
});

export interface IPortfolioPage extends Document {
  hero: {
    backgroundImageUrl?: string;
    title?: string;
    subtitle?: string;
    preTitle?: string;
  };
  quotes: Array<{
    text?: string;
    author?: string;
  }>;
  residentialProjects: IProject[];
  commercialProjects: IProject[];
  stats: Array<{
    value?: string;
    label?: string;
  }>;
  cta: {
    title?: string;
    description?: string;
  };
}

const PortfolioPage =
  mongoose.models.PortfolioPage ||
  mongoose.model<IPortfolioPage>("PortfolioPage", PortfolioPageSchema);

export default PortfolioPage;
