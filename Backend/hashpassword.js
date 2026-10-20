const bcrypt = require('bcryptjs');

const password = '123456'; // Change this to your password

bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash(password, salt, function (err, hash) {
    console.log('Original Password :', password);
    console.log('Hashed  Password  :', hash);
  });
});