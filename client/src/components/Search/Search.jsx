import React, { Component } from 'react';

import './Search.css';

export default class Search extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
    const searchValue = e.target[0].value;
    const queryString = window.location.href.split('#')[1];
    const queryParams = queryString.split('&');
    const accessToken = queryParams[0].split('=')[1];
    fetch('https://api.spotify.com/v1/me',
      new Headers({
        'Authorization': 'Bearer ' + accessToken
      })
    )
      .then(res => {
        console.log(res);
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="search"
          type="text"
          autoComplete="off"
          autoFocus="true"
          placeholder="Search for an artist"
        />
      </form>
    );
  }
}
