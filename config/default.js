

module.exports = {
    api: {
        port: 3000,
        root: '/api',
    },

    db: {
        mongoDb: 'mongodb+srv://kSapi:spdC-6*nmzuW-cd@cluster0.revcx.mongodb.net/library-management-system?retryWrites=true&w=majority'
    },

    auth: {
        jwt: {
            secret: 'SECRET',
        }
    }
}