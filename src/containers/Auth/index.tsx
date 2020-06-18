import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ForgotPassword, Login } from '../../components/Auth';
import { ResetPassword } from './ResetPassword';

const Auth = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/login`}>
                <Login />
            </Route>
            <Route path={`${path}/forgotPassword`}>
                <ForgotPassword />
            </Route>
            <Route path={`${path}/resetPassword`}>
                <ResetPassword />
            </Route>
        </Switch>
    );
};

export default Auth;
