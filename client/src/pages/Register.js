import React, {useContext, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {AlertContext} from "../context/alert/alertContext";

export const Register = () => {
  const history = useHistory()
  const {loading, request} = useHttp()
  const {show} = useContext(AlertContext)
  const auth = useContext(AuthContext)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    repassword: ''
  })

  // обработка inputs
  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value} )
  }

  // регистрация
  const registerHandler = async (e) => {
    e.preventDefault()
    try {
      const reg = await request('/auth/register', 'POST', {...form})
      const data = await request('/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
      history.push('/')
    } catch (e) {
      show(e.message, 'danger')
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className='text-center'>Регистрация</h1>
        <form onSubmit={registerHandler} noValidate>
          <div className="input-field">
            <input
              id="name"
              name="name"
              type="text"
              className="validate"
              value={form.name}
              onChange={changeHandler}
              required
            />
            <label htmlFor="name">Введите имя</label>
            <span className="helper-text" data-error="Введите имя"/>
          </div>
          <div className="input-field">
            <input
              id="email"
              name="email"
              type="email"
              className="validate"
              value={form.email}
              onChange={changeHandler}
              required
            />
            <label htmlFor="email">Введите email</label>
            <span className="helper-text" data-error="Введите корректный email"/>
          </div>
          <div className="input-field">
            <input
              id="password"
              name="password"
              type="password"
              className="validate"
              value={form.password}
              onChange={changeHandler}
              required
            />
            <label htmlFor="password">Введите пароль</label>
            <span className="helper-text" data-error="Введите пароль"/>
          </div>
          <div className="input-field">
            <input
              id="repassword"
              name="repassword"
              type="password"
              className="validate"
              value={form.repassword}
              onChange={changeHandler}
              required
            />
            <label htmlFor="repassword">Введите повторно пароль</label>
            <span className="helper-text" data-error="Введите пароль"/>
          </div>

          { loading ?
            <div className="progress">
              <div className="indeterminate" />
            </div>
            : null
          }

          <button className="btn btn-primary" type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  )
}