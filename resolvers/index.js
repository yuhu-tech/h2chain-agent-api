const { query } = require('./query/query')
const { auth } = require('./mutation/auth')
const { order } = require('./mutation/order')
const { clean } = require('./mutation/clean')

module.exports = {
  Query: query,
  Mutation: {
    ...auth,
    ...order,
    ...clean
  }
}
