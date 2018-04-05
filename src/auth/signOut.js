// @flow
import * as React from 'react';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

import { Menu, menu } from '../menu';

import { lang, en, no } from '../util/lang';

class SignOut extends React.Component<{}> {

  render() {
    return (<div></div>);
  };

  componentDidMount() {
    if(menu) menu.forceUpdate();

    let result = confirm(lang.confirmSignOut);
    if (result) {
      localStorage.removeItem('signedInUser');
      history.push('/');
    } else {
      history.goBack();
    };
    this.forceUpdate();
  };
};

export { SignOut };