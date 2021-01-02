import {createContext} from 'react'

export const CategoryContext = createContext()

export const initialState = []

export const categoryReducer = (categories, action) => {
  switch (action.type) {
    case 'SAVE_CATEGORY':
      return action.payload
    case 'FETCH_CATEGORY':
      return action.payload
    case 'REMOVE_CATEGORY':
      return categories.filter(n => n._id !== action.payload)
    default:
      return categories;
  }
}