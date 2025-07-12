import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export async function getAdminStats(req, res) {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const lowStock = await Product.find({ stock: { $lt: 5 } }).countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      totalSales: totalSales[0]?.total || 0,
      ordersCount,
      usersCount,
      productsCount,
      lowStock,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
