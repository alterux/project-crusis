// @flow
import * as React from 'react';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

import { lang, en, no } from './lang';
import { connection } from './connect';
import { User, userService } from './userService';
import { Event, eventService } from './eventService';
import { ErrorMessage, errorMessage } from './errorMessage';

class UserDetails extends React.Component<{ match: { params: { id: number } } }> {
  refs: {
    contactUserButton: HTMLInputElement,
    acceptUserButton: HTMLInputElement,
    rejectUserButton: HTMLInputElement,
    editUserButton: HTMLInputElement,
    inputFirstName: HTMLInputElement,
  }

  signedInUser = {};
  user = {};

  render() {
    let signedInUser = this.signedInUser;
    let user = this.user;

    let userTypeMsg;
    let userButton;

    // Switch for userType.
    switch (user.userType) {
      case 0:
        userTypeMsg = lang.userType + ": " + lang.new
        break;
      case 1:
        userTypeMsg = lang.userType + ": " + lang.user
        break;
      case 2:
        userTypeMsg = lang.userType + ": " + lang.leader
        break;
      case 3:
        userTypeMsg = lang.userType + ": " + lang.admin
        break;
      default:
        userTypeMsg = ""
    }

    // signed in user is looking at own profile
    if (signedInUser.id === user.id) {
      userButton = <div><button ref="editUserButton">{lang.edit}</button></div>

    // signed in user is of type admin
    } else if (signedInUser.userType === 3) {
      // user profile is new
      if (user.userType === 0) {
        userButton = <div><button ref="acceptUserButton">{lang.accept}</button>
                     <button ref="rejectUserButton">{lang.reject}</button></div>
      // user profile is not new
      } else {
        userButton = <div><button ref="editUserButton">{lang.edit}</button>
                     <button ref="contactUserButton">{lang.contact}</button></div>
      }
    // user is not looking at own profile and is not of type admin
    } else {
      userButton = <div><button ref="contactUserButton">{lang.contact}</button></div>
    }

      return (
        <div>
          {userButton}
          <img className="accountImg" src="resources/default.png" alt="Account Image" width="50px" height="50px"></img>
          <br />{user.firstName} {user.middleName} {user.lastName}<br />
          <br />{lang.age}: {user.age}
          <br />{lang.city}: {user.city}<br />
          <br />{userTypeMsg}
        </div>
      );
  }

  componentDidMount() {
    // User
    let signedInUser = userService.getSignedInUser();
    if(signedInUser) {
      this.signedInUser = signedInUser;

      userService.getUser(this.props.match.params.id).then((user) => {
        this.user = user[0];
        this.forceUpdate();

        // Accept and reject buttons
        if (this.refs.acceptUserButton && this.refs.rejectUserButton) {
          // Accept button
          this.refs.acceptUserButton.onclick = () => {
            userService.editUserType(1, user[0].id);
            history.push('/members');
          }
          // Reject button
          this.refs.rejectUserButton.onclick = () => {
            let result = confirm(lang.confirmUserDelete);
            if (result) {
              userService.deleteUser(user[0].id)
              history.push('/members');
            }
          }
        }

        // Edit button
        if (this.refs.editUserButton) {
          this.refs.editUserButton.onclick = () => {
            history.push('/user/' + user[0].id + '/edit/');
          }
        }

        // Contact button
        if (this.refs.contactUserButton) {
          this.refs.contactUserButton.onclick = () => {
            console.log("Contact Button Pressed");
          }
        }
      }).catch((error: Error) => {
        if(errorMessage) console.log(error);
      });
    }
  }

  // Called when the this.props-object change while the component is mounted
  // For instance, when navigating from path /user/1 to /user/2
  componentWillReceiveProps() {
    setTimeout(() => { this.componentDidMount(); }, 0); // Enqueue this.componentDidMount() after props has changed
  }
}

export { UserDetails };
