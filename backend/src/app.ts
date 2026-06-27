import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import authRouter from './routes/auth.routes';
import leadRouter from './routes/lead.routes';
import dashboardRouter from './routes/dashboard.routes';
import swaggerRouter from './swagger/swagger';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api-docs', swaggerRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
