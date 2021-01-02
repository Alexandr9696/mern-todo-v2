import React, {useContext, useState} from "react";
import {useHistory} from "react-router-dom";
import { ChromePicker } from 'react-color'
import classnames from 'classnames';
import {AlertContext} from "../../context/alert/alertContext";
import {AuthContext} from "../../context/AuthContext";
import {CategoryContext} from "../../context/category/сategoryContext";
import {useHttp} from "../../hooks/http.hook";
import {useChangeHandler} from "../../hooks/changeHandler.hook";
import './addCategory.scss'

export const AddCategory = () => {
  const {show} = useContext(AlertContext)
  const {token} = useContext(AuthContext)
  const {dispatch} = useContext(CategoryContext)
  const history = useHistory()
  const {request} = useHttp()
  const {changeHandler} = useChangeHandler()

  const [form, setForm] = useState({
    title: '', color: ''
  })

  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const createCategoryHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/category/add', 'POST', {...form}, {
        Authorization: `Bearer ${token}`
      })
      dispatch({
        type: 'SAVE_CATEGORY',
        payload: data.categories
      })
      show(data.message, 'success')
      history.push('/')
    } catch (e) {
      show(e.message, 'danger')
    }
  }

  const handleChange = (color) => {
    setForm({...form, ['color']: color.hex})
    window.M.updateTextFields()
  }

  const inputClass = classnames('validate', {'valid': form.color})

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className='text-center'>Добавьте категорию</h1>
        <form onSubmit={createCategoryHandler}>
          <div className="input-field">
            <input
              id="title"
              type="text"
              name="title"
              className='validate'
              value={form.title}
              onChange={event => changeHandler(event, setForm, form)}
              required
            />
            <label htmlFor="title">Введите название категорию</label>
            <span className="helper-text" data-error="Введите категорию"/>
          </div>
          <div className="input-field">
            <input
              id="color"
              type="text"
              name="color"
              className={inputClass}
              value={form.color}
              onChange={changeHandler}
              onClick={() => {
                setDisplayColorPicker(true)
              }}
              required
            />
            <label htmlFor="color">Выберите цвет категории</label>
            <span className="helper-text" data-error="Выберите цвет категории"/>
            { displayColorPicker ? <div className='popover'>
              <div className='cover' onClick={() => {
                setDisplayColorPicker(false)
              }}/>
              <ChromePicker color={form.color} onChangeComplete={handleChange} />
            </div> : null }
          </div>
          <button className="btn btn-success">Добавить категорию</button>
        </form>
      </div>
    </div>
  )
}