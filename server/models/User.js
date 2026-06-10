import mongoose from 'mongoose';
import { decryptPassword, encryptPassword } from '../apis/Helper.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function encryptUserPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = encryptPassword(this.password);
  return next();
});

userSchema.methods.decryptPassword = function getDecryptedPassword() {
  return decryptPassword(this.password);
};

export const User = mongoose.model('User', userSchema);
