const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Hash password before saving — FIXED version
userSchema.pre('save', function (next) {
  const user = this;

  // Only hash if password was modified
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function (saltErr, salt) {
    if (saltErr) {
      return next(saltErr);
    }
    bcrypt.hash(user.password, salt, function (hashErr, hash) {
      if (hashErr) {
        return next(hashErr);
      }
      user.password = hash;
      next();
    });
  });
});

// Compare passwords — FIXED version
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);