var app = angular.module('tthApp').controller('mainCtrl', function($scope, $http, $rootScope) {

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
    }

    // $rootScope.visible = true;


    // $rootScope.getStockList = function() {
    //     alert("getStockList");
    //     socket.emit("get_stocklist", $rootScope.current_user);
    // };


});