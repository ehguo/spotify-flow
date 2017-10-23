import React, { Component } from 'react';

import './Login.css';

const authorize_base = 'https://accounts.spotify.com/authorize/'
const client_id = '517b60decf434a6687c88798ec89c000';
const response_type = 'token';
const redirect_uri = 'http://localhost:3000/callback';

export default class Login extends Component {
  handleClick() {
    const authorize = `${authorize_base}?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
    window.location.replace(authorize);
  }

  render() {
    return (
      <button
        className="login"
        onClick={this.handleClick}>
        Login
      </button>
    );
  }
}
