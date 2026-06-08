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

// Task 3: Create Aggregation API (With Pagination)
router.get('/customer-orders', async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract query parameters with default values
    // If the user doesn't provide them, it defaults to page 1, 10 items per page
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // 2. Calculate how many documents to skip
    const skipAmount = (page - 1) * limit;

    // 3. Execute the aggregation pipeline
    const data = await Customer.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'customerId',
          foreignField: 'customerId',
          as: 'orderDetails'
        }
      },
      { $unwind: '$orderDetails' },
      {
        $project: {
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
      },
      // 4. Apply pagination operators at the end
      { $skip: skipAmount },
      { $limit: limit }
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