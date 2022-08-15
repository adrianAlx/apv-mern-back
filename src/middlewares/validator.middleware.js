'use strict';

import { body, validationResult, param } from 'express-validator';

import { idExistInDB, isAlreadyRegistered } from '../helpers/index.js';
import { checkLoginCredentials } from './auth.middleware.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);

  return next();
};

// Auth
export const emailPassRules = () => [
  body('email', 'Invalid email!').isEmail(),
  body('password', 'Password must be longer than 6 characters!').isLength({
    min: 6,
  }),
];

export const signUpRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  ...emailPassRules(),
  validate,

  body('email').custom((email, { req }) =>
    isAlreadyRegistered(email, 'veterinary', req)
  ),
  validate,
];

export const loginRules = () => [
  ...emailPassRules(),
  validate,
  checkLoginCredentials,
];

// Users:
export const updateProfileRules = () => [
  body('email', 'Invalid email!').isEmail(),
  param('id', 'Invalid ID!').isMongoId(),
  body('name', 'Name is requires').notEmpty(),
  body('email').custom((email, { req }) =>
    isAlreadyRegistered(email, 'veterinary-update-profile', req)
  ),
  validate,

  param('id').custom((id, { req }) => idExistInDB(id, 'user', req)),
  validate,
];

// Patients:
export const addPatientRules = () => [
  body('name', "Pet's name is required!").notEmpty(),
  body('email', 'Invalid email!').isEmail(),
  body('owner', 'Owner is required!').notEmpty(),
  body('symptoms', 'Symptoms are required!').notEmpty(),
  validate,
];

export const getPatientRules = () => [
  param('id', 'Invalid ID!').isMongoId(),
  validate,
  param('id').custom((id, { req }) => idExistInDB(id, 'patient', req)),
  validate,
];

export const updatePatientRules = () => [...getPatientRules()];
export const deletePatientRules = () => [...getPatientRules()];
