import { Router, Request, Response } from 'express';
import Order from '../models/Order';

const router = Router();

// Task 2: Create Order API
router.post('/orders', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order inserted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message }); // Handles negative numbers/missing fields
  }
});

export default router;