// models/ContactPage.ts
import mongoose, { Document, Schema } from "mongoose";

// Define interfaces based on the ContactContent structure
export interface IHeroContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface IWhyChooseUsTab {
  title: string;
  icon: string;
  contentTitle: string;
  description: string;
}

export interface IWhyChooseUsFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IWhyChooseUs {
  title: string;
  description: string;
  tabs: IWhyChooseUsTab[];
  features: IWhyChooseUsFeature[];
}

export interface IContactInfoItem {
  icon: string;
  title: string;
  details: string;
}

export interface IContactInfo {
  items: IContactInfoItem[];
}

export interface IContactContent extends Document {
  hero: IHeroContent;
  whyChooseUs: IWhyChooseUs;
  contactInfo: IContactInfo;
}

// Define Schemas
const HeroSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  buttonText: { type: String, required: true },
});

const WhyChooseUsTabSchema = new Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  contentTitle: { type: String, required: true },
  description: { type: String, required: true },
});

const WhyChooseUsFeatureSchema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const WhyChooseUsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tabs: [WhyChooseUsTabSchema],
  features: [WhyChooseUsFeatureSchema],
});

const ContactInfoItemSchema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  details: { type: String, required: true },
});

const ContactInfoSchema = new Schema({
  items: [ContactInfoItemSchema],
});

// Main Contact Page Schema
const ContactPageSchema = new Schema({
  hero: { type: HeroSchema, required: true },
  whyChooseUs: { type: WhyChooseUsSchema, required: true },
  contactInfo: { type: ContactInfoSchema, required: true },
});

export default mongoose.models.ContactPage ||
  mongoose.model<IContactContent>("ContactPage", ContactPageSchema);
