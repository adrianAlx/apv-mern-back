'use strict';

import { Veterinary } from '../models/index.js';

export const checkLoginCredentials = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Veterinary.findOne({ email });
  const matchPass = await user?.comparePassword(password);
  if (!user || !matchPass)
    return res.status(403).json({
      ok: false,
      msg: 'There was a problem logging in. Check your email and password or create an account.',
    });

  // Check if it is a confirmed user
  if (!user.confirmed)
    return res
      .status(403)
      .json({ ok: false, msg: 'Your account has not been confirmed!' });

  return next();
};
