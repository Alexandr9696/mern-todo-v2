const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  tasks: [
    {
      title: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      importance: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  categories: Array
})

module.exports = model('User', schema)