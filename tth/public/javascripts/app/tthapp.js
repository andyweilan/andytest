var app = angular.module('tthApp', ['ngRoute', 'smart-table']).run(function($rootScope, $http) {

	$rootScope.authed = false;
	$rootScope.current_user = "";
	$rootScope.current_user_sign = "这家伙很懒，什么个性签名也没留下";
	$rootScope.user_image_url = "";
	$rootScope.showImage = false;
	$rootScope.unreadCount = 0;
	$rootScope.showCount = false;

	
	$rootScope.logout = function() {
		localStorage.clear();
		$rootScope.authed = false;
		$rootScope.current_user = "";
		$rootScope.user_image_url = "";
		$rootScope.showImage = false;
	}

	// $http.get('/topics').success(function(res) {
	// 	if (res.state == 'success') {
	// 		$rootScope.topics = res.topics;
	// 	}
	// });

});

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');

	$routeProvider.when('/', {
		templateUrl: 'partials/main.html',
		controller: 'mainCtrl'
	}).when('/register', {
		templateUrl: 'partials/register.html',
		controller: 'registerCtrl'
	}).when('/login', {
		templateUrl: 'partials/login.html',
		controller: 'loginCtrl'
	}).when('/carestocks', {
		templateUrl: 'partials/carestocks.html',
		controller: 'careStocksCtrl'
	}).when('/postTopic', {
		templateUrl: 'app/postTopic/postTopic.html',
		controller: 'postTopicCtrl'
	}).when('/showTopic', {
		templateUrl: 'app/showTopic/showTopic.html',
		controller: 'showTopicCtrl'
	}).when('/modify', {
		templateUrl: 'app/modify/modify.html',
		controller: 'modifyCtrl'
	}).when('/edit', {
		templateUrl: 'app/edit/edit.html',
		controller: 'editCtrl'
	}).when('/userInfo', {
		templateUrl: 'app/userInfo/userInfo.html',
		controller: 'userInfoCtrl'
	}).when('/unread', {
		templateUrl: 'app/unread/unread.html',
		controller: 'unreadCtrl'
	}).when('/share', {
		templateUrl: 'app/share/share.html',
		controller: 'shareCtrl'
	}).when('/qanda', {
		templateUrl: 'app/qanda/qanda.html',
		controller: 'qandaCtrl'
	}).when('/employ', {
		templateUrl: 'app/employ/employ.html',
		controller: 'employCtrl'
	}).when('/news', {
		templateUrl: 'app/news/news.html',
		controller: 'newsCtrl'
	});

	// $locationProvider.html5Mode({
	//      enabled: true,
	//      requireBase: false
	//    });
});