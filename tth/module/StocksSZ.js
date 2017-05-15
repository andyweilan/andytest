var xlsx = require('node-xlsx');
var fs = require('fs');



var httpproxy = require("./HttpProxy");

var StocksSZ = function() {

	this.headers = [];
	this.headersChi = [];

	this.headers.push('A股代码');
	this.headers.push('A股简称');
	this.headers.push('A股上市日期');
	this.headers.push('A股总股本');
	this.headers.push('A股流通股本');
	this.headers.push('所属行业');

	this.headersChi.push('A股简称');
	this.headersChi.push('所属行业');

};


StocksSZ.prototype.start = function(callback) {

	var self = this;

	var options = {
		url: "http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2",
		timeout: 6000,
		encoding: "gbk",
		debug: false

	};


	var proxy = new httpproxy(options);

	proxy.go(function(data) {

		var filename = 'sz_stock_test1.xlsx';

		//将文件内容插入新的文件中
		fs.writeFileSync(filename, data, {
			'flag': 'w'
		});

		var data = self.readExcel(filename);

		if (data) {

			self.writeData(data, callback);
		}


	});

};


StocksSZ.prototype.getChinese = function(ucode) {

	var chinese = '';

	var arrs = ucode.split(';');

	for (var i = 0; i < arrs.length; ++i) {

		if (arrs[i]) {

			chinese += unicode2Ascii(arrs[i] + ';');
		}

	}

	return chinese;


};

StocksSZ.prototype.getOne = function(headersMap, value) {
	var self = this;

	var arr = [];

	for (var j in headersMap) {

		var v = value[headersMap[j]];

		if (self.headersChi.indexOf(j) >= 0) {

			v = self.getChinese(v);
		}

		arr[j] = v;

		//console.log("j is:"+j+" v is:" + v);
	}

	var reg=new RegExp(',','g'); 
	var equity = arr['A股总股本'];
	equity = equity.replace(reg,'');

	//console.log('after:'+equity);

	var flowEq = arr['A股流通股本'];
	flowEq = flowEq.replace(reg,'');



	return {
		code: arr['A股代码'],
		name: arr['A股简称'],
		nameJP: '',
		ex: 'sz',
		date: arr['A股上市日期'],
		sector: arr['所属行业'],
		equity: equity,
		flowEq: flowEq
	};

};

StocksSZ.prototype.writeData = function(ids, callback) {

	global.OPER.insertStockIds(ids, function(err, doc) {

		if (err) {
			
			console.log(err);

			if (callback) {
				callback.call(this, -1);
			}


		} else {
			console.log('Success to insert sz ids');
			if (callback) {
				callback.call(this, 0);
			}

		}
	});

};

StocksSZ.prototype.readExcel = function(filename) {

	var self = this;

	var headersMap = [];

	var obj = xlsx.parse(filename);

	var excelObj = obj[0].data;
	//console.log(excelObj);

	var count = -1;

	var data = [];
	for (var i in excelObj) {

		var value = excelObj[i];

		if (count == -1) {

			for (var j in value) {

				var v = self.getChinese(value[j]);

				if (self.headers.indexOf(v) >= 0) {

					headersMap[v] = j;

				}
			}

			count = count + 1;
			continue;

		}


		var arr = self.getOne(headersMap, value);

		data.push(arr);

		count = count + 1;

		//break;
	}

	console.log("sz stock num is:" + count);

	return data;

};


StocksSZ.prototype.toUnicode = function(s) {
	return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(newStr) {
		return "\\u" + newStr.charCodeAt(0).toString(16);　　　　　　
	});　　　　
};

function ascii2Unicode(str) {
	if (!str) {
		return str;
	}
	var r = '';
	for (var i = 0; i < str.length; i++) {
		r += '&#' + str.charCodeAt(i) + ';';
	}
	return r;
}

function unicode2Ascii(str) {
	var n = 0;
	var r = '';
	var m = 0;
	//65535
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) === '&' && i < str.length - 1 && str.charAt(i + 1) === '#') {
			n = 0;
			for (var j = 0; j < 6; j++) {
				m = i + 2 + j;
				if (m >= str.length) {
					break;
				}
				if (str.charAt(m) === ';') {
					n = j;
					break;
				}
			}
			if (n === 0) {
				r += str.charAt(i);
			} else {
				r += String.fromCharCode(parseInt(str.substr(i + 2, n)));
				i += n + 2;
			}
		} else {
			r += str.charAt(i);
		}
	}

	return r;
}

function chinese2Unicode(str) {
	if (!str) {
		return str;
	}
	var r = '';
	for (var i = 0; i < str.length; i++) {
		r += '\\u' + str.charCodeAt(i).toString(16);
	}
	return r;
}

function unicode2Chinese(str) {
	var n = 0;
	var r = '';
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) === '\\' && i + 5 < str.length && str.charAt(i + 1) === 'u') {
			n = parseInt(str.substr(i + 2, 4), 16);
			if (!isNaN(n)) {
				r += String.fromCharCode(n);
				i += 5;
			} else {
				r += str.charAt(i);
			}
		} else {
			r += str.charAt(i);
		}
	}
	return r;
}
//http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2
//http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab5PAGENO=1&ENCODE=1&TABKEY=tab5
//http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab6PAGENO=1&ENCODE=1&TABKEY=tab6

module.exports = StocksSZ;