const {Router} = require('express')
const User = require('./../models/User')
const auth = require('./../middleware/authMiddleware')
const {categoryValidator} = require('../utils/validators')

const router = Router()

// загрузка категорий
router.get('/list', auth, async (req, res) => {
  try {
    // поиск пользователя
    const user = await User.findOne({'_id': req.user.userId})
    const categories = user.categories
    // ответ на клиент
    res.status(200).json(categories)
  } catch (e) {
    res.status(500).json({message: 'Категории задач не были загружены'})
  }
})
// добавление категорий
router.post('/add', auth, categoryValidator, async (req, res) => {
  try {
    // поиск совпадений
    const isMatch = await User.findOne({'_id': req.user.userId, 'categories.title': req.body.title})
    if (isMatch) {
      return res.status(500).json({message: 'Такая категория уже существует'})
    }
    // добавление категории задач
    await User.findOne({_id: req.user.userId}, async (err, user) => {
      if (err) throw err
      await user.categories.addToSet(req.body)
      // сохранение пользователя
      await user.save((err) => {
        if (err) {
          res.status(500).json({message: 'Категория не сохранена'});
        } else {
          const categories = user.categories
          // ответ на клиент
          res.status(200).json({categories, message: 'Категория успешно создана!'});
        }
      })
    })
  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})
// удаление категорий
router.post('/remove', auth, async (req, res) => {
  try {
    // поиск пользователя и удаление категории
    await User.findOneAndUpdate({_id: req.user.userId}, {$pull: {categories: {_id: req.body.id}}})
    // поиск обновленного пользователя
    const user = await User.findOne({_id: req.user.userId})
    const categories = user.categories
    // ответ на клиент
    res.status(200).json({categories, message: 'Категория удалена!'})
  } catch {
    res.status(500).json({message: 'Задача не удалена'})
  }
})


module.exports = router