'use strict';
const config = require('./config');

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Index from './components/Index';
import AoiList from './components/AoiList';
import Aoi from './components/Aoi';
import NewAoi from './components/NewAoi';



class App extends React.Component {
  static contextTypes = {
      router: T.object
    };

  constructor (props) {
    super(props);
    console.log(this.context)
  }


  render () {
    const component = this;
    let children = null;
    if (component.props.children) {
      children = React.cloneElement(component.props.children, {
        auth: component.props.route.auth
      });
    }
    return (
      <div>
        {children}
      </div>
    );
  } 
}


ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="aois" component={AoiList} />
      <Route path="aois/new" component={NewAoi} />
      <Route path="aois/:id" component={Aoi} />
    </Route>
  </Router>,
  document.querySelector('#site-canvas')
);