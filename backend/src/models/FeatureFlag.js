import mongoose from 'mongoose';

const featureFlagSchema = new mongoose.Schema(
  {
    feature_key: {
      type: String,
      required: [true, 'Feature key is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9_]+$/,
        'Feature key can only contain lowercase letters, numbers, and underscores',
      ],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: [true, 'Organisation is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

featureFlagSchema.index({ feature_key: 1, organisation: 1 }, { unique: true });

const FeatureFlag = mongoose.model('FeatureFlag', featureFlagSchema);
export default FeatureFlag;