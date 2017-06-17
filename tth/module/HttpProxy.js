var http = require("http");
var https = require("https");
var BufferHelper = require("bufferhelper");
var iconv = require('iconv-lite');

var fs = require('fs');

var sleep = require('sleep');


var HttpProxy = function(options) {

    this.url = options.url || "";
    this.timeout = options.timeout || 5000;

    this.debug = options.debug || false;

    this.encoding = options.encoding || "UTF-8"; //页面编码

    this.urlQueue = [];

    this.fileNames = [];

    this.addUrlFilename(options.url, options.filename);

    this.retry = true;

};

HttpProxy.prototype.addUrlFilename = function(url, filename) {

    if (url) {
        this.urlQueue.push(url);
    }

    if (filename) {

        this.fileNames.push(filename);

    }

};


HttpProxy.prototype.urlCount = function() {

    return this.urlQueue.length;

};

HttpProxy.prototype.go = function(callback) {

    this.debug && console.log("in go");

    var url = ''
    if (this.urlQueue.length > 0) {

        this.retry = true;

        url = this.urlQueue.pop();

        // this.debug && console.log("url q len:"+this.urlQueue.length);

        var filename = this.fileNames.length > 0 ? this.fileNames.pop() : '';

        this.send(url, filename, callback);
    }

};

HttpProxy.prototype.writeFile = function(filename, data) {

    try {

        if (fs.existsSync(filename)) {

            fs.unlinkSync(filename);

        }

        fs.writeFileSync(filename, data, {
            'flag': 'w'
        });
    } catch (e) {

        console.log('fail write file:' + filename);

    } finally {

    }


};

/**
 * 发送请求
 * @param url   请求链接
 * @param callback  请求网页成功回调
 */
HttpProxy.prototype.send = function(url, filename, callback) {

    this.debug && console.log("in send");

    var self = this;

    var timeoutEvent; //由于nodejs不支持timeout,所以，需要自己手动实现

    var req = '';
    if (url.indexOf("https") > -1) {
        req = https.request(url);
    } else {
        req = http.request(url);
    }

    var isExcel = false;

    timeoutEvent = setTimeout(function() {
        req.emit("timeout");
    }, self.timeout);

    req.on('response', function(res) {
        var aType = self.getResourceType(res.headers["content-type"]);

        if (aType[1].indexOf("officedocument.spreadsheetml") > 0 || aType[1].indexOf("ms-excel") > 0) {
            isExcel = true;
            //res.setEncoding("binary");
        }


        var bufferHelper = new BufferHelper();
        if (aType[2] !== "binary") {} else {
            res.setEncoding("binary");
        }
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function() { //获取数据结束
            clearTimeout(timeoutEvent);

            self.debug && console.log("\n抓取URL:" + url + "成功\n");

            var data = null;

            if (isExcel) {

                self.debug && console.log("It's an Excel.");

                data = bufferHelper.toBuffer();

                if (filename) {
                    self.writeFile(filename, data);

                    data = null;
                    data = filename;
                }

            } else {

                //将拉取的数据进行转码，具体编码跟需爬去数据的目标网站一致
                data = iconv.decode(bufferHelper.toBuffer(), self.encoding);
            }

            //触发成功回调
            self.handlerSuccess(data, aType, url, callback);

            //回收变量
            data = null;
        });
        res.on('error', function() {
            console.log("服务器端响应失败URL:" + url + "\n");
            clearTimeout(timeoutEvent);
            self.handlerFailure(url, filename, callback);
            //console.log("服务器端响应失败URL:" + url + "\n");
        });
    }).on('error', function(err) {
        console.log("\n抓取URL:" + url + "失败:" + err + "\n");
        clearTimeout(timeoutEvent);
        self.handlerFailure(url, filename, callback);
        //console.log("\n抓取URL:" + url + "失败:" + err + "\n");
    }).on('finish', function() { //调用END方法之后触发
        self.debug && console.log("\n开始抓取URL:" + url + "\n");
    });
    req.on("timeout", function() {
        console.log("timeout for:" + url);
        if (req.res) {
            req.res.emit("abort");
        }

        req.abort();
    });

    req.end(); //发起请求

    this.debug && console.log("end of send");
};



/**
 * @desc判断请求资源类型
 *
 * @param string  Content-Type头内容
 *
 * @return[大分类,小分类,编码类型] ["image","png","utf8"]
 */
HttpProxy.prototype.getResourceType = function(type) {


    if (!type) {
        return '';
    }
    var aType = type.split('/');
    aType.forEach(function(s, i, a) {
        a[i] = s.toLowerCase();
    });
    if (aType[1] && (aType[1].indexOf(';') > -1)) {
        var aTmp = aType[1].split(';');
        aType[1] = aTmp[0];
        for (var i = 1; i < aTmp.length; i++) {
            if (aTmp[i] && (aTmp[i].indexOf("charset") > -1)) {
                aTmp2 = aTmp[i].split('=');
                aType[2] = aTmp2[1] ? aTmp2[1].replace(/^\s+|\s+$/, '').replace('-', '').toLowerCase() : '';
            }
        }
    }
    if ((["image"]).indexOf(aType[0]) > -1) {
        aType[2] = "binary";
    }
    this.debug && console.log("type0:" + aType[0] + ",type1:" + aType[1] + ",type2:" + aType[2]);
    return aType;
};

/**
 * 数据拉取成功回调
 * @param data  拉取回来的数据
 * @param aType 数据类型
 * @param url   访问链接
 * @param callback  用户给定访问成功回调，抛出给用户做一些处理
 */
HttpProxy.prototype.handlerSuccess = function(data, aType, url, callback) {

    if (callback) {

        // console.log("call callback");

        callback.call(this, data);

        //sleep.sleep(1);

        this.go(callback);

    } else {
        console.log("no call callback");
        //this.go();
    }

};

HttpProxy.prototype.handlerFailure = function(url, filename, callback) {

    if (this.retry) {

        this.retry = false;

        sleep.sleep(2);

        console.log('retry:' + url);

        this.send(url, filename, callback);
    } else if (callback) {
        callback.call(this, '');
    }

};

module.exports = HttpProxy;