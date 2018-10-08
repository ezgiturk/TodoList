import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Col, Row} from "react-flexbox-grid";
import Login from "./Login";
import AppBarView from "./AppBarView";
import Notes from "./Notes";
import axios from 'axios'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(<MuiThemeProvider>
    <BrowserRouter>
        <Row around='xs'>
            <Col xs={12} md={11}>
                <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/notes" component={Notes}/>
                </Switch>
            </Col>
        </Row>
    </BrowserRouter>

</MuiThemeProvider>, document.getElementById('root'));

registerServiceWorker();
