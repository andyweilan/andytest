//登录视图的控制器
angular.module('tthApp').controller('loginCtrl', function($scope, $http, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
		$location.path('/');
		return ;
	}
	$scope.user = {username: '', password: ''};

	$scope.login = function(){

		//若输入的密码含有非法字符，则无需后端处理，直接提示密码错误(因为注册时密码中不可出现非法字符，防止因被输入恶意脚本引发的安全隐患)

		var regexp1 = /^[a-z][a-z0-9]{5,17}$/i;					//过滤用户名用的正则
		var regexp2 = /^[a-z0-9]{6,18}$/i;						//过滤密码用的正则

		if(regexp1.test($scope.user.username) && regexp2.test($scope.user.password)){

			$http.post('/auth/login', $scope.user).success(function(res){
				////console.log('back-end asked');
				if(res.state == "success"){
					$rootScope.authed = true;
					$rootScope.current_user = res.user.username;
					$rootScope.current_user_sign = res.user.sign;
					$rootScope.user_image_url = res.user.imageUrl;
					$rootScope.showImage = true;
					//localStorage.setItem('User-Data', JSON.stringify(res.user));
					var data = {
						username: $scope.user.username
					}
					$http.post('/unread', data).success(function(res2){
						if(res2.state == 'success'){
							var realCount = 0;
							for(var i = 0; i < res2.unread.length; i++){
								if(!res2.unread[i].asure){
									realCount++;
								}
							}
							$rootScope.unreadCount = realCount;
							res.user.unreadLength = realCount;
							localStorage.setItem('User-Data', JSON.stringify(res.user));
							$location.path('/');
						}
					});
				}
				else if(res.state == "failure"){
					$scope.message = res.message;
				}
			});

		}
		else{
			$scope.message = '用户名或密码错误';
			return ;
		}
	}
	//$scope.loginWithGithub = function(){
		//好奇怪，为什么超链接的get方式与这个get方式不一样呢
		/*$http.get('/auth/github').success(function(res){
			console.log(res);
		});*/
		/*$http.get('/githubUserData').success(function(res){
			if(res.state == 'success' && res.userData){
				console.log(res);
				$rootScope.authed = true;
				$rootScope.current_user = res.userData.username;
				$rootScope.user_image_url = res.userData._json.avatar_url;
				$rootScope.showImage = true;
				if($rootScope.user_image_url == ""){
					$rootScope.user_image_url = "./app/images/coder.png";
				}
				else {
					//$rootScope.showImage = true;
				}
				$location.path('/');
			}
		});
	}*/
});