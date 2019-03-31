import React, { Component } from 'react';

class App extends Component {
  /*state = {
    loggingOn: true,
    nextKey: 0,
    cellWidth: null,
    cellHeight: null,
    windowPosition: [],
    touchStartPosition: [],
  }*/

  /* don't seem to need this
  constructor(props) {
    super(props);
  }
  */
  componentDidMount() {
    console.log('****componentDidMount****');
  }

  render() {
    console.log('****rendering****');
    return null;
  }
}

export default App;
