'use strict';

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PatientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient is required!'],
      trim: true,
    },
    owner: {
      type: String,
      required: [true, 'Owner is required!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      lowercase: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    symptoms: {
      type: String,
      required: true,
      trim: true,
    },
    veterinary: {
      type: Schema.Types.ObjectId,
      ref: 'Veterinary',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model('Patient', PatientSchema);
