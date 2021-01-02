const {body} = require('express-validator')
const User = require('./../models/User')
const bcrypt = require('bcryptjs')

exports.registerValidators = [
  body('name')
    .isLength({min: 2}).withMessage('Имя должно быть минимум из 3 символов')
    .trim(),
  body('email')
    .isEmail().withMessage('Введите корректный email')
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({email: value})
        if (user) {
          return Promise.reject('Такой email уже занят')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('password')
    .isLength({min: 6, max: 56}).withMessage('Пароль должен быть минимум 6 символов')
    .isAlphanumeric()
    .trim(),
  body('repassword')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        return Promise.reject('Пароли должны совпадать')
      }
      return true
    })
    .trim()
]

exports.loginValidator = [
  body('email')
    .isEmail().withMessage('Введите корерктный email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({email: value})
        if (!user) {
          return Promise.reject('Такой email не зарегистрирован')
        }
        return true
      } catch (e) {
        console.log(e)
      }
    })
]

exports.passwordValidator = [
  body('password')
    .isLength({min: 6, max: 56}).withMessage('Пароль должен быть минимум 6 символов')
    .isAlphanumeric()
    .trim(),
]

exports.tasksValidator = [
  body('title')
    .notEmpty().withMessage('Название задачи не может быть пустым')
    .trim(),
  body('category')
    .notEmpty().withMessage('Заполните название категории')
    .trim(),
  body('importance')
    .notEmpty().withMessage('Укажите важность задачи')
    .trim()
]

exports.categoryValidator = [
  body('title')
    .notEmpty().withMessage('Название задачи не может быть пустым')
    .trim(),
  body('color')
    .notEmpty().withMessage('Укажите цвет категории')
    .trim()
]