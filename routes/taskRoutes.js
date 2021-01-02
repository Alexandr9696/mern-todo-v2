const {Router} = require('express')
const {validationResult} = require('express-validator')
const User = require('./../models/User')
const {tasksValidator} = require('../utils/validators')
const auth = require('./../middleware/authMiddleware')

const router = Router()

// загрузка задач
router.get('/list', auth, async (req, res) => {
  try {
    // поиск пользователя по токену
    const user = await User.findOne({'_id': req.user.userId})
    // ответ на клиент
    res.status(200).json(user.tasks)
  } catch (e) {
    res.status(500).json({message: 'Заметки не загрузились, попробуйте снова'})
  }
})
// добавление задачи
router.post('/add', auth, tasksValidator, async (req, res) => {
  try {
    // получение ошибок из express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(500).json({message: errors.array()[0].msg})
    }
    // поиск совпадений
    const isMatch = await User.findOne({'_id': req.user.userId, 'tasks.title': req.body.title})
    if (isMatch) {
      return res.status(500).json({message: 'Такая задача уже существует'})
    }
    // добавление задачи
    await User.findOne({_id: req.user.userId}, async (err, user) => {
      if (err) throw err
      await user.tasks.addToSet(req.body)
      await user.save((err) => {
        if (err) {
          res.status(500).json({message: 'Задача не сохранена'});
        } else {
          const tasks = user.tasks
          res.status(200).json({tasks, message: 'Задача успешно создана!'});
        }
      })
    })
  } catch (e) {
    res.status(500).json({message: 'Задача не создана'})
  }
})
// удаление задачи
router.post('/remove', auth, async (req, res) => {
  try {
    // поиск пользователя и удаление задачи
    await User.findOneAndUpdate({_id: req.user.userId}, {$pull: {tasks: {_id: req.body.id}}})
    // поиск обновленного пользователя
    const user = await User.findOne({_id: req.user.userId})
    const tasks = user.tasks
    // ответ на клиент
    res.status(200).json({tasks, message: 'Задача удалена!'})

  } catch (e) {
    res.status(500).json({message: 'Задача не удалена'})
  }
})

module.exports = router