module.exports = {

    api: {
      port: process.env.PORT || 3000,
      root: '/api',
    },
  
    auth: {
      jwt: {
        secret: 'SECRET',
      },
    },
  
    db: {
        mongoDb: 'mongodb+srv://kSapi:spdC-6*nmzuW-cd@cluster0.revcx.mongodb.net/library-management-system?retryWrites=true&w=majority'
     
    },
  };