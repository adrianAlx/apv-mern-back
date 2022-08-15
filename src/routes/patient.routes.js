'use strict';

import express from 'express';

import {
  protectWithJWT,
  addPatientRules,
  getPatientRules,
  updatePatientRules,
  deletePatientRules,
} from '../middlewares/index.js';
import {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from './../controllers/patient.controller.js';

const router = express.Router();

router.use(protectWithJWT);

router
  .route('/')
  .post(addPatientRules(), addPatient)

  .get(getPatients);

router
  .route('/:id')
  .get(getPatientRules(), getPatient)
  .put(updatePatientRules(), updatePatient)
  .delete(deletePatientRules(), deletePatient);

export default router;
