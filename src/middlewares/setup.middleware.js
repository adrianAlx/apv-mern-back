'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { FRONT_END_URL } from '../config/index.js';

const allowedDomains = [FRONT_END_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1) return callback(null, true);

    return callback(new Error(`${origin} has been blocked by CORS`));
  },
};

export const setupMiddlewares = app => {
  app.use(cors());
  // app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use(express.static(path.join(__dirname, './../public')));
  app.use(compression()).use(helmet());
  app.use(morgan('dev'));

  // Other middlewares
};
