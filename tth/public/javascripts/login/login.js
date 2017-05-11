//登录视图的控制器
angular.module('tthApp').controller('loginCtrl', function($scope, $http, $rootScope, $location) {
	if (localStorage['User-Data'] !== undefined) {
		$location.path('/');
		return;
	}
	$scope.user = {
		username: '',
		password: ''
	};

	$scope.login = function() {

		//若输入的密码含有非法字符，则无需后端处理，直接提示密码错误(因为注册时密码中不可出现非法字符，防止因被输入恶意脚本引发的安全隐患)

		var regexp1 = /^[a-z][a-z0-9]{5,17}$/i; //过滤用户名用的正则
		var regexp2 = /^[a-z0-9]{6,18}$/i; //过滤密码用的正则

		if (regexp1.test($scope.user.username) && regexp2.test($scope.user.password)) {

			$http.post('/auth/login',$scope.user).then(function onSuccess(res) {

				var data = res.data;

				alert(data.state);

				if (data.state == "success") {

					$rootScope.authed = true;
					$rootScope.current_user = data.user.username;
					$rootScope.current_user_sign = data.user.sign;
					$rootScope.user_image_url = data.user.imageUrl;
					$rootScope.showImage = true;


					// var postdata = {
					// 	username: $scope.user.username
					// }

					// $http.post('/unread', postdata).then(function onSuccess(res2) {
					// 	var data2 = res2.data;

					// 	if (data2.state == 'success') {
					// 		var realCount = 0;
					// 		for (var i = 0; i < data2.unread.length; i++) {
					// 			if (!data2.unread[i].asure) {
					// 				realCount++;
					// 			}
					// 		}
					// 		$rootScope.unreadCount = realCount;
					// 		data.user.unreadLength = realCount;
					// 		localStorage.setItem('User-Data', JSON.stringify(data.user));
					// 		$location.path('/');
					// 	}

					// }).catch(function onError(res) {
					// 	$scope.errorMsg = "获取未读失败";
					// 	$location.path('/');
					// 	return;
					// });

					localStorage.setItem('User-Data', JSON.stringify(data.user));

					$location.path('/');

				} else {

					$scope.message = data.message;
					return;
				}

			}).catch(function onError(res) {

				$scope.errorMsg = "登录失败";
				return;

			});

		} else {
			$scope.message = '用户名或密码错误';
			return;
		}
	}

});