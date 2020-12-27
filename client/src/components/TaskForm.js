import React from 'react'

export const TaskForm = ({addTask, formHandler, form}) => {

  return (
    <>
      <h1 className='mb-2'>Добавьте заметку</h1>
      <form onSubmit={addTask}>
        <div className="form-group">

          <input type="text"
                 name="title"
                 className="form-control"
                 placeholder='Введите название заметки'
                 value={form.title}
                 onChange={formHandler}
          />
            <button className="btn btn-success mt-2">Добавить</button>
        </div>
      </form>
    </>
  )
}