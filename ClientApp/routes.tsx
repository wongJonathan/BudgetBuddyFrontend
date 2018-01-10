import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';

// When a nav link calls one of these paths, it redirects it to the specified page
export const routes =
    <div>
            <Route path='/homePage' component={Home} />
        <Route exact path='/' component={LoginPage} />
        <Route path='/registerPage' component={RegisterPage} />
    </div>
    
