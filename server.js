const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const mongoPassword = process.env.MONGO_PASSWORD; 
const newMongoPassword = 'MYdulashijc2002'; 
const mongoURI = `mongodb+srv://Dulashi:${newMongoPassword}@cluster0.9judisz.mongodb.net/GlamCloth_Store`;

app.use('/images', express.static('images'));

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);


const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  sizes: [String],
  colors: [String],
  description: String,
  imageUrls: [String],
  available: Boolean
});
const Product = mongoose.model('Product', ProductSchema);


const OrderSchema = new mongoose.Schema({
  orderNumber: Number,
  fullName: String,
  email: String,
  streetAddress: String,
  city: String,
  postalCode: String,
  items: [String],
  totalNumberOfItems: Number,
  totalAmount: Number,
  cvc: String, 
  expiryDate: String 
});
const Order = mongoose.model('Order', OrderSchema);


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB Atlas connected');
  })
  .catch(err => {
    console.error('MongoDB Atlas connection error:', err);
  });

  
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder); 
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error saving order:', err); 
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error retrieving orders:', err); 
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    const user = new User(userData);
    const savedUser = await user.save();
    console.log('User account created successfully:', savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user account:', err); 
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/users/:email/:password', async (req, res) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else if (user.password !== password) {
      res.status(401).json({ message: 'Incorrect password' });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});