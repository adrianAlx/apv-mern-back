import express from 'express';
import { check } from 'express-validator';

import {
  addVeterinary,
  perfil,
  confirmUser,
  authenticate,
  passwordRecovery,
  validateToken,
  genNewPassword,
  updateProfile,
  updatePassword,
} from '../controllers/veterinary.controller.js';
import { isAlreadyRegistered, idExistInDB } from '../helpers/index.js';
import {
  validateInputs,
  checkLoginCredentials,
  protectWithJWT,
} from '../middlewares/index.js';

const router = express.Router();

// Public
router.route('/').post(
  [
    check('email', 'Invalid email!').isEmail(),
    check('name', 'Invalid name!').notEmpty(),
    check('password', 'Password must be longer than 6 characters!').isLength({
      min: 6,
    }),
    validateInputs,
    check('email').custom(email => isAlreadyRegistered(email, 'veterinary')),
    validateInputs,
  ],
  addVeterinary
);

router.get('/confirm/:token', confirmUser);

router.post(
  '/login',
  [
    check('email', 'Invalid email!').isEmail(),
    check('password', 'Password is required!').notEmpty(),
    validateInputs,
    checkLoginCredentials,
  ],

  authenticate
);

router.post('/password-recovery', passwordRecovery);
router
  .route('/password-recovery/:token')
  .get(validateToken)
  .post(genNewPassword);

// Private
router.route('/perfil').get(protectWithJWT, perfil);
router.route('/profile/:id').put(
  [
    protectWithJWT,
    check('email', 'Invalid email!').isEmail(),
    check('id', 'Invalid ID!').isMongoId(),
    check('name', 'Name is requires').notEmpty(),
    check('email').custom((email, { req }) =>
      isAlreadyRegistered(email, 'veterinary-update-profile', req)
    ),
    validateInputs,

    check('id').custom((id, { req }) => idExistInDB(id, 'user', req)),
    validateInputs,
  ],

  updateProfile
);

router.put('/update-password', protectWithJWT, updatePassword);

export default router;
