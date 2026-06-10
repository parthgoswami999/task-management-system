import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema(
  {
    errorMessage: {
      type: String,
      required: true,
      trim: true
    },
    apiCode: {
      type: Number,
      required: true
    },
    apiUrl: {
      type: String,
      required: true,
      trim: true
    },
    userID: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);
