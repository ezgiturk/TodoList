import React from 'react';

import Paper from '@material-ui/core/Paper';
import LoginForm from './LoginForm';
import Notes from "./Notes";
import Redirect from "react-router/es/Redirect";
import AppBarView from "./AppBarView";
import './login.css';

const styles = {
    paper: {
        minHeight: '100px',
        padding: '40px'
    }
};
export default class Login extends React.Component{

    isAuthenticated() {
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }

    render() {
        const isAlreadyAuthenticated = this.isAuthenticated();
        return (
            <div>
                <AppBarView/>
                {isAlreadyAuthenticated ? <Redirect to='/notes'/> : (
                    <div className="home-container">
                        <LoginForm/>
                    </div>
                )}

            </div>
        );
    }
}
