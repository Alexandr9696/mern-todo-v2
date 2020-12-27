const {validationResult} = require('express-validator')
const {registerValidators, loginValidator} = require('./../utils/validators')
const {Router} = require('express')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const config = require('./../config')
const jwt = require('jsonwebtoken')
const User = require('./../models/User')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
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
    // получение данных из формы
    const {name, email, password} = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({message: errors.array()[0].msg})
    }

    // шифрование пароля
    const hashedPassword = await bcrypt.hash(password, 12)
    // создание пользователя
    const user = new User({name, email, password: hashedPassword})
    await user.save()

    res.status(201).json({message: 'Пользователь создан'})

    await transporter.sendMail(regEmail(email))

  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// Авторизация
router.post('/login', loginValidator,  async (req, res) => {
  const {email, password} = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({message: errors.array()[0].msg})
  }

  const user = await User.findOne({email})

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({message: `Неверный пароль, попробуйте снова`})
  }

  const token = jwt.sign(
    {userId: user.id},
    config.jwtSecret,
    {expiresIn: "3h"}
  )

  res.json({token, userId: user.id, name: user.name})
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

      const user = await User.findOne({email: req.body.email})

      if (user) {
        user.resetToken = token
        user.resetTokenExp = Date.now() + 60 * 60 * 1000
        await user.save()

        res.status(200).json({message: 'Вам отправлено письмо на почту'})
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
  if (!req.params.token) {
    return res.status(500).json({message: 'Отсутствует токен, попробуйте снова'})
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (!user) {
      return res.status(500).json({message: 'Время истекло, попробуйте снова'})
    } else {
      return res.status(200).json({userId: user._id.toString(), token: req.params.token})
    }

  } catch (e) {
    return res.status(500).json({message: 'Что-то пошло не так, попробуйте позже'})
  }
})


router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      return res.status(200).json({message: 'Пароль успешно изменен'})
    } else {
      return res.status(500).json({message: 'Время истекло, попробуйте снова'})
    }
  } catch (e) {
    return res.status(500).json({message: 'Что-то пошло не так, попробуйте позже'})
  }
})
module.exports = router