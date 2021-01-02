import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import M from 'materialize-css/dist/js/materialize.min.js';
import {AuthContext} from "../context/AuthContext";
import {AlertContext} from "../context/alert/alertContext";
import {CategoryContext} from "../context/category/сategoryContext";
import {useHttp} from "../hooks/http.hook";
import {useChangeHandler} from "../hooks/changeHandler.hook";

export const AddTask = () => {
  const {token} = useContext(AuthContext)
  const {show} = useContext(AlertContext)
  const {categories} = useContext(CategoryContext)
  const history = useHistory()
  const {request} = useHttp()
  const {changeHandler} = useChangeHandler()

  const [form, setForm] = useState({
    title: '', category: '', importance: ''
  })

  useEffect(() => {
    let el = document.querySelectorAll('select');
    M.FormSelect.init(el, {});
  })

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
              onChange={event => changeHandler(event, setForm, form)}
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
              onChange={event => changeHandler(event, setForm, form)}
              required>
              <option value="" disabled>Выберите категорию задачи</option>

              {categories.length ?
                categories.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)
                : <option value="" disabled>Создайте категорию</option>
              }

            </select>
            <label>Категория задачи</label>
          </div>
          <div className="input-field">
            <select
              id="importance"
              name="importance"
              className="validate"
              value={form.importance}
              onChange={event => changeHandler(event, setForm, form)}
              required
            >
              <option value="" disabled>Выберите важность задачи</option>
              <option value="1">Обычная</option>
              <option value="2">Важно</option>
              <option value="3">Очень важно</option>
            </select>
            <label>Уровень важности</label>
          </div>

          <button className="btn btn-primary" type="submit">Создать задачу</button>
        </form>
      </div>
    </div>
  )
}
