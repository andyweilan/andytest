"use strict";

var host = 'localhost'; //'10.86.18.201';
var port = 3000;


/*
angular.module('tthApp').directive('compile', function($compile) {

  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
    );
  };
});
*/



angular.module('tthApp').controller('careStocksCtrl', function($scope, $http, $location, $compile, $rootScope) {

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

    $location.path('/login');
    return;

  }

//alert("hello");

var socket = io.connect('http://' + host + ':' + port);

  $scope.rowCollection = [];

  $scope.favorStockList = '';


  //$scope.user = JSON.parse(localStorage['User-Data']);


  socket.on('hello', function() {

    socket.emit('start_stock', $scope.user.username);

  });

  socket.on('err_message', function(data) {

    alert(data);

  });

  socket.on('init_list', function(data) {

    $scope.favorStockList = data;

  });

  socket.on('favor_stock_add', function(data) {

    if ($scope.favorStockList) {

      $scope.favorStockList = $scope.favorStockList + ',' + data;

    } else {

      $scope.favorStockList = data;
    }

  });

  socket.on('favor_stock_remove', function(data) {

    var list = $scope.favorStockList;

    list = list.replace(',' + data, '');

    list = list.replace(data, '');

    $scope.favorStockList = list;


  });

  socket.on('private_stocks', function(data) {


    $scope.rowCollection = data.stocks;

    $scope.$apply();


    $('updatetime').html('最后更新时间:' + data.time);

    socket.emit('stock_real_time', $scope.favorStockList);

  });



  $scope.addstock = {
    text: '',
    pattern: /^[0-9]*$/
  };


  $scope.idChanging = function(val) {

    if (!val) return;

    var postdata = {
      "code": val
    };


    $http.post('/api/stocklist', postdata).then(function onSuccess(res) {

      //alert('success');

      var data = res.data;

      if (data.state == "success") {

        var stlist = "";

        for (var i = 0; i < data.list.length; ++i) {

          var code = data.list[i].code;

          var name = data.list[i].name;

          var ex = data.list[i].ex;

          var li = '<li style="cursor:pointer;TEXT-DECORATION: underline;" id="stockslist" sid=' + code + ' ng-click=selectid("'+code+'") >' + ex + code + '  ' + name + '</li>';

          stlist += li;

        }

        if (stlist) {
          stlist = "<ul>" + stlist + "</ul>";
          //alert(stlist);

          var $html = $compile(stlist)($scope);

          $('#search_auto').html($html).css('display', 'block');

        } else {

          $('#search_auto').html('').css('display', 'none');
        }

      }


    }).catch(function onError(res) {

      alert('fail');

    });


  };

  $scope.overAuto = function() {
    //alert("in");
    $('#search').attr('rel', 2);

  };

  $scope.leaveAuto = function() {
    //alert("out");
    $('#search').attr('rel', 1);

  };

  $scope.lostAuto = function() {
    //alert($('#search').attr('rel'));

    if ($('#search').attr('rel') != 2) {
      $('#search_auto').css('display', 'none');

      //$('#id_input').val('');
      $scope.addstock.text = '';
    }

  };

  $scope.selectid = function(val) {
    
    //alert(val);

    if (val && $scope.user.username) {
      socket.emit("add_stock", val, $scope.user.username);
    }

    $('#search').attr('rel', 0);

    $('#search_auto').html('').css('display', 'none');

    //$('#id_input').val('');
    $scope.addstock.text = '';

  };

  $scope.remove = function(row) {

    var result = confirm('确定要删除:' + row.stockCode + '?');

    if (result) {

      socket.emit("remove_stock", row.stockCode, $scope.user.username);

    }

  };

  $scope.viewHisPrices = function(row) {

    window.open('#/hisprices/' + row.stockCode + '/' + row.stockName, '_blank');
    //$location.path('hisprices/' + row.stockCode + '/' + row.stockName);

  };

  $scope.viewFinance = function(row) {

    window.open('#/finance/' + row.stockCode + '/' + row.stockName, '_blank');

  };

});