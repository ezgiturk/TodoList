import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import superagent from 'superagent';
import {Redirect} from "react-router";

export default class LoginForm extends React.Component{
    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            isLoggedIn: false
        };

        this.submitForm = this.submitForm.bind(this)
    }
    handleUsernameChanged(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChanged(event) {
        this.setState({password: event.target.value});
    }

    submitForm(event) {
        event.preventDefault();
        //
        superagent
            .post('http://localhost:8000/api/login')
            .send({username: this.state.username, password: this.state.password})
            .end((err, res) => {
                if(err) { this.setState({errorMessage: "Authentication Failed"}); return;}

                localStorage.setItem("token", res.body.token);
                console.log('res.body:', res.body);
                this.setState({
                    isLoggedIn: true
                });
            });
    }

    render() {
        const {isLoggedIn} = this.state;
        return (
            <div className="login">
                {isLoggedIn ?
                    <Redirect to="/notes"/> :

                        <form className="login-form" onSubmit={this.submitForm.bind(this)}>
                            <h2>Login</h2>

                            Username:
                            <input
                                value={this.state.username}
                                onChange={this.handleUsernameChanged.bind(this)}/>
                            <p></p>
                            Password:
                            <input
                                value={this.state.password}
                                type='password'
                                onChange={this.handlePasswordChanged.bind(this)}/>
                            <hr></hr>
                            <Button
                                type="submit"
                                children="Login"
                            />
                        </form>
                        /**
                        <form className="form-inline" onSubmit={this.submitForm.bind(this)}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="username" />
                            </div>
                            <div className="form-group mx-sm-3 mb-2">
                                <input type="password" className="form-control" placeholder="Password"/>
                            </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                        </form>**/

                        }
            </div>
         );
    }
}
