'use strict';

import express from 'express';

import {
  addVeterinary,
  perfil,
  confirmUser,
  authenticate,
  generateRecoveryToken,
  validateToken,
  genNewPassword,
  updateProfile,
  updatePassword,
} from '../controllers/veterinary.controller.js';
import {
  protectWithJWT,
  signUpRules,
  loginRules,
  updateProfileRules,
} from '../middlewares/index.js';

const router = express.Router();

// Public
router.route('/').post(signUpRules(), addVeterinary);

router.get('/confirm/:token', confirmUser);

router.post('/login', loginRules(), authenticate);

router.post('/password-recovery', generateRecoveryToken);

router
  .route('/password-recovery/:token')
  .get(validateToken)
  .post(genNewPassword);

// Private
router.route('/profile').get(protectWithJWT, perfil);
router.route('/profile/:id').put(
  [protectWithJWT, ...updateProfileRules()],

  updateProfile
);

router.put('/update-password', protectWithJWT, updatePassword);

export default router;
