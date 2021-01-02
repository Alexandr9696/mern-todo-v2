import React, {useContext, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import M from 'materialize-css/dist/js/materialize.min.js';
import {AuthContext} from "../../context/AuthContext";
import './Navbar.scss'
import {Categories} from "./Categories";

export const Navbar = () => {
  const auth = useContext(AuthContext)
  const history = useHistory()

  const logoutHandler = (event) => {
    event.preventDefault()
    auth.logout()
    history.push('/auth/login')
  }

  useEffect(() => {
      let sidenav = document.querySelector('#slide-out');
      M.Sidenav.init(sidenav, {});
    }
  )

  return (
    <>
      <ul id="slide-out" className="sidenav sidenav-fixed teal darken-3 sidenav-close">
        <li>
          <div><h3 className="brand-logo">Note App</h3></div>
        </li>
        <li>
          <Link exact to="/">
            <FontAwesomeIcon
              icon={['fas', 'th']}
              style={{color: 'black', marginRight: '5px'}}
              fixedWidth
            />
            Главная экран</Link>
        </li>

        {auth.isAuthenticated ?
          <>
            <li>
              <Link to="/tasks">Список задач</Link>
            </li>
            <li>
              <div className="divider teal darken-4"/>
            </li>
            <Categories />
            <li>
              <a href="/" onClick={logoutHandler}>
                <FontAwesomeIcon
                  icon={['fas', 'sign-out-alt']}
                  style={{color: 'black', marginRight: '5px'}}
                  fixedWidth
                />
                Выйти</a>
            </li>
          </>
          :
          <>
            <li>
              <div className="divider teal darken-4"/>
            </li>
            <li>
              <Link to="/auth/register">
                <FontAwesomeIcon
                  icon={['fas', 'user-plus']}
                  style={{color: 'black', marginRight: '5px'}}
                  fixedWidth
                />
                Регистрация
              </Link>
            </li>
            <li>
              <Link to="/auth/login">
                <FontAwesomeIcon
                  icon={['fas', 'sign-in-alt']}
                  style={{color: 'black', marginRight: '5px'}}
                  fixedWidth
                />
                Войти</Link>
            </li>
          </>
        }
      </ul>
      <a data-target="slide-out" className="sidenav-trigger">
        <FontAwesomeIcon
          icon={['fas', 'bars']}
          size="2x"
          style={{color: '#00695c', margin: '10px 0 0 10px'}}
        />
      </a>
    </>
  )
}