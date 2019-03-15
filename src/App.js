import React, { Component } from 'react';
//import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.loggingOn = true;
    this.nextKey = 0;
    this.cellWidth = null;
    this.cellHeight = null;
    this.windowPosition =[];
    this.touchStartPosition = [];

    // some constants, for easy reading
    this.GRID_SIZE = 3;
    this.TOP = 0;
    this.MIDDLE = 1;
    this.BOTTOM = 2;
    this.LEFT = 0;
    this.RIGHT = 2;
    this.THRESHOLD = 0.25;

    // a range of directions, in radians, for each direction a cell can be found in
    this.DIRECTION_RANGES = {
      'east': [-1/8 * Math.PI, 1/8 * Math.PI],
      'northeast': [1/8 * Math.PI, 3/8 * Math.PI],
      'north': [3/8 * Math.PI, 5/8 * Math.PI],
      'northwest': [5/8 * Math.PI, 7/8 * Math.PI],
      'west': [-7/8 * Math.PI, 7/8 * Math.PI],
      'southwest': [-7/8 * Math.PI, -5/8 * Math.PI],
      'south': [-5/8 * Math.PI, -3/8 * Math.PI],
      'southeast': [-3/8 * Math.PI, -1/8 * Math.PI],
    }

    this.DIRECTION_VECTORS = {
      'east': [1,0],
      'northeast': [1,1],
      'north': [0,1],
      'northwest': [-1, 1],
      'west': [-1,0],
      'southwest': [-1,-1],
      'south': [0,-1],
      'southeast': [1,-1],
    }

    window.addEventListener("touchstart", (evt) => {
      //evt.preventDefault ();
      this.handleTouchStart(evt);
    }, {passive: false});

    window.addEventListener("touchmove", (evt) => {
      evt.preventDefault();
      this.handleTouchMove(evt);
    }, {passive: false});

    //window.addEventListener("touchcanel", (evt) => {
      //evt.preventDefault ();
      //this.handleTouchCancel(evt);
  //  }, {passive: false});
    //window.addEventListener("touchend", (evt) => {
      //s   evt.preventDefault ();
      //this.handleTouchEnd(evt);
    //}, {passive: false});
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
    let cell = <div
      className="cell-1x1 color-2"
      key={cellKey}
      >{subPageTopNav}</div>;
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

  handleTouchStart = (evt) => {
    // just want to capture scroll position and the touch position
      let touch0 = evt.touches[0];
      this.log('touchStartPosition=(' + touch0.clientX + ',' + touch0.clientY + ') windowPosition=(' + window.pageXOffset + ',' + window.pageYOffset + ')');
      this.touchStartPosition = [touch0.clientX, touch0.clientY];
      this.windowPosition = [window.pageXOffset, window.pageYOffset];
  }

  /*
  * handleTouchMove - adjusts the scrolling of the window as expected, up until
  * it reaches a THRESHOLD, then the window srolls all the way to the next grid section
  */
  handleTouchMove = (evt) => {
      this.log('touch move');
      let newTouchPosition = [evt.touches[0].clientX, evt.touches[0].clientY]
      let distanceMoved = this.getDistanceMoved(newTouchPosition);
      //this.log(' -> position = ' + newTouchPosition[0] + ',' + newTouchPosition[1]);

      if (Math.abs(distanceMoved) > this.THRESHOLD * this.getCellWidth()) {    //(newTouchPosition[0] > ((1 + this.HORIZ_THRESHOLD) * this.getCellWidth())) {
        this.log(' -> position exceeded THRESHOLD...now we want to scroll');
        evt.preventDefault();
        let travelDirection = this.getTravelDirection(newTouchPosition);
        this.log('handleTouchMove - travelDirection=' + travelDirection);
        let newWindowPosition = this.getNewWindowPositionFromTravelDirection(travelDirection);
        let correctedWindowPosition = this.keepWithinGridBoundaries(newWindowPosition);
        window.scroll({
          top: correctedWindowPosition[1],
          left: correctedWindowPosition[0],
          behavior: 'smooth'
        });
      } else {
        let moveVector = this.subtractVectors(newTouchPosition, this.touchStartPosition);
        let reverseMoveVector = this.scaleVector(moveVector, -1);
        let newScrollPosition = this.addVectors(this.windowPosition, reverseMoveVector);
        //let correctedScrollPosition = this.keepWithinGridBoundaries(newScrollPosition);
        window.scroll({
          top: newScrollPosition[1],
          left: newScrollPosition[0]
        });
      }
  }

  handleTouchCancel = (evt) => {
      this.log('touch cancel');
  }

  handleTouchEnd = (evt) => {
      this.log('touch end');
  }

  getDistanceMoved = (newTouchPosition) => {
    let differenceBetweenStartAndEndPositions = this.subtractVectors(newTouchPosition, this.touchStartPosition);
    return this.getVectorLength(differenceBetweenStartAndEndPositions);
  }

  /*
  * getTravelDirection - when the user is in the middle of a touchMove, determine
  * the compass direction the user is heading in (east, northeast, etc), based on their direction of travel
  */
  getTravelDirection = (newTouchPosition) => {
    if (this.touchStartPosition.length !== 2 || newTouchPosition.length !== 2) {
      throw new Error('both touchStartPosition and newTouchPosition must be arrays of length 2');
    }
    let xDistanceTraveled = newTouchPosition[0] - this.touchStartPosition[0];
    let yDistanceTraveled = newTouchPosition[1] - this.touchStartPosition[1];
    let angleOfTravel = Math.atan2(yDistanceTraveled, xDistanceTraveled);
    return this.getCompassPoint(angleOfTravel);
  }

  /*
  * given an angle, return the closest compass direction (east, northeast, etc)
  */
  getCompassPoint = (angleOfTravel) => {
    let directionRanges = Object.values(this.DIRECTION_RANGES);
    let directionNames = Object.keys(this.DIRECTION_RANGES);
    let directionIndex;
    for (let i in directionRanges) {
      // special case for  west
      // it is the direction where the angle could be close to PI or close to -PI
      if (directionNames[i] == "west") {
        if ((angleOfTravel < directionRanges[i][0]) || (angleOfTravel > directionRanges[i][1])) {
            directionIndex = i;
            break;
          }
      } else if (angleOfTravel > directionRanges[i][0] && angleOfTravel <= directionRanges[i][1]) {
        directionIndex = i;
        break;
      }
    }
    if (!directionIndex) {
      throw new Error('in getCompassPoint(): did not find a directionIndex, angleOfTravel = ' + angleOfTravel);
    }
    return directionNames[directionIndex];
  }

  getNewWindowPositionFromTravelDirection = (travelDirection) => {
    // direction vector is a unit vector. e.g. [1,-1] tells us to move 1 screen width right and 1 screen height down
    let directionVector = this.DIRECTION_VECTORS[travelDirection];
    let reverseDirectionVector = this.scaleVector(directionVector, -1);
    let newWindowPositionX = this.windowPosition[0] + this.getCellWidth() * reverseDirectionVector[0];
    let newWindowPositionY = this.windowPosition[1] + this.getCellHeight() * reverseDirectionVector[1];
    return([newWindowPositionX, newWindowPositionY]);
  }

  keepWithinGridBoundaries = (windowPosition) => {
    let x = windowPosition[0];
    let y = windowPosition[1];
    if (windowPosition[0] > this.GRID_SIZE * this.getCellWidth()) {
      x = this.GRID_SIZE * this.getCellWidth();
    } else if (windowPosition[0] < 0) {
      x = 0;
    }
    if (windowPosition[1] > this.GRID_SIZE * this.getCellHeight()) {
      y = this.GRID_SIZE * this.getCellHeight();
    } else if (windowPosition[1] < 0) {
      y = 0;
    }
    return [x,y];
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

  addVectors = (vect1, vect2) => {
    if (vect1.length !== 2 || vect2.length !== 2 ) {
      throw new Error('both vectors must be arrays of length 2');
    }
    return [vect1[0] + vect2[0], vect1[1] + vect2[1]];
  }

  subtractVectors = (vect1, vect2) => {
    if (vect1.length !== 2 || vect2.length !== 2 ) {
      throw new Error('both vectors must be arrays of length 2');
    }
    return [vect1[0] - vect2[0], vect1[1] - vect2[1]];
  }

  scaleVector = (vect1, scalar) => {
    if (vect1.length !== 2 || typeof scalar != 'number') {
      throw new Error('the vector must be an array of length 2 and the scalar must be a number');
    }
    return [vect1[0] * scalar, vect1[1] * scalar];
  }

  getVectorLength = (vector) => {
    let sumOfSquares = 0;
    for (let i=0; i<vector.length; i++) {
      sumOfSquares += vector[i] * vector[i];
    }
    return Math.sqrt(sumOfSquares);
  }

  log = (message) => {
    if (this.loggingOn) {
      console.log(message);
    }
  }
}

export default App;
