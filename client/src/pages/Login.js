import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {AlertContext} from "../context/alert/alertContext";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useChangeHandler} from "../hooks/changeHandler.hook";

export const Login = () => {
  const auth = useContext(AuthContext)
  const {show} = useContext(AlertContext)
  const history = useHistory()
  const {loading, request} = useHttp()
  const {changeHandler} = useChangeHandler()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  // авторизация
  const loginHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId, data.name)
      history.push('/')
    } catch (e) {
      show(e.message, 'danger')
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className='text-center'>Авторизация</h1>
        <form onSubmit={loginHandler} noValidate>
          <div className="input-field">
            <input
              id="email"
              name="email"
              type="email"
              className="validate"
              value={form.email}
              onChange={event => changeHandler(event, setForm, form)}
              required
            />
            <label htmlFor="email">Введите email</label>
            <span className="helper-text" data-error="Введите email" />
          </div>
          <div className="input-field">
            <input
              id="password"
              name="password"
              type="password"
              className="validate"
              value={form.password}
              onChange={event => changeHandler(event, setForm, form)}
              required
            />
            <label htmlFor="password">Введите пароль</label>
            <span className="helper-text" data-error="Введите пароль" />
          </div>

          <p><Link className='d-block' to='/auth/reset'>Забыли пароль</Link></p>

          { loading ?
            <div className="progress">
              <div className="indeterminate" />
            </div>
            : null
          }

          <button className="btn btn-primary" type="submit">Войти</button>

        </form>
      </div>
    </div>
  )
}