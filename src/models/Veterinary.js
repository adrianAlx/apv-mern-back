'use strict';

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
const { Schema, model } = mongoose;

const VeterinarySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    web: {
      type: String,
      default: null,
    },

    token: {
      type: String,
      default: null,
      // No se actualiza rapido, lo coloque en el controller
      // default: genId(),
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

VeterinarySchema.pre('save', async function (next) {
  // Si el pass ya esta hasheado NO lo vuelva a hashear
  if (!this.isModified('password')) return next();

  const hash = await bcryptjs.hash(this.password, 10);
  this.password = hash;

  next();
});

VeterinarySchema.methods.hashPassword = async password =>
  await bcryptjs.hash(password, 12);

VeterinarySchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

VeterinarySchema.methods.toJSON = function () {
  const user = this.toObject();
  user.uid = user._id;

  delete user.password;
  delete user._id;

  return user;
};

export default model('Veterinary', VeterinarySchema);
