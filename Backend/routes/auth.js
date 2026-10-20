const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to generate JWT token
function generateToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ✅ POST /api/auth/register
router.post('/register', function (req, res) {
  const { name, email, password, phone, address } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  User.findOne({ email: email.toLowerCase().trim() })
    .then(function (existingUser) {
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      // Create new user
      return User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        phone: phone || '',
        address: address || ''
      });
    })
    .then(function (user) {
      if (!user) return; // already responded above

      var token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token: token
      });
    })
    .catch(function (err) {
      console.error('❌ Register Error:', err);

      if (err.code === 11000) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      res.status(500).json({ message: 'Server error: ' + err.message });
    });
});

// ✅ POST /api/auth/login
router.post('/login', function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  User.findOne({ email: email.toLowerCase().trim() })
    .then(function (user) {
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: 'Your account has been blocked' });
      }

      return user.matchPassword(password).then(function (isMatch) {
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        var token = generateToken(user._id);

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          token: token
        });
      });
    })
    .catch(function (err) {
      console.error('❌ Login Error:', err);
      res.status(500).json({ message: 'Server error: ' + err.message });
    });
});

// ✅ GET /api/auth/profile
router.get('/profile', protect, function (req, res) {
  res.json(req.user);
});

// ✅ PUT /api/auth/profile
router.put('/profile', protect, function (req, res) {
  User.findById(req.user._id)
    .then(function (user) {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (req.body.name)    user.name    = req.body.name;
      if (req.body.phone)   user.phone   = req.body.phone;
      if (req.body.address) user.address = req.body.address;

      if (req.body.password && req.body.password.length >= 6) {
        user.password = req.body.password;
      }

      return user.save();
    })
    .then(function (updated) {
      if (!updated) return;
      var token = generateToken(updated._id);
      res.json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        address: updated.address,
        token: token
      });
    })
    .catch(function (err) {
      console.error('❌ Profile Update Error:', err);
      res.status(500).json({ message: 'Server error: ' + err.message });
    });
});

module.exports = router;