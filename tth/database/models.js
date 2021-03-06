module.exports = {

    user: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number
        },
        userEmail: {
            type: String
        },
        role: {
            type: Number,
            default: 0
        },
        sign: {
            type: String,
            default: '这家伙很懒，什么个性签名也没留下'
        },
        userPostTopic: [{
            type: String
        }],
        userReplyTopic: [{
            type: String
        }],
        userCollTopic: [{
            type: String
        }],
        unread: [{
            commentUser: String,
            topicId: String,
            topicTitle: String,
            asure: Boolean,
            commentDate: {
                type: Date
            }
        }],
        imageUrl: {
            type: String
        },
        signDate: {
            type: Date,
            default: Date.now
        }

    },
    topic: {
        user: {
            type: String,
            required: true
        },
        userSign: {
            type: String,
            default: '这家伙很懒，什么个性签名也没留下'
        },
        userImage: String,
        block: String,
        title: String,
        content: String,
        pv: {
            type: Number,
            default: 0
        },
        comment: [{
            commentInner: String,
            commentUser: String,
            commentUserImage: String,
            commentAt: String,
            commentDate: {
                type: Date,
                default: Date.now
            }
        }],
        date: {
            type: Date,
            default: Date.now
        }
    },
    favorstocks: {
        username: {
            type: String,
            required: true
        },
        stocks: [{
            stockcode: String,
            ex: String

        }]

    },
    stock: {
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        nameJP: {
            type: String,
            required: false
        },
        ex: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: false
        },
        sector: {
            type: String,
            required: false
        },
        equity: {
            type: Number,
            required: false
        },
        flowEq: {
            type: Number,
            required: false
        }

    },
    dailyprices: {
        code: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }, 
        close: {
            type: Number
        },
        high: {
            type: Number
        },
        low: {
            type: Number
        },
        open: {
            type: Number
        }, 
        chg: {//涨跌额
            type: Number
        },
        pchg: {//涨跌比
            type: Number
        }, 
        turnover: {
            type: Number
        },
        voturnover: {
            type: Number
        },
        vaturnover: {
            type: Number
        },
        totalcap: {
            type: Number

        },
        marketcap: {
            type: Number
        }
    },
    finance: {
        code: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        eps: {
            type: Number
        },
        netprofit: {
            type: Number
        },
        netprofitpercent: {
            type: Number
        },
        netprofitdeduction: {
            type: Number
        },
        grossrevenue: {
            type: Number
        },
        grossrevenuepercent: {
            type: Number
        },
        netassets: {
            type: Number
        },
        roe: {
            type: Number
        },
        dilutedroe: {
            type: Number
        },
        debttoassets: {
            type: Number
        },
        capitalreserve: {
            type: Number
        },
        retainedprofit: {
            type: Number
        },
        operatingcashflow: {
            type: Number
        },
        grossmargin: {
            type: Number
        },
        inventoryturnover: {
            type: Number
        }

    }
};