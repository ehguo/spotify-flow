import React, { Component } from 'react';

import Login from './components/Login/Login';
import Search from './components/Search/Search';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Login />
        <Search />
      </div>
    );
  }
}

export default App;
