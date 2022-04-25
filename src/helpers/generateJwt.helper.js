import jwt from 'jsonwebtoken';

import { SECRETORKEY } from '../config/index.js';

export const generateToken = id =>
  jwt.sign({ id }, SECRETORKEY, { expiresIn: '24h' });
