import React, {useContext} from 'react'
import {AuthContext} from "../context/AuthContext";

export const Home = () => {
  const {name} = useContext(AuthContext)

  return (
    <div className='container'>
        <h1 className="display-4">Здравствуйте <strong>{name}</strong></h1>
        <h5 className="display-5">Добро пожаловать в React приложение заметок</h5>
        <p className="lead">Версия приложения <strong>1.0.0</strong></p>
    </div>
      )
}