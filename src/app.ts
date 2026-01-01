import cors from 'cors';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());
app.use(cors());

import globalErrorHandler from './app/middlewares/globalErrorHandler';

app.get('/', (req: Request, res: Response) => {
  res.send('Vehicle Rental System API Running!');
});

import router from './app/routes';

app.use(globalErrorHandler);

// Application routes
app.use('/api/v1', router);

// Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

export default app;
