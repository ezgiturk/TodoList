import React from 'react';
import './App.css';

export default class AppBarView extends React.Component{
     isAuthenticated() {
        const token = localStorage.getItem('token');
        return token && token.length > 10;
    }
    handleLogout() {
        localStorage.removeItem('token');
        this.setState();
    }

    render() {
         const isAlreadyAuthenticated =this.isAuthenticated();

        return (
            <div className="N-header" >
                <nav className="navbar navbar-expand-lg navbar-light">
                    <a className="navbar-brand" href="/notes/">To-do List</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                            </li>
                        </ul>
                        {isAlreadyAuthenticated ?
                            <form className="form-inline my-2 my-lg-0">
                                <button onClick={this.handleLogout.bind(this)} className="btn btn-outline-success my-2 my-sm-0" type="submit" >Logout</button>
                            </form> : null
                        }
                    </div>
                </nav>
            </div>
        );
    }
}