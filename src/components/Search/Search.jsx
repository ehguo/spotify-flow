import React, { Component } from 'react';

import './Search.css';

export default class Search extends Component {
  render() {
    return (
      <input
        className="search"
        type="text"
        autoComplete="off"
        autoFocus="true"
        size="51"
        placeholder="Search for an artist" />
    );
  }
}