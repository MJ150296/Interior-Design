// models/aboutUsPage.model.js
import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  value: { type: String },
  label: { type: String },
});

const coreValueSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  icon: { type: String },
});

const teamMemberSchema = new mongoose.Schema({
  name: { type: String },
  title: { type: String },
  bio: { type: String },
  imageUrl: { type: String, default: "" },
  tags: [{ type: String }],
});

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String },
  imageURL: { type: String, default: "" },
  url: { type: String },
});

const aboutSchema = new mongoose.Schema({
  hero: {
    upperTitle: { type: String },
    title: { type: String },
    subtitle: { type: String },
    backgroundImageUrl: { type: String, default: "" },
  },
  stats: [statSchema],
  story: {
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    content2: { type: String },
    quote: { type: String },
    imageUrl: { type: String, default: "" },
    cities: { type: String },
  },
  coreValues: [coreValueSchema],
  teamMembers: [teamMemberSchema],
  connect: {
    socialLinks: [socialLinkSchema],
    address: { type: String },
    hours: { type: String },
    phone: { type: String },
  },
});

export default mongoose.models.AboutUsPage ||
  mongoose.model("AboutUsPage", aboutSchema);
