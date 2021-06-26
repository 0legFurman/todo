import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import {MainPage} from './Pages/Main'
import {AuthPage} from './Pages/Authorization'
import './routes.css';

export const useRoutes = (isAuthenticated, userID, logout) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/main' exact>
                    <MainPage userID={userID} logout={logout}/>
                </Route>
                <Redirect to='/main' />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path='/' exact>
                <AuthPage />
            </Route>
            <Redirect to='/' />
        </Switch>
    )
}