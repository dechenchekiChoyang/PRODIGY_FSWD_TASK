import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export async function createReview(req, res) {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment
    });
    await review.save();
    // Update product rating
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getReviewsByProduct(req, res) {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
