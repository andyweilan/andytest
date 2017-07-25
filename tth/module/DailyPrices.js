var httpproxy = require("./HttpProxy");
var cheerio = require('cheerio');


var DailyPrices = function(stockcode, stockex) {

	this.stockcode = stockcode;
	this.stockex = stockex;
};


DailyPrices.prototype.start = function(callback) {

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

	if (arr.length < 14) {

		console.log('no enough prices');
		return null;
	}

	return {
		code: code,
		date: arr[0],
		close: arr[3],
		high: arr[4],
		low: arr[5],
		open: arr[6],
		chg: arr[7]=='None'?'':arr[7],
		pchg: arr[8]=='None'?'':arr[8],
		turnover: arr[9],
		voturnover: arr[10],
		vaturnover: arr[11],
		totalcap: arr[12],
		marketcap: arr[13]
	};

};

DailyPrices.prototype.getUrl = function(stockcode, ss, start, end) {

	//https://ichart.yahoo.com/table.csv?s=600000.SS

	var fields = "&fields=TCLOSE;HIGH;LOW;TOPEN;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP";

	var url = '';
	if (stockcode) {
		//url = "https://ichart.yahoo.com/table.csv?s=" + stockcode + ss;
		url = "http://quotes.money.163.com/service/chddata.html?code=";
		url += ss + stockcode;
		url += fields;
		url += "&start=" + start;
		url += "&end=" + end;

	}

	//console.log("url:" + url);

	return url;

};

DailyPrices.prototype.getEndDate = function() {

	var dt = new Date();

	var year = dt.getFullYear();

	var month = dt.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}

	var day = dt.getDate();
	if (day < 10) {
		day = "0" + day;
	}

	return year + month + day;
};

DailyPrices.prototype.getStartDate = function() {

	var dt = new Date();

	var year = dt.getFullYear();

	return (year - 20) + "0101";
};

DailyPrices.prototype.getOptions = function(stockcode, stockex) {

	var append = '1';

	if (stockex == 'sh') {

		append = '0';

	}

	var end = this.getEndDate();

	var start = this.getStartDate();

	var url = this.getUrl(stockcode, append, start, end);

	var options = {
		url: url,
		timeout: 15000,
		encoding: "utf-8",
		debug: true

	};

	return options;

};


module.exports = DailyPrices;