import dotenv from 'dotenv';
import app from './app.js';
import { connectMongo } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`Shodhcode API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();





