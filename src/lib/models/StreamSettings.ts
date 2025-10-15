import mongoose, { Schema } from 'mongoose';

export interface StreamSettings {
  rtspUrl: string;
  name: string;
  description?: string;
  autoPlay: boolean;
  showControls: boolean;
  defaultVolume: number;
  lastUpdated: Date;
}

const streamSettingsSchema = new Schema<StreamSettings>({
  rtspUrl: { type: String, required: true },
  name: { type: String, required: true, default: 'Default Stream' },
  description: { type: String },
  autoPlay: { type: Boolean, default: true },
  showControls: { type: Boolean, default: true },
  defaultVolume: { type: Number, default: 0.5, min: 0, max: 1 },
  lastUpdated: { type: Date, default: Date.now }
});

// Only create the model if it doesn't already exist (for HMR in development)
const StreamSettingsModel = mongoose.models.StreamSettings || 
  mongoose.model<StreamSettings>('StreamSettings', streamSettingsSchema);

export default StreamSettingsModel;