import React, {useCallback, useContext, useEffect, useState} from 'react'
import {TaskList} from "../components/TaskList";
import {AuthContext} from "../context/AuthContext";
import {AlertContext} from "../context/alert/alertContext";
import {useHttp} from "../hooks/http.hook";


export const TaskPage = () => {
  const {token} = useContext(AuthContext)
  const {show} = useContext(AlertContext)
  const {request} = useHttp()

  const [tasks, setTasks] = useState([])

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
      <div className="col s6">

      <h3>Список ваших заметок:</h3>

      {
        <TaskList tasks={tasks} removeTask={removeTask}/>
      }
      </div>
    </div>
  )
}

