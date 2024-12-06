import express, { Express } from 'express';
import audioRoutes from './routes/audioRoutes';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/audio', audioRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;