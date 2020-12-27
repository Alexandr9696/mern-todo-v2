import React from 'react'
import {Route, Switch} from "react-router";
import {Home} from "./pages/Home";
import {TaskPage} from "./pages/TaskPage";
import {Register} from "./pages/Register";
import {Login} from "./pages/Login";
import {Reset} from "./pages/Reset";
import {PasswordReset} from "./pages/PasswordReset";
import {AddTask} from "./pages/AddTask";


export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path='/'>
          <Home/>
        </Route>
        <Route exact path='/tasks'>
          <TaskPage/>
        </Route>
        <Route exact path='/addTask'>
          <AddTask />
        </Route>
       </Switch>
    )
  }

  return (
    <Switch>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route exact path='/auth/register'>
        <Register/>
      </Route>
      <Route exact path='/auth/login'>
        <Login/>
      </Route>
      <Route exact path='/auth/reset'>
        <Reset />
      </Route>
      <Route exact path='/auth/reset/:token'>
        <PasswordReset />
      </Route>
    </Switch>
  )
}