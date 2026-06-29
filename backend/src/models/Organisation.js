import mongoose from 'mongoose';

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organisation name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    createdBy: {
      type: String,
      default: 'super_admin',
    },
  },
  { timestamps: true }
);

organisationSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Organisation = mongoose.model('Organisation', organisationSchema);
export default Organisation;