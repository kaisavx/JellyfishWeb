const { generateApi } = require('swagger-typescript-api')
const path = require('path')

// process.on('unhandledRejection', error => {
//   // Will print "unhandledRejection err is not defined"
//   // eslint-disable-next-line no-console
//   console.log('unhandledRejection', error.message)
//   // eslint-disable-next-line no-process-exit
//   process.exit(1)
// })

generateApi({
  // url: 'http://61.145.0.83:8199/api.json',
  url:'http://127.0.0.1:8199/api.json',
  output: path.resolve(__dirname, '../../src/api/collection'),
  httpClientType: '',
  modular: true,
  cleanOutput: true,
  templates: path.resolve(__dirname, './taro-template'),
  silent: false,
})
