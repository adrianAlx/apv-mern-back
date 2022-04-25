'use strict';

import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/index.js';

(async () => {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    console.log('DB connectect to:', db.connection.name);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
})();
