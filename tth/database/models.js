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

    }
};