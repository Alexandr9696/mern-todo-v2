import React, {useContext, useEffect, useState} from 'react'
import M from 'materialize-css/dist/js/materialize.min.js';
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {AlertContext} from "../context/alert/alertContext";
import {useHistory} from "react-router-dom";


export const AddTask = () => {
  const {token} = useContext(AuthContext)
  const {request} = useHttp()
  const {show} = useContext(AlertContext)
  const history = useHistory()
  const [form, setForm] = useState({
    title: '', category: '', importance: ''
  })

  useEffect(() => {
    let el = document.querySelectorAll('select');
    M.FormSelect.init(el, {});
  })

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const createHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/task/add', 'POST', {...form}, {
        Authorization: `Bearer ${token}`
      })
      show(data.message, 'success')
      history.push('/tasks')
    } catch (e) {
      show(e.message, 'danger')
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className='text-center'>Создайте задачу</h1>
        <form onSubmit={createHandler} noValidate>
          <div className="input-field">
            <input
              id="title"
              name="title"
              type="text"
              className="validate"
              value={form.title}
              onChange={changeHandler}
              required
            />
            <label htmlFor="title">Введите название задачи</label>
            <span className="helper-text" data-error="Название не может быть пустым" />
          </div>
          <div className="input-field">
            <select
              id="category"
              name="category"
              className="validate"
              value={form.category}
              onChange={changeHandler}
              required>
              <option value="" disabled selected>Выберите категорию задачи</option>
              <option value="home">Дом</option>
              <option value="work">Работа</option>
              <option value="family">Семья</option>
              <span className="helper-text" data-error="Категория не может быть пустой" />
            </select>
            <label>Категория задачи</label>
          </div>
          <div className="input-field">
            <select
              id="importance"
              name="importance"
              className="validate"
              value={form.importance}
              onChange={changeHandler}
              required
            >
              <option value="" disabled selected>Выберите важность задачи</option>
              <option value="1">Обычная</option>
              <option value="2">Важно</option>
              <option value="3">Очень важно</option>
            </select>
            <label>Уровень важности</label>
            <span className="helper-text" data-error="Важность не может быть пустой" />
          </div>

          <button className="btn btn-primary" type="submit">Создать задачу</button>
        </form>
      </div>
    </div>
  )
}
