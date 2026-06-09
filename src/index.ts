import express, { Application } from 'express';
import connectDB from './config/database';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app: Application = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register Routes
app.use('/api', customerRoutes);
app.use('/api', orderRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api', notificationRoutes);