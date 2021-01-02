import React, {useCallback, useContext, useEffect} from 'react'
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AuthContext} from "../../context/AuthContext";
import {AlertContext} from "../../context/alert/alertContext";
import {CategoryContext} from "../../context/category/сategoryContext";
import {useHttp} from "../../hooks/http.hook";

export const Categories = () => {
  const auth = useContext(AuthContext)
  const {show} = useContext(AlertContext)
  const {categories, dispatch} = useContext(CategoryContext)
  const {request} = useHttp()


  const fetchCategories = useCallback(async () => {
    try {
      const baseDataCategories = await request('/category/list', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      dispatch({
        type: 'FETCH_CATEGORY',
        payload: baseDataCategories
      })
    } catch (e) {
      show(e.message, 'danger')
    }
  }, [auth.token, request])


  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const removeCategory = async (id) => {
    try {
      const data = await request('/category/remove', 'POST', {id}, {
        Authorization: `Bearer ${auth.token}`
      })
      dispatch({
        type: 'REMOVE_CATEGORY',
        payload: id
      })
      show(data.message, 'success')
    } catch (e) {
      show(e.message, 'danger')
    }
  }


  return (
    <>
      <li>
        <div className='category-list'>
          Список категорий
          <span className="badge">
                  <Link
                    to="/addCategory"
                  >
                    <FontAwesomeIcon
                      icon={['fas', 'plus']}
                      style={{color: 'rgba(0, 0, 0, .5)', marginRight: '5px'}}
                      fixedWidth
                      cursor='pointer'
                      className='navbar-links'
                    />
                  </Link>
                </span>
        </div>
      </li>

      {
        categories.length ?
          categories.map((item) => {
            return <li key={item._id}>
              <Link to='/tasks' id={item._id}>
                <div className='category-circle' style={{background: `${item.color}`}} />
                {item.title}
                <span className="badge">
                          <FontAwesomeIcon
                            icon={['fas', 'minus']}
                            style={{color: 'rgba(0, 0, 0, .5)', marginRight: '5px'}}
                            fixedWidth
                            cursor='pointer'
                            className='navbar-links'
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeCategory(item._id)
                            }}
                          />
                      </span>
              </Link>
            </li>
          })
          :
          <li>
            <div className='category-list'>
              <div className='category-title'>Создайте категорию</div>
            </div>
          </li>
      }
      <li>
        <div className="divider teal darken-4"/>
      </li>
    </>
  )
}