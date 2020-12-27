import React, {useCallback, useContext, useEffect, useState} from 'react'
import M from 'materialize-css/dist/js/materialize.min.js';
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './Navbar.scss'
import {AlertContext} from "../../context/alert/alertContext";
import {useHttp} from "../../hooks/http.hook";


export const Navbar = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {request} = useHttp()
  const [categories, setCategories] = useState([])
  const {show} = useContext(AlertContext)

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

  const fetchCategories = useCallback(async () => {
    try {
      const fetched = await request('/task/list', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setCategories(fetched)
    } catch (e) {
      show(e.message, 'danger')
    }
  }, [auth.token, request])


  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const category = [
    'Дом', 'Работа', 'Семья'
  ]


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
            style={{ color: 'black', marginRight: '5px'}}
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
              <div className="divider teal darken-4" />
            </li>
            <li>
              <div className='category-list'>
                <div className='category-title'>Список категорий</div>
                <FontAwesomeIcon
                  icon={['fas', 'plus']}
                  style={{ color: 'rgba(0, 0, 0, .5)', marginRight: '5px'}}
                  fixedWidth
                  onClick={() => console.log('click')}
                  cursor='pointer'
                />
              </div>
            </li>
            {
              category.map((item) => <li><Link to='/tasks'>{item}</Link></li>)
            }
            <li>
              <div className="divider teal darken-4" />
            </li>
            <li>
              <a href="/" onClick={logoutHandler}>
                <FontAwesomeIcon
                  icon={['fas', 'sign-out-alt']}
                  style={{ color: 'black', marginRight: '5px'}}
                  fixedWidth
                />
                Выйти</a>
            </li>
          </>
          :
          <>
            <li>
              <div className="divider teal darken-4" />
            </li>
            <li>
              <Link to="/auth/register">
                <FontAwesomeIcon
                  icon={['fas', 'user-plus']}
                  style={{ color: 'black', marginRight: '5px'}}
                  fixedWidth
                />
                Регистрация
              </Link>
            </li>
            <li>
              <Link to="/auth/login">
                <FontAwesomeIcon
                  icon={['fas', 'sign-in-alt']}
                  style={{ color: 'black', marginRight: '5px'}}
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
          style={{ color: '#00695c', margin: '10px 0 0 10px'}}
        />
      </a>
    </>
  )
}