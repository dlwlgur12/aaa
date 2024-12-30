const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const SECRET_KEY = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => {
    console.error('MongoDB 연결 오류:', err);
    process.exit(1);
  });

app.use(cors());
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  brokerage: { type: String, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  stocks: [{
    symbol: String,
    name: String,
    logoUrl: String,
    quantity: Number,
    assetValue: Number,
    listingDate: Date,
    subscriptionDate: Date,
  }],
});

const User = mongoose.model('User', userSchema);

app.post('/api/login', require('./api/login'));
app.post('/api/signup', require('./api/signup'));
app.get('/api/user', async (req, res) => require('./api/user')(req, res));

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
