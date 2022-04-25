'use strict';

import jwt from 'jsonwebtoken';

import { SECRETORKEY } from '../config/index.js';
import { Veterinary } from '../models/index.js';

export const protectWithJWT = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer'))
    return res.status(401).json({ msg: 'You have not sent a valid token' });

  const tokenWithoutBearer = token.split(' ')[1];

  try {
    const { id } = jwt.verify(tokenWithoutBearer, SECRETORKEY);
    const user = await Veterinary.findById(id).select(
      '-password -token -confirmed'
    );

    if (!user)
      return res
        .status(401)
        .json({ msg: 'Invalid token - user does not exist!' });

    req.authenticatedUser = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: 'Invalid token!' });
  }
};
