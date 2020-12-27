import React, {useContext, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useHistory} from "react-router-dom";
import {AlertContext} from "../context/alert/alertContext";


export const Reset = () => {
  const history = useHistory()
  const {show} = useContext(AlertContext)
  const {request} = useHttp()

  const [form, setForm] = useState({
    email: '',
  })

  // обработка inputs
  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value} )
  }

  const resetHandler = async () => {
    try {
      const data = await request('/auth/reset', 'POST', {...form})
      show(data.message, 'success')
      history.push('/auth/login')
    } catch (e) {
      show(e.message, 'danger')
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className='text-center'>Забыли пароль?</h1>
        <form onSubmit={resetHandler}>
          <div className="input-field">
            <label htmlFor="email">Введите email</label>
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
            <span className="helper-text" data-error="Введите email" />
          </div>

          <button className="btn btn-primary" type="submit">Сбросить пароль</button>

        </form>

      </div>
    </div>
)
}