//注册视图的控制器
angular.module('tthApp').controller('registerCtrl', function($scope, $http, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
		$location.path('/');
		return ;
	}
	
	$scope.user = {username: '', password: '', userEmail: ''};
	$scope.ensure = "";

	$scope.register = function(){
		$scope.message = "";
		$scope.errorMsg = "";
		var regexp1 = /^[a-z][a-z0-9]{5,17}$/i;					//过滤用户名用的正则
		var regexp2 = /^[a-z0-9]{6,18}$/i;						//过滤密码用的正则
		if($scope.user.username == ''){
			$scope.errorMsg = "用户名不能为空";
			return ;
		}
		if($scope.user.password == ''){
			$scope.errorMsg = "密码不能为空";
			return ;
		}
		if(regexp1.test($scope.user.username)){

			if(regexp2.test($scope.user.password)){

				if($scope.user.password == $scope.ensure){
					$http.post('/auth/register', $scope.user).success(function(res){
						if(res.state == "success"){
							$rootScope.authed = true;
							$rootScope.current_user = res.user.username;
							$rootScope.current_user_sign = res.user.sign;
							$rootScope.user_image_url = res.user.imageUrl;
							$rootScope.showImage = true;
							

							// var data = {
							// 	username: $scope.user.username
							// }
							// $http.post('/unread', data).success(function(res2){
							// 	if(res2.state == 'success'){
							// 		var realCount = 0;
							// 		for(var i = 0; i < res2.unread.length; i++){
							// 			if(!res2.unread[i].asure){
							// 				realCount++;
							// 			}
							// 		}
							// 		$rootScope.unreadCount = realCount;
							// 		res.user.unreadLength = realCount;
							// 		localStorage.setItem('User-Data', JSON.stringify(res.user));
							// 		$location.path('/');
							// 	}
							// });
						}
						else if(res.state == "failure"){
							$scope.message = res.message;
						}
					});
				}
				else {
					$scope.errorMsg = "两个密码不一致";
					return ;
				}

			}
			else{
				$scope.errorMsg = '密码只能包含字母和数字，6-18位';
				return ;
			}

		}
		else{
			$scope.errorMsg = '用户名必须以字母开头，只能包含字母和数字，6-18位';
			return ;
		}
	}
});