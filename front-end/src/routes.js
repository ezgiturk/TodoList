import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Notes from './Notes';

export default () =>
    (<BrowserRouter>
            <Switch>
                <Route path="notes" exact component={Notes}/>
            </Switch>
    </BrowserRouter>);
