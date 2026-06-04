import { Router, Request, Response } from 'express';
import Customer from '../models/Customer';

const router = Router();

// Task 1: Create Customer API
router.post('/customers', async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ message: 'Customer inserted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Task 3: Create Aggregation API
router.get('/customer-orders', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Customer.aggregate([
      {
        $lookup: {
          from: 'orders', // Name of the target collection in MongoDB
          localField: 'customerId',
          foreignField: 'customerId',
          as: 'orderDetails'
        }
      },
      { $unwind: '$orderDetails' }, // Deconstructs the array
      {
        $project: { // Formats the output
          _id: 0,
          customerId: 1,
          customerName: '$name',
          email: 1,
          city: 1,
          orderId: '$orderDetails.orderId',
          product: '$orderDetails.product',
          amount: '$orderDetails.amount',
          orderDate: '$orderDetails.orderDate'
        }
      }
    ]);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Bonus Task: Customer Purchase Summary
router.get('/customer-summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Customer.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'customerId',
          foreignField: 'customerId',
          as: 'orders'
        }
      },
      { $unwind: '$orders' },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$name' },
          totalOrders: { $sum: 1 },
          totalPurchaseAmount: { $sum: '$orders.amount' }
        }
      },
      { $sort: { totalPurchaseAmount: -1 } }, // Sorts by highest spender
      {
        $project: {
          _id: 0,
          customerId: '$_id',
          customerName: 1,
          totalOrders: 1,
          totalPurchaseAmount: 1
        }
      }
    ]);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;