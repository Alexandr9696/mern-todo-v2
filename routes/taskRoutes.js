const {tasksValidator} = require('../utils/validators')
const {validationResult} = require('express-validator')
const {Router} = require('express')
const User = require('./../models/User')
const auth = require('./../middleware/authMiddleware')

const router = Router()


router.get('/list', auth, async (req, res) => {
  try {
    const user = await User.findOne({'_id': req.user.userId})
    res.status(200).json(user.tasks)
  } catch (e) {
    res.status(500).json({message: 'Заметки не загрузились, попробуйте снова'})
  }
})

router.post('/add', auth, tasksValidator, async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(500).json({message: errors.array()[0].msg})
  }

  try {
    const isMatch = await User.findOne({'_id': req.user.userId, 'tasks.title': req.body.title})
    if (isMatch) {
      return res.status(500).json({message: 'Такая задача уже существует'})
    }

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

router.post('/remove', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({_id: req.user.userId}, {$pull: {tasks: {_id: req.body.id}}})

    const user = await User.findOne({_id: req.user.userId})
    const tasks = user.tasks

    res.status(200).json({tasks, message: 'Задача удалена!'})

  } catch (e) {
    res.status(500).json({message: 'Задача не удалена'})
  }
})

router.get('/category', auth, async (req, res) => {
  try {
    const categories = await User.find({'_id': req.user.userId})
    res.status(200).json(categories)
  } catch (e) {
    res.status(500).json({message: 'Категории задач не были загружены'})
  }
})

router.post('/category/add', auth, async (req, res) => {
  try {
    const isMatch = await User.findOne({'_id': req.user.userId, categories: req.body.title})
    if (isMatch) {
      return res.status(500).json({message: 'Такая категория уже существует'})
    }

    await User.findOne({_id: req.user.userId}, async (err, user) => {
      if (err) throw err
      await user.categories.addToSet(req.body.title)
      await user.save((err) => {
        if (err) {
          res.status(500).json({message: 'Категория не сохранена'});
        } else {
          const categories = user.categories
          res.status(200).json({categories, message: 'Категория успешно создана!'});
        }
      })
    })
  } catch (e) {

  }
})

module.exports = router