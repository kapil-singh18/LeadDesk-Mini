import mongoose, { Schema, Document } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Closed';

export interface ILead extends Document {
  name: string;
  email: string;
  budget: string;
  message: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    budget: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, retAny) => {
        const ret = retAny as Record<string, any>;
        ret.id = ret._id ? ret._id.toString() : '';
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

LeadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
