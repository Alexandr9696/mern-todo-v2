import React from 'react'
import {CSSTransition, TransitionGroup} from "react-transition-group";

export const TaskList = ({tasks, removeTask}) => {

  if (!tasks.length) {
    return <h2>Список заметок пуст</h2>
  }

  return (
    <TransitionGroup component='ul' className='collection'>
      {
        tasks.map(task => (
          <CSSTransition
            classNames={'task'}
            timeout={800}
            key={task._id}
          >
            <li
              className='collection-item task'
            >
              <div>
                <strong>{task.title}</strong>
                <small>{task.date}</small>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeTask(task._id)}
              >
                &times;
              </button>
            </li>
          </CSSTransition>
        ))
      }
    </TransitionGroup>
  )
}