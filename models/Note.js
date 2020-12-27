const {Schema, model} = require('mongoose')

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})


module.exports = model('Task', schema)