const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS - Allow all localhost ports
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', function(req, res) {
  res.json({ message: 'FoodHub API Running ✅' });
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', port: process.env.PORT });
});

// Load routes safely
try {
  app.use('/api/auth',        require('./routes/auth'));
  console.log('✅ auth route loaded');
} catch(e) { console.error('❌ auth route error:', e.message); }

try {
  app.use('/api/restaurants', require('./routes/restaurants'));
  console.log('✅ restaurants route loaded');
} catch(e) { console.error('❌ restaurants route error:', e.message); }

try {
  app.use('/api/foods',       require('./routes/foods'));
  console.log('✅ foods route loaded');
} catch(e) { console.error('❌ foods route error:', e.message); }

try {
  app.use('/api/orders',      require('./routes/orders'));
  console.log('✅ orders route loaded');
} catch(e) { console.error('❌ orders route error:', e.message); }

try {
  app.use('/api/users',       require('./routes/users'));
  console.log('✅ users route loaded');
} catch(e) { console.error('❌ users route error:', e.message); }

try {
  app.use('/api/cart',        require('./routes/cart'));
  console.log('✅ cart route loaded');
} catch(e) { console.error('❌ cart route error:', e.message); }

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('✅ MongoDB Connected to food_hub');

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, function() {
      console.log('🚀 Server running on port ' + PORT);
      console.log('🔗 Test: http://localhost:' + PORT + '/api/health');
    });

    server.on('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        console.error('❌ Port ' + PORT + ' is busy!');
        console.error('👉 Fix: taskkill /IM node.exe /F');
        process.exit(1);
      }
    });
  })
  .catch(function(err) {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });