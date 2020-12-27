import {useCallback, useContext, useState} from 'react'
import {useHttp} from "./http.hook";
import {AuthContext} from "../context/AuthContext";

export const useCategory = (callback, inputs) => {
  const {request} = useHttp()
  const auth = useContext(AuthContext)

  const [category, setCategory] = useState([])

  const fetchCategories = (categories) => {
    setCategory(categories)
  }

  const createCategory = (form) => {

  }
}