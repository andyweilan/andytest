var httpproxy = require("./HttpProxy");

var POLLING_INTERVAL = 2000,
  pollingTimer;

var defaultStockList = "sh601857,sh601398,sz002080,sz300077,sz000651,sz002292,sz002841";


var RealTimeData = function() {

  this.stockList = defaultStockList;

  this.counter = 0;

};

RealTimeData.prototype.increaseCounter = function() {

  this.counter = this.counter + 1;

};

RealTimeData.prototype.pollingLoop = function(socket) {

  var self = this;

  if (!(self.stockList)) {
    return;
  }

  var options = {
    url: "http://hq.sinajs.cn/list=" + self.stockList,
    timeout: 6000,
    encoding: "GBk",
    debug: false

  };

  var proxy = new httpproxy(options);


  proxy.go(function(data) {

    var stocks = [];

    var arrs = data.split('\n');

    //console.log("len is \n"+arrs.length);

    for (var i = 0; i < arrs.length; ++i) {

      if (arrs[i]) {

        var st = self.getOneStock(arrs[i]);

        if (st) {
          stocks.push(st);

        }

      }

    }


    self.updatePrivateStocks(socket, {
      stocks: stocks
    });

    pollingTimer = setTimeout(function() {
      self.pollingLoop(socket)
    }, POLLING_INTERVAL);


  });

};


RealTimeData.prototype.getOneStock = function(data) {

  var arrs = data.split(',');

  if (arrs.length < 32) {
    return null;
  }

  var pos = arrs[0].indexOf('=');

  var name = "";

  var id = "";


  if (pos > 0) {

    id = arrs[0].substr(pos - 6, 6);

    name = arrs[0].substr(pos + 2, arrs[0].length - pos - 2);

  }

  var price = arrs[3];
  var priceDate = arrs[30];
  var priceTime = arrs[31];

  var priceYesterday = arrs[2];
  var priceOpen = arrs[1];

  var priceFloat = parseFloat(price).toFixed(10);
  var priceYesterdayFloat = parseFloat(priceYesterday).toFixed(10);

  var changeColor = 0;

  if ((priceFloat - priceYesterdayFloat) > 0.0001) {
    changeColor = 1;
  } else if ((priceFloat - priceYesterdayFloat) < -0.0001) {
    changeColor = -1;
  }

  var priceDif = priceFloat - priceYesterdayFloat;

  var pricePercent = priceDif * 100 / priceYesterdayFloat;

  pricePercent = pricePercent.toFixed(2).toString() + "%";


  return {
    stockCode: id,
    stockName: name,
    stockPrice: price,
    //priceDate: priceDate,
    priceTime: priceTime,
    priceYesterday: priceYesterday,
    priceOpen: priceOpen,
    changeColor: changeColor,
    priceDif: priceDif.toFixed(2),
    pricePercent: pricePercent

  };

};

RealTimeData.prototype.addStock = function(stockcode) {

  var stList = this.stockList;

  if (stList.indexOf(stockcode) == -1) {

    stList = stList + ',' + stockcode;

    this.stockList = stList;

  }


};

RealTimeData.prototype.delStock = function(stockcode) {

  var stList = this.stockList;

  if (stList.indexOf(stockcode) >= 0) {

    stList = stList.replace(',' + stockcode, '');
    stList = stList.replace(stockcode, '');

    this.stockList = stList;
  }
};

RealTimeData.prototype.emptyAllStock = function() {

  this.counter = this.counter - 1;
  if (this.counter <= 0) {

    this.stockList = "";
  }

  return this.counter;

};


RealTimeData.prototype.updatePrivateStocks = function(socket, data) {
  // 加上最新的更新时间
  data.time = new Date().toLocaleString();

  if (this.stockList) {
    socket.emit('private_stocks', data);
  }

};

module.exports = RealTimeData;