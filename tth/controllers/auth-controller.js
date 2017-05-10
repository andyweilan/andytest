var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

module.exports.register = function(req, res){

	var uname = req.body.username;
 	var upwd = req.body.password;

  global.OPER.findUser(uname, function(err, user) { // 同理 /login 路径的处理方式
    if (err) {
    	console.log("There is an error");
      //res.send(500);
      //req.session.error = '网络异常错误！';
      //console.log(err);
    } else if (user) {
      //req.session.error = '用户名已存在！';
      //res.send(500);
      console.log("User has already exists");
    } else {

      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) { //加盐
        if (err) {
          //req.session.error = "加密密码错误";
          //res.send(404);
          console.log("加密错误1");
        } else {
          bcrypt.hash(upwd, salt, function(err, hash) {
            if (err) {
              //req.session.error = "加密密码错误";
              //res.send(404);
              console.log("加密错误2");
            } else {
              upwd = hash;

              OPER.createUser(uname, upwd, function(err, user) {
                if (err) {
                  //res.send(500);
                  //console.log(err);
                  console.log("创建失败");
                } else {
                  //req.session.error = '用户名创建成功！';
                  //res.send(200);
                  console.log("创建成功");
                }
              });
            }
          })
        }
      });
    }
  });
	

	// User.findOne({'username': req.body.username}, function(err, user){
	// 	if(err){
	// 		console.log("There is an error");
	// 		res.redirect('/auth/register');
	// 	}
	// 	if(user){
	// 		console.log("User has already exists");
	// 		res.redirect('/auth/register/existedUser');
	// 	}
	// 	else {
	// 		var user = new User();
	// 		user.username = req.body.username;
	// 		user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
	// 		console.log('-----------华丽的侦察机分割线-----------');
	// 		console.log(user.password);
	// 		user.signDate = Date.now();
	// 		user.imageUrl = './app/images/coder.png';
	// 		user.save(function(err){
	// 			if(err){
	// 				console.log("There is an error while saving the user");
	// 				res.redirect('/auth/register');
	// 			}
	// 			else{
	// 				res.send({state: "success", user: {username: req.body.username, imageUrl: user.imageUrl, sign: user.sign, unread: user.unread}});
	// 			}
	// 		});
	// 	}
	// });
}
