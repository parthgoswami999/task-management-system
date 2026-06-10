import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authApi from './apis/Auth.js';
import healthApi from './apis/Health.js';
import tasksApi from './apis/Tasks.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { protect } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { decryptPassword, encryptPassword } from './apis/Helper.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthApi);
app.use('/api/auth', authApi);
app.use('/api/tasks', protect, tasksApi);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
    // console.log("decryptPassword: ", decryptPassword("e136a66c64668bdbc47ba9cc442d863c"));
    // console.log("encryptPassword: ", encryptPassword("newpassword123"));
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});
