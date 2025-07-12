import Order from '../models/order.model.js';

export async function createOrder(req, res) {
  try {
    const order = new Order({ ...req.body, user: req.user._id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only update status, isPaid, isDelivered if present
    if (req.body.status) order.status = req.body.status;
    if (req.body.isPaid !== undefined) order.isPaid = req.body.isPaid;
    if (req.body.isDelivered !== undefined) order.isDelivered = req.body.isDelivered;
    // Save with validation disabled for partial update
    await order.save({ validateBeforeSave: false });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
