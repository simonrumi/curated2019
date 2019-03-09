import React, { Component } from 'react';
//import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.loggingOn = true;
    this.nextKey = 0;
    this.cellWidth = null;
    this.cellHeight = null;

    // some constants, for easy reading
    this.GRID_SIZE = 3;
    this.TOP = 0;
    this.MIDDLE = 1;
    this.BOTTOM = 2;
    this.LEFT = 0;
    this.RIGHT = 2;
  }

  render() {
    return this.makeGrid();
  }

  makeGrid = () => {
    let grid = [];
    for (let i = 0; i < this.GRID_SIZE; i++) {
      grid.push(this.makeOneRow(i));
    }
    return grid;
  }

  makeOneRow = (rowPosition) => {
    let row = [], children = [];
    let rowKey = this.getNextKey();
    for (let i = 0; i < this.GRID_SIZE; i++) {
      children.push(this.makeOneCell(i, rowPosition));
    }
    row.push(<div className="cell-3x1" key={rowKey}>{children}</div>)
    return row;
  }

  makeOneCell = (cellPosition, rowPosition) => {
    let buttonKey = this.getNextKey();
    let subPageTopNavKey = this.getNextKey();
    let cellKey = this.getNextKey();
    let navData = {gotoRow: this.MIDDLE, gotoCell: this.MIDDLE};
    let button = <button type="button" onClick={() => this.handleNav(navData)} key={buttonKey}>home</button>;
    let subPageTopNav = <div className="sub-page-top-nav" key={subPageTopNavKey}>{button}</div>;
    let cell = <div className="cell-1x1 color-2" key={cellKey}>{subPageTopNav}</div>;
    return cell;
  }

  getNextKey = () => {
    let currentKey = this.nextKey;
    this.nextKey += 1;
    return currentKey;
  }

  handleNav = (navData) => {
    // note that gotoCell and gotoRow will be 0, 1 or 2
    let leftPosition = navData.gotoCell * this.getCellWidth();
    let topPosition = navData.gotoRow * this.getCellHeight();

    window.scroll({
      top: topPosition,
      left: leftPosition,
      behavior: 'smooth'
    });
    this.log('handleNav, destination = ' + leftPosition + ', ' + topPosition);
  }

  getCellWidth = () => {
    if (this.cellWidth === null) {
      this.cellWidth = document.getElementsByClassName('cell-1x1')[0].offsetWidth;
    }
    return this.cellWidth;
  }

  getCellHeight = () => {
    if (this.cellHeight === null) {
      this.cellHeight = document.getElementsByClassName('cell-1x1')[0].offsetHeight;
      // all possibilities:
      // document.getElementsByClassName('cell-1x1')[0].clientHeight;
      // document.getElementsByClassName('cell-1x1')[0].offsetHeight;
      // document.getElementsByClassName('cell-1x1')[0].scrollHeight;
    }
    return this.cellHeight;
  }

  log = (message) => {
    if (this.loggingOn) {
      console.log(message);
    }
  }
}

export default App;
