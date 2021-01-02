import React, {useReducer} from 'react'
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./routes";
import {Navbar} from "./components/Navbar/Navbar";
import {Alert} from "./components/Alert";
import {Loader} from "./components/Loader";
import {AddButton} from "./components/AddButton/AddButton";
import {AlertState} from "./context/alert/AlertState";
import {AuthContext} from "./context/AuthContext";
import {CategoryContext, initialState, categoryReducer} from "./context/category/сategoryContext";
import {useAuth} from "./hooks/auth.hook";
import './fontawesome';


function App() {
  const {name, login, logout, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  const [categories, dispatch] = useReducer(categoryReducer, initialState)

  if (!ready) {
    return <Loader/>
  }

  return (
    <AuthContext.Provider value={{
      name, token, login, logout, userId, isAuthenticated
    }}>
      <CategoryContext.Provider value={{dispatch, categories}}>
        <AlertState>
          <BrowserRouter>
            <Navbar/>
            <div className='app'>
              <Alert/>
              {routes}
              {isAuthenticated ?
                <AddButton />
                : null
              }
            </div>
          </BrowserRouter>
        </AlertState>
      </CategoryContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;
