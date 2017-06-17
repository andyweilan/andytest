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
        open: {
            type: Number
        },
        high: {
            type: Number
        },
        low: {
            type: Number
        },
        close: {
            type: Number
        },
        quant: {
            type: Number

        },
        volume: {
            type: Number
        },
        turnover: {
            type: Number
        },
        amplitude: {
            type: Number
        },
        adjclose: {
            type: Number
        }
    }
};