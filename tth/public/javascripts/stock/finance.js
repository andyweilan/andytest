"use strict";


angular.module('tthApp').controller('financeCtrl', function($scope, $http, $location, $rootScope) {

	if (localStorage['User-Data'] !== undefined) {
		$scope.user = JSON.parse(localStorage['User-Data']);
		////console.log($scope.user);
		$rootScope.current_user = $scope.user.username;
		$rootScope.current_user_sign = $scope.user.sign;
		$rootScope.authed = true;
		$rootScope.showImage = true;
		$rootScope.user_image_url = $scope.user.imageUrl;
		$rootScope.unreadCount = $scope.user.unreadLength;
		$rootScope.showCount = $rootScope.unreadCount > 0 ? true : false;
		////console.log($scope.user.imageUrl);
	} else {

		//$location.path('/login');
		return;

	}


	$scope.itemsByPage = 8;

	var url = $location.url();

	//alert(url);

	var pathvalue = url.split('/');

	var stcode = '';
	var stname = '';
	if (pathvalue.length >= 4) {
		stcode = pathvalue[2];
		stname = pathvalue[3];
	}

	//alert(stcode);

	if (!stcode) {

		return;
	}

	$('stockcode').html(' 股票代码:' + stcode);
	$('stockname').html(' 股票名称:' + decodeURI(stname));

	var postdata = {
		"code": stcode
	};

	$http.post('/api/finance', postdata).then(function onSuccess(res) {

		//alert('success');

		var data = res.data;

		if (data.state == "success") {

			$scope.rowCollection = data.list;

		}


	}).catch(function onError(res) {

		alert('fail');

	});

});