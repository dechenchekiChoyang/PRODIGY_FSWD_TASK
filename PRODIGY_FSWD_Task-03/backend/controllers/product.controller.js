import Product from '../models/product.model.js';

export async function getProducts(req, res) {
  try {
    const { category, sortBy, order, minPrice, maxPrice, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.name = { $regex: search, $options: 'i' };
    let sort = {};
    if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;
    const products = await Product.find(filter).sort(sort);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createProduct(req, res) {
  try {
    let imagePath = req.body.image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    const product = new Product({ ...req.body, image: imagePath });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update fields
    Object.assign(product, req.body);
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
