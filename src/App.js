import React, { Component } from 'react';



class App extends Component {
  /***************
  QQQQQQQ need to set the state somehow - react updates every time the state is change, so make use of that QQQQQQQQQ
  then need to use state change to update size of cells
  these need to be changed when the orientation changes
  also need to take the url window into account and make the cell smaller than 100vh
  after all that, then need to work out how to display content within the cells, maybe using layers
  **************/
  state = {
    loggingOn: true,
    nextKey: 0,
    cellWidth: null,
    cellHeight: null,
    windowPosition: [],
    touchStartPosition: [],
  }

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

  /* *****
  * keeping these here for reference in case we need to go back to doing these in react
  
  makeGrid = () => {
    let grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      grid.push(makeOneRow(i));
    }
    return grid;
  }

  makeOneRow = (rowPosition) => {
    let row = [], children = [];
    let rowKey = getNextKey();
    for (let i = 0; i < GRID_SIZE; i++) {
      children.push(makeOneCell(i, rowPosition));
    }
    row.push(<div className="cell-3x1" key={rowKey}>{children}</div>)
    return row;
  }

  makeOneCell = (cellPosition, rowPosition) => {
    let buttonKey = getNextKey();
    let subPageTopNavKey = getNextKey();
    let cellKey = getNextKey();
    let navData = {gotoRow: MIDDLE, gotoCell: MIDDLE};
    let button = <button type="button" onClick={() => handleNav(navData)} key={buttonKey}>home</button>;
    let subPageTopNav = <div className="sub-page-top-nav" key={subPageTopNavKey}>{button}</div>;
    let cell = <div
      className={'cell-1x1 color-' + cellPosition + '-' + rowPosition}
      key={cellKey}
      >{subPageTopNav}</div>;
    return cell;
  }
  ******/

}

export default App;
