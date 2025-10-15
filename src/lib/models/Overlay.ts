import mongoose, { Schema } from 'mongoose';

// Base type for all overlays
interface BaseOverlay {
  name: string;
  type: 'text' | 'image';
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type for text overlay
interface TextOverlay extends BaseOverlay {
  type: 'text';
  content: string;
  style: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    backgroundColor: string;
    opacity: number;
    textAlign: 'left' | 'center' | 'right';
  };
}

// Type for image overlay
interface ImageOverlay extends BaseOverlay {
  type: 'image';
  imageUrl: string;
  alt: string;
  style: {
    opacity: number;
    border: string;
    borderRadius: number;
  };
}

// Combined type for any kind of overlay
export type Overlay = TextOverlay | ImageOverlay;

// Schema for the position
const positionSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
}, { _id: false });

// Schema for the size
const sizeSchema = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
}, { _id: false });

// Schema for the text style
const textStyleSchema = new Schema({
  fontFamily: { type: String, required: true, default: 'Arial' },
  fontSize: { type: Number, required: true, default: 16 },
  fontWeight: { type: String, required: true, default: 'normal' },
  color: { type: String, required: true, default: '#ffffff' },
  backgroundColor: { type: String, default: 'transparent' },
  opacity: { type: Number, required: true, default: 1 },
  textAlign: { type: String, required: true, default: 'left', enum: ['left', 'center', 'right'] },
}, { _id: false });

// Schema for the image style
const imageStyleSchema = new Schema({
  opacity: { type: Number, required: true, default: 1 },
  border: { type: String, default: 'none' },
  borderRadius: { type: Number, default: 0 },
}, { _id: false });

// Main overlay schema with discriminator for different types
const overlaySchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['text', 'image'] },
  position: { type: positionSchema, required: true },
  size: { type: sizeSchema, required: true },
  zIndex: { type: Number, required: true, default: 1 },
  visible: { type: Boolean, required: true, default: true },
}, { 
  timestamps: true, 
  discriminatorKey: 'type',
  strict: false
});

// Text overlay schema 
const textOverlaySchema = new Schema({
  content: { type: String, required: true },
  style: { type: textStyleSchema, required: true },
});

// Image overlay schema
const imageOverlaySchema = new Schema({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: 'Image overlay' },
  style: { type: imageStyleSchema, required: true },
});

// Create models with a check to prevent duplicate discriminator registration
let OverlayModel: mongoose.Model<any>;

// Check if the model already exists
if (mongoose.models.Overlay) {
  OverlayModel = mongoose.models.Overlay;
} else {
  // Only create and register discriminators if this is the first time
  OverlayModel = mongoose.model('Overlay', overlaySchema);
  
  // Add discriminators for different overlay types
  OverlayModel.discriminator('text', textOverlaySchema);
  OverlayModel.discriminator('image', imageOverlaySchema);
}

export default OverlayModel;