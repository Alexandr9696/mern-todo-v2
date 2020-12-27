import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {TaskForm} from "../components/TaskForm";
import {TaskList} from "../components/TaskList";
import {AlertContext} from "../context/alert/alertContext";


export const TaskPage = () => {
  const {token} = useContext(AuthContext)
  const {request} = useHttp()
  const {show} = useContext(AlertContext)
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({
    title: ''
  })

  const formHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const fetchTasks = useCallback(async () => {
    try {
      const fetched = await request('/task/list', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setTasks(fetched)
    } catch (e) {
      show(e.message, 'danger')
    }
  }, [token, request])

  const addTask = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/task/add', 'POST', {...form}, {
        Authorization: `Bearer ${token}`
      })
      setTasks(data.tasks)
      setForm({title: ''})
      show(data.message, 'success')
    } catch (e) {
      show(e.message, 'danger')
    }
  }

  const removeTask = async (id) => {
    try {
      const data = await request('/task/remove', 'POST', {id}, {
        Authorization: `Bearer ${token}`
      })
      setTasks(data.tasks)
      show(data.message, 'success')
    } catch (e) {
      show(e.message, 'danger')
    }
  }


  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])


  return (
    <div className="row">
      <div className="col s6 offset-s3">
      <TaskForm
        addTask={addTask}
        formHandler={formHandler}
        form={form}
      />


      <h3>Список ваших заметок:</h3>

      {
        <TaskList tasks={tasks} removeTask={removeTask}/>
      }
      </div>
    </div>
  )
}

