var httpproxy = require("./HttpProxy");



var StocksSH = function() {

};


StocksSH.prototype.start = function(callback) {

  var self = this;

  var options = {
    url: "http://www.sse.com.cn/js/common/ssesuggestdata.js",
    timeout: 6000,
    encoding: "utf8",
    debug: false

  };

  var proxy = new httpproxy(options);

  proxy.go(function(data) {


    var ids = [];
    var arrs = data.split('\n');

    //console.log("len is "+arrs.length);

    for (var i = 0; i < arrs.length; ++i) {

      if (arrs[i].indexOf('_t.push') >= 0) {
        var id = self.getOneID(arrs[i]);
        if (id) {
          ids.push(id);
        }
      }

    }

    if (ids.length < 1) {

      if (callback) {
        callback.call(this, -1);
      }

      return;
    }

    console.log("sh stock num is:" + ids.length);


    self.writeData(ids, callback);


  });

};

StocksSH.prototype.writeData = function(ids, callback) {

  global.OPER.insertStockIds(ids, function(err, doc) {

    if (err) {
      console.log("Fail to insert sh ids:" + err);

      if (callback) {
        callback.call(this, -1);
      }


    } else {
      console.log('Success to insert sh ids');
      if (callback) {
        callback.call(this, 0);
      }

    }
  });

};


StocksSH.prototype.getOneID = function(data) {

  var arrs = data.split(',');


  if (arrs.length < 3) {
    return null;
  }

  var out = [];

  for (var i = 0; i < arrs.length; ++i) {
    var pos1 = arrs[i].indexOf('\"');
    var pos2 = arrs[i].indexOf('\"', pos1 + 1);

    if (pos1 > 0 && pos2 > pos1) {
      var value = arrs[i].substring(pos1 + 1, pos2);
      out.push(value);
    }
  }

  if (out.length < 3 || out[0][0] != '6') {
    return null;
  }

  return {
    code: out[0],
    name: out[1],
    nameJP: out[2],
    ex: 'sh'
  };



};

module.exports = StocksSH;