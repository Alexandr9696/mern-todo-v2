const {validationResult} = require('express-validator')
const {Router} = require('express')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('./../models/User')
const {registerValidators, loginValidator} = require('./../utils/validators')
const config = require('./../config')
const regEmail = require('./../emails/registration')
const resetEmail = require('./../emails/reset')

const router = Router()

// транспортер - объект служащий для того чтобы отправлять email
// в библиотеке nodemailer есть метод createTransport
// в эту функцию мы должны передать тот сервис которым мы пользуется (sendgrid)
// а уже в функцию sendgrid мы передаем объект конфигурации
const transporter = nodemailer.createTransport(sendgrid({
  // передаем свойтво api_key - который нам дали при создании на сайте sendgrid
  auth: {api_key: config.SENDGRID_API_KEY}
}))

// Регистрация
router.post('/register', registerValidators, async (req, res) => {
  try {
    // переданные данные
    const {name, email, password} = req.body
    // получение ошибок из express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({message: errors.array()[0].msg})
    }
    // шифрование пароля
    const hashedPassword = await bcrypt.hash(password, 12)
    // создание пользователя
    const user = new User({name, email, password: hashedPassword})
    await user.save()
    // отправка ответа на клиент
    res.status(201).json({message: 'Пользователь создан'})
    // отправка сообщения на email
    await transporter.sendMail(regEmail(email))

  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// Авторизация
router.post('/login', loginValidator,  async (req, res) => {
  try {
    // переданные данные
    const {email, password} = req.body
    // получение ошибок из express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({message: errors.array()[0].msg})
    }
    // поиск пользователя по email
    const user = await User.findOne({email})
    // проверка совпадения паролей
    const isMatch = await bcrypt.compare(password, user.password)
    // пароль неверный
    if (!isMatch) {
      return res.status(400).json({message: `Неверный пароль, попробуйте снова`})
    }
    // генерация токена
    const token = jwt.sign(
      {userId: user.id},
      config.jwtSecret,
      {expiresIn: "3h"}
    )
    // отправка ответа на клиент
    res.json({token, userId: user.id, name: user.name})

  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// Отправка на почту токена для восстановления пароля
router.post('/reset', (req, res) => {
  try {
    // генерация токена
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.status(500).json({message: 'Токен не сгенерировался, попробуйте позже'})
      }
      // приведение в строку
      const token = buffer.toString('hex')
      // поиск пользователя по email
      const user = await User.findOne({email: req.body.email})
      // создание новых свойств в объекте пользователя
      if (user) {
        user.resetToken = token
        user.resetTokenExp = Date.now() + 60 * 60 * 1000
        await user.save()
        // отправка ответа на клиент
        res.status(200).json({message: 'Вам отправлено письмо на почту'})
        // отправка сообщения на email
        await transporter.sendMail(resetEmail(user.email, token))
      } else {
        return res.status(500).json({message: 'Такой email не зарегистрирован'})
      }
    })
  } catch (e) {
    return res.status(500).json({message: 'Что-то пошло не так, попробуйте позже'})
  }
})

// Отправка на страницу userId и токена
router.get('/password/:token', async (req, res) => {
  // проверка существоване токена в адрессной строке
  if (!req.params.token) {
    return res.status(500).json({message: 'Отсутствует токен, попробуйте снова'})
  }
  try {
    // поиск пользователя по токену
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })
    if (!user) {
      return res.status(500).json({message: 'Время истекло, попробуйте снова'})
    } else {
      // отправка ответа на клиент
      return res.status(200).json({userId: user._id.toString(), token: req.params.token})
    }
  } catch (e) {
    return res.status(500).json({message: 'Что-то пошло не так, попробуйте позже'})
  }
})

// Изменение пароля
router.post('/password', async (req, res) => {
  try {

    // получение ошибок из express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({message: errors.array()[0].msg})
    }
    // поиск пользователя
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })
    // смена пароля
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      // сохранение объекта пользователя
      await user.save()
      // отправка ответа на клиент
      return res.status(200).json({message: 'Пароль успешно изменен'})
    } else {
      return res.status(500).json({message: 'Время истекло, попробуйте снова'})
    }
  } catch (e) {
    return res.status(500).json({message: 'Что-то пошло не так, попробуйте позже'})
  }
})

module.exports = router