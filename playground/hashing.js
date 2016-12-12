const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//1st arg is # of rounds to gen the salt, intentionally makes bcrypt take longer to avoid people from brute-forcing the pw
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
    //logs $2a$10$jGKrk7v5hvzGFeeQwAC.de0Fh4La6J3ilpcDF3G69Btsc1f2DzgQG
  });
});

var hashedPassword = '$2a$10$jGKrk7v5hvzGFeeQwAC.de0Fh4La6J3ilpcDF3G69Btsc1f2DzgQG';

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
  //logs true because '123abc!' equals hashedPassword
});

//Practice with JWT
// var data = {
//   id: 10
// };
// //takes data and signs it, creates hash and returns token value
// var token = jwt.sign(data, '123abc');
// //token made up of 3 parts: header.payload.hash
// console.log(token); //can decode our token at jwt.io
//
// //takes token and secret and verifies data was not manipulated
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);



//Practice using SHA256
// var message = 'I am user number 3';
//
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// //Make token data different to mimic client attempting to alter data, hash now lacks 'salt'
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do NOT trust');
// }
