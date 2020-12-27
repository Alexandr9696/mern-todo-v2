import React, {useEffect, useRef, useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSSTransition} from "react-transition-group";
import './AddButton.scss'
import {Link} from "react-router-dom";

export const AddButton = () => {
  const [visible, setVisible] = useState(false)
  const node = useRef()

  const handleClick = (e) => {
    if (!node.current.contains(e.target)) {
      setVisible(false)
    }
  }

  useEffect(() => {
    if (visible === true) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    }
  }, [visible])

  const addHandler = () => {
    setVisible(visible => !visible)
  }

  return (
    <>
      <div className="fixed-btn">
        <CSSTransition
          in={visible}
          timeout={{
            enter: 500,
            exit: 350
          }}
          classNames={'drop-left'}
          mountOnEnter
          unmountOnExit
        >
          <ul>
            <li>
              <Link className='btn waves-effect waves-teal-darken-4 teal darken-3 btn-add' to="/addTask">
                Новая задача
              </Link>
              </li>
            <li>
              <Link className='btn waves-effect waves-teal-darken-4 teal darken-3 btn-add' to="/tasks">
                Новая заметка
              </Link>
            </li>
          </ul>
        </CSSTransition>
        <button
          className="btn-floating btn-large teal darken-3"
          onClick={addHandler}
          ref={node}
        >
          <i className="large material-icons">
            <FontAwesomeIcon
              icon={['fas', 'plus']}
              style={{color: 'white'}}
            />
          </i>
        </button>
      </div>
    </>
  )
}
