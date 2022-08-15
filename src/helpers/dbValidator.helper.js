'use strict';

import { Veterinary, Patient } from '../models/index.js';

export const isAlreadyRegistered = async (query, collection, req) => {
  let model;
  const { email } = req.body;

  const checkInCollection = () => {
    if (model)
      throw new Error(
        `The ${collection}${
          query.includes('@') ? "'s email" : ' name'
        } is already registered!`
      );
  };

  switch (collection) {
    case 'veterinary':
      model = await Veterinary.findOne({ email: query });
      return checkInCollection();

    case 'veterinary-update-profile':
      model = await Veterinary.findOne({ email: req.authenticatedUser.email });

      if (model.email !== email) {
        const existEmail = await Veterinary.findOne({ email });
        if (existEmail) throw new Error('Email already registered!');
      }
      return;

    default:
      throw new Error('Something went wrong!');
  }
};

export const idExistInDB = async (id, collection, req) => {
  let model;
  const { authenticatedUser } = req;

  const checkInCollection = () => {
    if (!model)
      throw new Error(`${collection} ID: '${id}' doesn't exist! - in Db`);
  };

  const isSameUser = () => {
    if (model.veterinary._id.toString() !== authenticatedUser._id.toString())
      throw new Error('Unauthorized!');
  };

  switch (collection) {
    case 'patient':
      model = await Patient.findById(id);
      checkInCollection();
      isSameUser();
      return;

    case 'user':
      model = await Veterinary.findById(id);
      checkInCollection();
      return;

    default:
      throw new Error('Something went wrong!');
  }
};
