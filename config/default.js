

module.exports = {
    api: {
        port: process.env.PORT || 3000,
        root: '/api',
    },

    db: {
        mongoDb: ''
    },

    auth: {
        jwt: {
            secret: '',
        }
    }
}