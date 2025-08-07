import mongoose from "mongoose";

const carouselItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Main title for carousel
    subheading: { type: String, required: true }, // Subheading
    description: { type: String }, // Short description
    videoUrl: { type: String, required: true }, // Video link (Cloudinary or hosted)
    posterUrl: { type: String, required: true }, // Poster image for <video>
  },
  { _id: false }
);

const aboutUsSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    subheading: { type: String },
    paragraphOne: { type: String, required: true },
    paragraphTwo: { type: String },
    buttonOne: {
      text: { type: String },
      link: { type: String },
    },
    buttonTwo: {
      text: { type: String },
      link: { type: String },
    },
  },
  { _id: false }
);

const homepageSchema = new mongoose.Schema({
  carousel: [carouselItemSchema], // Multiple carousel slides

  servicesSection: {
    heading: { type: String, required: true },
    subheading: { type: String },
    // Instead of storing actual services, we can fetch from the Services model
    servicesRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  },

  aboutUsSection: aboutUsSchema,

  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Homepage ||
  mongoose.model("Homepage", homepageSchema);
