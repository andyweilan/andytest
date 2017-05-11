var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

module.exports.register = function(req, res) {

  var uname = req.body.username;
  var upwd = req.body.password;

  global.OPER.findUser(uname, function(err, user) {
    if (err) {
      console.log("There is an error for db when register");
      res.redirect('/auth/register');
    } else if (user) {
      console.log("User has already exists");
      res.redirect('/auth/register/existedUser');
    } else {

      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) { //加盐
        if (err) {
          console.log("encrypt pw fail 1");
          res.redirect('/auth/register');
        } else {
          bcrypt.hash(upwd, salt, function(err, hash) {
            if (err) {
              console.log("encrypt pw fail 2");
              res.redirect('/auth/register');
            } else {
              upwd = hash;

              OPER.createUser(uname, upwd, function(err, user) {
                if (err) {
                  console.log("create user fail");
                  res.redirect('/auth/register');
                } else {
                  console.log("Create user success");
                  res.status(200).send({
                    state: "success"
                  });
                  //res.status(200).send({state: "success", user: {username: req.body.username, imageUrl: user.imageUrl, sign: user.sign, unread: user.unread}});
                }
              });
            }
          })
        }
      });
    }
  });

}

module.exports.login = function(req, res) {

  var uname = req.body.username; //获取post上来的 data数据中 uname的值

  global.OPER.findUser(uname, function(err, user) { //通过此model以用户名的条件 查询数据库中的匹配信息
    if (err) {
      console.log("There is an error for db when login");
      res.redirect('/auth/login');
    } else if (user) {

      bcrypt.compare(req.body.password, user.password, function(err, obj) {

        if (obj) {

          console.log("find the user");

          req.session.user = user;
          res.status(200).send({
            state: "success",
            user: {
              username: req.body.username,
              imageUrl: user.imageUrl,
              sign: user.sign,
              unread: user.unread
            }
          });


        } else {
          console.log("Wrong username or password");
          res.redirect('/auth/login/userError');
        }

      });

    } else { //查询不到用户名匹配信息，则用户名不存在

      console.log("Wrong username or password");
      res.redirect('/auth/login/userError');

    }
  });

}