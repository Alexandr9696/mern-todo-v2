const config = require('./../config')

module.exports = function (email, token) {
  return {
    to: email,
    from: config.EMAIL_FROM,
    subject: 'Восстановление доступа',
    html: `
        <h1>Вы забыли пароль?</h1>
        <p>Если нет то проигнорируйте данное письмо</p>
        <p>Иначе перейдите по ссылке ниже</p>
        <hr />
        <p><a href="${config.BASE_URL}/auth/reset/${token}">Восстановить доступ</a></p>
      `
  }
}