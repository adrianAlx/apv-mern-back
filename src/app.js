'use strict';

import express from 'express';

import './db/db.js';
import { setupMiddlewares, notFoundMiddleware } from './middlewares/index.js';
import { patientRoutes, veterinaryRoutes } from './routes/index.js';

// Initializations:
const app = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/api/veterinarians', veterinaryRoutes);
app.use('/api/patients', patientRoutes);

app.use(notFoundMiddleware);

export default app;
