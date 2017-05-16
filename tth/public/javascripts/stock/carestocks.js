"use strict";

var host = 'localhost'; //'10.86.18.201';
var port = 3000;

var socket = io.connect('http://' + host + ':' + port);

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

angular.module('tthApp').controller('careStocksCtrl', function($scope, $http, $rootScope, $location, $compile, $route) {

  if (localStorage['User-Data'] == undefined) {
    $location.path('/login');
    return;
  }

  $scope.user = JSON.parse(localStorage['User-Data']);


  socket.on('hello', function() {

    socket.emit('start_stock', $scope.user.username);

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

          var li = '<li style="cursor:pointer;TEXT-DECORATION: underline;" id="stockslist" sid=' + code + ' ng-click="selectid(' + code + ')" >' + code + '  ' + name + '</li>';

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

  $scope.selectid = function(val) {
    //alert(val);

    if (val && $scope.user.username) {
      socket.emit("add_stock", val, $scope.user.username);
    }

    $('#search').attr('rel', 0);

    $('#search_auto').html('').css('display', 'none');

    $('#id_input').val('');
    $scope.addstock.text = '';

  };

});
/*
  socket.on('private_stock', function(data) {

    $scope.rowCollection = data.stocks;


    $('updatetime').html('最后更新时间:' + data.time);

    $route.reload();

  });

  socket.on('err_message', function(data) {

    alert(data);

  });


  $scope.addItem = function(val) {

    var id = val;

    if (id) {
      socket.emit("add_stock", id);
    }
  };


  $scope.idChanging = function(val) {

    if (!val) return;

    var postdata = {
      "id": val
    };

    $.ajax({
      url: '/stocklist',
      type: 'post',
      data: postdata,
      success: function(data, status) {
        if (status == 'success') {

          var list = '<ul>';
          var nodata = true;

          $.each(data, function(index, st) {

            //var d = '<li style="cursor:pointer;TEXT-DECORATION: underline;" id="stockslist" sid=' + st.code + ' onclick="selectid(' + st.code + ')" >' + st.code + '  ' + st.name + '</li>';

            var d = '<li style="cursor:pointer;TEXT-DECORATION: underline;" id="stockslist" sid=' + st.code + ' ng-click="selectid(' + st.code + ')" >' + st.code + '  ' + st.name + '</li>';


            list += d;

            nodata = false;

          });

          list += '</ul>';

          var $html = compile(list)(scope);


          if (nodata) {
            $('#search_auto').html('').css('display', 'none');
          } else {
            $('#search_auto').html($html).css('display', 'block');
          }
        }
      },
      error: function(data, err) {
        //location.href = 'register';
      }
    });


  };


  $scope.addstock = {
    text: '',
    pattern: /^[0-9]*$/
  };

  $scope.remove = function(row) {

    var result = confirm('确定要删除:' + row.stockCode + '?');

    if (result) {

      var id = getStockID(row.stockCode);

      socket.emit("del_stock", id);

    }

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

      $('#id_input').val('');
      $scope.addstock.text = '';
    }

  };

  $scope.selectid = function(val) {
    //alert(val);

    if (val) {
      socket.emit("add_stock", val);
    }

    $('#search').attr('rel', 0);

    $('#search_auto').html('').css('display', 'none');

    $('#id_input').val('');
    $scope.addstock.text = '';

  };

  $scope.viewFinance = function(row){

    //location.href = 'finance/'+row.stockCode;
    //target = '_blank';
    //window.open('finance/'+row.stockCode+'/'+row.stockName,'_blank');

  };

  $scope.viewHisPrices = function(row){

    //window.open('hisprices/'+row.stockCode+'/'+row.stockName,'_blank');

  };


}]);*/


var getStockID = function(val) {

  if (val && val.length == 6) {

    if (val[0] == '6') {
      val = 'sh' + val;
    } else {
      val = 'sz' + val;
    }
    return val;
  }
  return null;
};