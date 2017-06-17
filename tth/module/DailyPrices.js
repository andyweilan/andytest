var httpproxy = require("./HttpProxy");
var cheerio = require('cheerio');


var DailyPrices = function(stockcode, stockex) {

	this.stockcode = stockcode;
	this.stockex = stockex;

	this.headers = [];

	this.headers.push('日期');
	this.headers.push('开盘价');
	this.headers.push('最高价');
	this.headers.push('最低价');
	this.headers.push('收盘价');
	this.headers.push('成交量(手)');
	this.headers.push('成交金额(万元)');
	this.headers.push('振幅(%)');
	this.headers.push('换手率(%)');

};

DailyPrices.prototype.start = function(callback) {

	console.log("ddd");

	var self = this;

	var options = self.getOptions(self.stockcode, self.stockex);

	var proxy = new httpproxy(options);


	proxy.go(function(data) {

		var $ = cheerio.load(data);

		var headersMap = [];

		var prices = [];

		$('tr.dbrow').each(function(i, e) {

			if (i == 0) { //head
				self.findheader($, $(e), self.headers, headersMap);

			} else {

				var values = self.findtdvalues($, $(e));

				//console.log("len:" + values.length);

				var pricedate = self.getOne(self.stockcode, headersMap, values);

				//console.log(pricedate);

				prices.push(pricedate);
			}

		});

		self.writeData(self.stockcode, prices, callback);


	});


};

DailyPrices.prototype.getOne = function(stockcode, headersMap, values) {
	var self = this;

	var reg = new RegExp(',', 'g');

	var arr = [];

	for (var j in headersMap) {

		var v = values[headersMap[j]];

		arr[j] = v.replace(reg, '');

		//console.log(" v is:" + arr[j]+",j is:"+j);
	}


	return {
		code: stockcode,
		date: arr[self.headers[0]],
		open: arr[self.headers[1]],
		high: arr[self.headers[2]],
		low: arr[self.headers[3]],
		close: arr[self.headers[4]],
		quant: arr[self.headers[5]],
		volume: arr[self.headers[6]],
		turnover: arr[self.headers[7]],
		amplitude: arr[self.headers[8]]

	};

};

DailyPrices.prototype.findheader = function($, tr, headers, headersMap) {

	tr.children().each(function(i, e) {
		//console.log(i);
		//console.log($(e).text());

		var v = $(e).text();

		if (headers.indexOf(v) >= 0) {
			headersMap[v] = i;
		}
	});

};

DailyPrices.prototype.findtdvalues = function($, tr, headersMap) {

	var values = [];

	tr.children().each(function(i, e) {
		//console.log(i);
		//console.log($(e).text());
		var v = $(e).text();

		values.push(v);
	});
	return values;

};

DailyPrices.prototype.start1 = function(callback) {

	var self = this;

	var options = self.getOptions(self.stockcode, self.stockex);

	var proxy = new httpproxy(options);


	proxy.go(function(data) {


		var prices = [];

		var arrs = data.split('\n');

		//console.log("len is \n"+arrs.length);

		for (var i = 1; i < arrs.length; ++i) {

			if (arrs[i]) {

				//console.log(arrs[i]);

				var dateprices = self.getOneDatePrices(self.stockcode, arrs[i]);

				if (dateprices) {
					prices.push(dateprices);

					//console.log(dateprices);

				}

			}

		}

		self.writeData(self.stockcode, prices, callback);

	});


};

DailyPrices.prototype.writeData = function(stockcode, data, callback) {


	var self = this;

	global.OPER.insertDailyPrices(data, function(err, doc) {

		if (err) {
			//res.send(500);
			console.log(err);

			if (callback) {
				callback.call(this, -1);
			}


		} else {
			console.log('Success to insert daily prices data for:' + stockcode);
			if (callback) {
				//console.log("call back 0")
				callback.call(this, 0, data);
			}

		}
	});

};

DailyPrices.prototype.getOneDatePrices = function(code, data) {

	var arr = data.split(',');

	if (arr.length < 7) {

		console.log('no enough prices');
		return null;
	}

	return {
		code: code,
		date: arr[0],
		open: arr[1],
		high: arr[2],
		low: arr[3],
		close: arr[4],
		volume: arr[5],
		adjclose: arr[6]

	};

};

DailyPrices.prototype.getUrl = function(stockcode, ss) {

	//https://ichart.yahoo.com/table.csv?s=600000.SS

	var url = '';
	if (stockcode) {
		//url = "https://ichart.yahoo.com/table.csv?s=" + stockcode + ss;
		url = "http://quotes.money.163.com/trade/lsjysj_" + stockcode + ".html?year=2017&season=2";
	}

	return url;

};

DailyPrices.prototype.getOptions = function(stockcode, stockex) {

	var append = '.sz';

	if (stockex == 'sh') {

		append = '.ss';

	}

	var url = this.getUrl(stockcode, append);

	var options = {
		url: url,
		timeout: 15000,
		encoding: "utf-8",
		debug: true

	};

	return options;

};


module.exports = DailyPrices;