import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Boolean, required: true },
});

const Settings =
  mongoose.models?.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;
