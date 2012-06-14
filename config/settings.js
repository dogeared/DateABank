module.exports = {
  databases: {
    mongo: {
      host: process.env['MONGO_HOST'],
      database: process.env['MONGO_DB'],
      port: parseInt(process.env['MONGO_PORT']),
      timeout: process.env['MONGO_TIMEOUT']
    }
  },
  cookieSecret: process.env['COOKIE_SECRET'],
  tmpPath: process.env['TMP_PATH']
}
