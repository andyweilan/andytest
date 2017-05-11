//注册视图的控制器
angular.module('tthApp').controller('registerCtrl', function($scope, $http, $rootScope, $location) {
	if (localStorage['User-Data'] !== undefined) {
		$location.path('/');
		return;
	}

	$scope.user = {
		username: '',
		password: '',
		userEmail: ''
	};
	$scope.ensure = "";

	$scope.register = function() {
		$scope.message = "";
		$scope.errorMsg = "";
		var regexp1 = /^[a-z][a-z0-9]{5,17}$/i; //过滤用户名用的正则
		var regexp2 = /^[a-z0-9]{6,18}$/i; //过滤密码用的正则
		if ($scope.user.username == '') {
			$scope.errorMsg = "用户名不能为空";
			return;
		}
		if ($scope.user.password == '') {
			$scope.errorMsg = "密码不能为空";
			return;
		}
		if (regexp1.test($scope.user.username)) {

			if (regexp2.test($scope.user.password)) {

				if ($scope.user.password == $scope.ensure) {

					$http.post('/auth/register', $scope.user).then(function onSuccess(res) {
						// Handle success
						var data = res.data;
						//alert(res.data.state);

						if (data.state == "success") {

							alert("注册成功，请登录");


							$location.path('/#/login');

						} else {

							$scope.message = data.message;

							return;
						}

					}).
					catch(function onError(res) {
						// Handle error
						//alert("fail post");
						$scope.errorMsg = "注册失败";
						return;

					});

				} else {
					$scope.errorMsg = "两个密码不一致";
					return;
				}

			} else {
				$scope.errorMsg = '密码只能包含字母和数字，6-18位';
				return;
			}

		} else {
			$scope.errorMsg = '用户名必须以字母开头，只能包含字母和数字，6-18位';
			return;
		}
	}
});