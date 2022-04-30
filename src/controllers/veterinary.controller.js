'use strict';

import { generateToken } from '../helpers/index.js';
import { Veterinary } from '../models/index.js';
import { genId } from '../helpers/index.js';
import { emailRegister, emailResetPassword } from '../helpers/index.js';

export const getVeterinary = async (_req, res) => {
  res.status(200).json({ ok: true, msg: 'Get veterinary' });
};

export const addVeterinary = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const veterinary = new Veterinary({
      name,
      email,
      password,
      phone,
      token: genId(),
    });

    await veterinary.save();

    // Send confirmation email
    emailRegister({
      email,
      name,
      token: veterinary.token,
    });

    res.status(201).json({
      ok: true,
      msg: 'User successfully created, check your email',
    });
  } catch (error) {
    console.log(error);
    console.log({ error: error.message });
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const confirmUser = async (req, res) => {
  const { token } = req.params;

  const unconfirmedUser = await Veterinary.findOne({ token });
  if (!unconfirmedUser)
    return res.status(400).json({ ok: false, msg: 'Invalid token!' });

  try {
    // Actualizar documento MongoDB
    unconfirmedUser.token = null;
    unconfirmedUser.confirmed = true;
    await unconfirmedUser.save();

    res.status(200).json({ ok: true, msg: 'Successful confirmation!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const authenticate = async (req, res) => {
  const { email } = req.body;
  const user = await Veterinary.findOne({ email });

  // Generate JWT
  const token = generateToken(user.id);
  if (!token)
    return res
      .status(500)
      .json({ msg: 'Sorry, the token could not be generated.' });

  // console.log(user.id);

  res.status(200).json({
    ok: true,
    msg: 'Successful login!',
    token,
    user: {
      uid: user.id,
      name: user.name,
      web: user.web,
      phone: user.phone,
      email: user.email,
    },
  });
};

// // Validar el email del user  -  Recuperar pass
// generateRecoveryToken
export const passwordRecovery = async (req, res) => {
  const { email } = req.body;
  const userExist = await Veterinary.findOne({ email });

  // TODO: Validar si user existe en  routers - UNIR estos dos checks
  if (!userExist)
    return res.status(401).json({ ok: false, msg: 'User does not exist!' });

  // TODO: Validar usuario confirmado con un middleware
  if (!userExist.confirmed)
    return res
      .status(403)
      .json({ ok: false, msg: 'Your account has not been confirmed!' });

  userExist.token = genId();
  await userExist.save();

  // Send email with token/instructions
  const { name, token } = userExist;
  emailResetPassword({
    email,
    name,
    token,
  });

  res
    .status(200)
    .json({ ok: true, msg: 'An e-mail with instructions has been sent' });
};

// TODO: ??? Validar token en el aut.middleware
export const validateToken = async (req, res) => {
  const { token } = req.params;

  const user = await Veterinary.findOne({ token });
  if (!user)
    return res.status(401).json({ ok: false, msg: 'Invalid token - No user' });

  res.status(200).json({ ok: true, msg: 'Successful validation!', user });
};

export const genNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await Veterinary.findOne({ token });
  if (!user)
    return res
      .status(401)
      .json({ ok: false, msg: 'Invalid token - No user - Gen New Pass' });

  try {
    user.token = null;
    user.password = password;
    await user.save();

    res
      .status(200)
      .json({ ok: true, msg: 'Password successfully updated!', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const perfil = async (req, res) => {
  const { authenticatedUser } = req;

  res.status(200).json({ ok: true, user: authenticatedUser });
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { authenticatedUser } = req;
  const { name, email, phone, web, uid } = req.body;

  if (authenticatedUser.id !== uid)
    return res.status(401).json({ ok: false, msg: 'Unauthorized!' });

  const updatedUser = await Veterinary.findByIdAndUpdate(
    id,
    { name, email, phone, web, uid },
    { new: true }
  );

  res
    .status(200)
    .json({ ok: true, msg: 'User successfully updated!', user: updatedUser });
};

export const updatePassword = async (req, res) => {
  const { authenticatedUser } = req;
  const { currentPassword, newPassword } = req.body;
  const veterinary = await Veterinary.findOne({
    email: authenticatedUser.email,
  });

  if (!veterinary)
    return res
      .status(401)
      .json({ ok: false, msg: 'Unauthorized! - User does not exist in DB' });

  const isSamePassword = await veterinary.comparePassword(currentPassword);
  if (!isSamePassword)
    return res
      .status(401)
      .json({ ok: false, msg: 'The current password is incorrect!' });

  veterinary.password = newPassword;
  await veterinary.save();

  res
    .status(200)
    .json({ ok: true, msg: 'The password has been successfully updated!' });
};
