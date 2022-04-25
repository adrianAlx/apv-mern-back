'use strict';

import express from 'express';
import { check } from 'express-validator';

import { validateInputs, protectWithJWT } from '../middlewares/index.js';
import { idExistInDB } from '../helpers/index.js';
import {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from './../controllers/patient.controller.js';

const router = express.Router();

// Podriamos usarlo asi como middleware de todo el router
router.use(protectWithJWT);

router
  .route('/')
  .post(
    [
      // protectWithJWT,
      check('name', "Pet's name is required!").notEmpty(),
      check('email', 'Invalid email!').isEmail(),
      check('owner', 'Owner is required!').notEmpty(),
      check('symptoms', 'Symptoms are required!').notEmpty(),
      validateInputs,
    ],

    addPatient
  )

  // TODO: Cachear
  .get(
    // protectWithJWT,
    getPatients
  );

router
  .route('/:id')
  .get(
    [
      // protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      validateInputs,
      check('id').custom((id, { req }) => idExistInDB(id, 'patient', req)),
      validateInputs,
    ],

    getPatient
  )
  .put(
    [
      // protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      validateInputs,
      check('id').custom((id, { req }) => idExistInDB(id, 'patient', req)),
      validateInputs,
    ],

    updatePatient
  )
  .delete(
    [
      // protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      validateInputs,
      check('id').custom((id, { req }) => idExistInDB(id, 'patient', req)),
      validateInputs,
    ],
    
    deletePatient
  );

export default router;
