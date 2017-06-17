var httpproxy = require("./HttpProxy");


var fs = require('fs');
var xlrd = require('node-xlrd');


var StockFinance = function(stockid) {
	this.stockid = stockid;

	this.failIDs = [];

	this.totalcount = 0;

	this.retry = false;

	this.filePath = './tempfiles/';
};


StockFinance.prototype.start = function(callback) {

	var self = this;

	var options = self.getOptions(self.stockid);

	var proxy = new httpproxy(options);


	if (self.stockid) {

		self.go(proxy, callback);

	} else {

		self.getAllStocks(proxy, callback);

	}
};

StockFinance.prototype.getUrl = function(stockid) {

	var url = '';
	if (stockid) {
		url = "http://basic.10jqka.com.cn/" + stockid + "/xls/mainreport.xls";
	}

	return url;

};

StockFinance.prototype.getFilename = function(stockid) {

	var name = '';
	if (stockid) {
		name = stockid + '.xls';

		name = this.filePath + name;
	}

	return name;

}

StockFinance.prototype.getOptions = function(stockid) {
	var url = this.getUrl(stockid);

	var filename = this.getFilename(stockid);

	var options = {
		url: url,
		timeout: 6000,
		encoding: "gbk",
		filename: filename,
		debug: false

	};

	return options;

};

StockFinance.prototype.go = function(proxy, callback) {

	var self = this;

	proxy.go(function(data) {

		var filename = data;

		var stockid = '';

		if (filename) {

			var p = filename.split('/');

			var s = p[p.length-1].split('.');

			stockid = s[0];
			//console.log('id:'+stockid);
		} else {
			return;
		}


		self.readExcel(proxy, filename, stockid, callback);


	});
};

StockFinance.prototype.getAllStocks = function(proxy, callback) {

	var self = this;

	global.OPER.getStocks(function(err, docs) {

		if (err) {

		} else if (docs) {

			console.log('stocks  len:' + docs.length);

			var len = docs.length;

			self.totalcount = len;

			for (var i = 0; i < len; ++i) {

				//console.log('gettting '+i+' of '+docs.length+". id:"+docs[i].code);	

				var stockid = docs[i].code;

				var url = self.getUrl(stockid);

				var filename = self.getFilename(stockid);

				proxy.addUrlFilename(url,filename);

			}

			self.go(proxy, callback);
		}

	});


};

StockFinance.prototype.writeData = function(filename, financeData, stockid, callback) {


	var self = this;

	global.OPER.insertStockFinance(financeData, function(err, doc) {

		if (err) {
			//res.send(500);
			console.log(err);

			if (callback) {
				callback.call(this, -1);
			}


		} else {
			console.log('Success to insert finance data for:' + stockid);
			if (callback) {
				//console.log("call back 0")
				callback.call(this, 0, financeData);
			}

		}
/*
		fs.unlink(filename, function(err) {
			if (err) {
				console.log('fail to delete:' + filename);
			}
		}); //delete
		*/
	});

};

StockFinance.prototype.getOneRow = function(sht, rIdx, cCount, stockid) {

	var self = this;

	var data = [];

	for (var cIdx = 0; cIdx < cCount; cIdx++) {

		try {
			data[cIdx] = sht.cell(rIdx, cIdx);
			//console.log('  cell : row = %d, col = %d, value = "%s"', rIdx, cIdx, sht.cell(rIdx, cIdx));
		} catch (e) {
			console.log(e.message);
		}
	}

	if (data.length != cCount) {
		console.log("no enough columns for row:")
		return null;
	}

	//console.log("getOneRow:"+stockid);

	return {
		code: stockid,
		date: data[0],
		eps: data[1],
		netprofit: data[2],
		netprofitpercent: data[3],
		netprofitdeduction: data[4],
		grossrevenue: data[5],
		grossrevenuepercent: data[6],
		netassets: data[7],
		roe: data[8],
		dilutedroe: data[9],
		debttoassets: data[10],
		capitalreserve: data[11],
		retainedprofit: data[12],
		operatingcashflow: data[13],
		grossprofit: data.length > 15 ? data[14] : '',
		inventoryturnover: data.length > 15 ? data[15] : ''
	};

};

StockFinance.prototype.retryFailOnes = function(proxy, callback) {

	var self = this;

	self.totalcount = self.totalcount - 1;

	var urlcount = self.totalcount;

	console.log('count:' + urlcount);

	var failcount = self.failIDs.length;

	if (urlcount > 0 || failcount < 1) {

		//console.log('count:' + urlcount);

		if (urlcount == 0 && failcount == 0) {
			console.log('all success');

		}
		return;
	}

	if (self.retry) {
		console.log('already retry');
		return;

	}

	self.retry = true;

	console.log('start retry fail :' + failcount);

	//self.totalcount = failcount;

	while (self.failIDs.length > 0) {

		var stockid = self.failIDs.pop();

		console.log('id is:' + stockid);

		var url = self.getUrl(stockid);

		var filename = self.getFilename(stockid);

		proxy.addUrlFilename(url,filename);

	}


	self.failIDs = [];

	console.log('retry go');

	self.totalcount = failcount;
	//self.retry = false;

	self.go(proxy, callback);

};

StockFinance.prototype.readExcel = function(proxy, filename, stockid, callback) {

	var self = this;


	xlrd.open(filename, function(err, bk) {

		if (err) {
			//console.log("name:"+err.name);

			if (err.message && err.message.indexOf(filename) > 0) {

				self.failIDs.push(stockid);

				console.log('fail ID:' + stockid);

			}

			self.retryFailOnes(proxy, callback);

			return;
		}

		self.retryFailOnes(proxy, callback);


		var datas = [];

		var shtCount = bk.sheet.count;

		for (var sIdx = 1; sIdx < shtCount; sIdx++) {

			//console.log('sheet "%d" ', sIdx);
			//console.log('  check loaded : %s', bk.sheet.loaded(sIdx));

			var sht = bk.sheets[sIdx],
				rCount = sht.row.count,
				cCount = sht.column.count;

			//console.log('  name = %s; index = %d; rowCount = %d; columnCount = %d', sht.name, sIdx, rCount, cCount);

			if (cCount < 14) {
				console.log('no enough colmns for sheet');
				break;
			}


			for (var rIdx = 1; rIdx < rCount; rIdx++) { // rIdx：行数；cIdx：列数

				var data = self.getOneRow(sht, rIdx, cCount, stockid);

				if (data) {
					datas.push(data);
				}

			}
		}

		if (datas) {
			self.writeData(filename, datas, stockid, callback);

		}
	});

};


module.exports = StockFinance;