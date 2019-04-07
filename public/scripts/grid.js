//"use strict";

const gridMaker = () => {
  return {
    makeGrid: function() {
      let grid = '';
      for (let i = 0; i < this.GRID_SIZE; i++) {
        grid += this.makeOneRow(i);
      }
      let gridDiv = document.createElement('div');
      gridDiv.innerHTML = grid;
      let rootDiv = document.getElementById('root');
      rootDiv.appendChild(gridDiv);
      rootDiv.classList.add('full-grid-' + this.gridState.orientation);
    },

    makeOneRow: function(rowPosition) {
      let row = '', children = '';
      //let rowId = getNextId();
      for (let i = 0; i < this.GRID_SIZE; i++) {
        children += this.makeOneCell(i, rowPosition);
      }
      row = '<div class="cell-3x1" id="row' + rowPosition + '">' + children + '</div>';
      return row;
    },

    makeOneCell: function(cellPosition, rowPosition) {
      let cell = '<div class="cell-1x1" id="cell' + cellPosition + '-row' + rowPosition + '"></div>'; //' + subPageTopNav + '
      return cell;
    },

    handleNav: function(navData) {
      // note that gotoCell and gotoRow will be 0, 1 or 2
      let leftPosition = navData[0] * this.getCellWidth();
      let topPosition = navData[1] * this.getCellHeight();
      window.scroll({
        top: topPosition,
        left: leftPosition,
        behavior: 'smooth'
      });
      this.log('handleNav, destination = ' + leftPosition + ', ' + topPosition);
    },

    handleTouchStart: function(evt) {
      // just want to capture scroll position and the touch position
      let touch0 = evt.touches[0];
      this.gridState.touchStartPosition = [touch0.clientX, touch0.clientY];
      this.gridState.windowPosition = [window.pageXOffset, window.pageYOffset];
    },

    /*
    * handleTouchMove - adjusts the scrolling of the window as expected, up until
    * it reaches a THRESHOLD, then the window srolls all the way to the next grid section
    */
    handleTouchMove: function(evt) {
      let newTouchPosition = [evt.touches[0].clientX, evt.touches[0].clientY]
      let distanceMoved = this.getDistanceMoved(newTouchPosition);

      if (Math.abs(distanceMoved) > this.THRESHOLD * this.getCellWidth()) {
        evt.preventDefault();
        let travelDirection = this.getTravelDirection(newTouchPosition);
        let newWindowPosition = this.getNewWindowPositionFromTravelDirection(travelDirection);
        let correctedWindowPosition = this.keepWithinGridBoundaries(newWindowPosition);
        window.scroll({
          top: correctedWindowPosition[1],
          left: correctedWindowPosition[0],
          behavior: 'smooth'
        });
      } else {
        let moveVector = this.subtractVectors(newTouchPosition, this.gridState.touchStartPosition);
        let reverseMoveVector = this.scaleVector(moveVector, -1);
        let newScrollPosition = this.addVectors(this.gridState.windowPosition, reverseMoveVector);
        window.scroll({
          top: newScrollPosition[1],
          left: newScrollPosition[0]
        });
      }
    },

    handleWindowRezise: function(evt) {
      this.updateRootDivOrientation();
      this.gridState.cellWidth = window.innerWidth;
      this.gridState.cellHeight = window.innerHeight;
    },

    updateRootDivOrientation: function() {
      let rootDiv = document.getElementById('root');
      if (window.screen.width < window.screen.height) {
        rootDiv.classList.add('full-grid-portrait');
        rootDiv.classList.remove('full-grid-landscape');
      } else {
        rootDiv.classList.add('full-grid-landscape');
        rootDiv.classList.remove('full-grid-portrait');
      }
    },

    getDistanceMoved: function(newTouchPosition) {
      let differenceBetweenStartAndEndPositions = this.subtractVectors(newTouchPosition, this.gridState.touchStartPosition);
      return this.getVectorLength(differenceBetweenStartAndEndPositions);
    },

    /*
    * getTravelDirection - when the user is in the middle of a touchMove, determine
    * the compass direction the user is heading in (east, northeast, etc), based on their direction of travel
    */
    getTravelDirection: function(newTouchPosition) {
      if (this.gridState.touchStartPosition.length !== 2 || newTouchPosition.length !== 2) {
        throw new Error('both touchStartPosition and newTouchPosition must be arrays of length 2');
      }
      let xDistanceTraveled = newTouchPosition[0] - this.gridState.touchStartPosition[0];
      let yDistanceTraveled = newTouchPosition[1] - this.gridState.touchStartPosition[1];
      let angleOfTravel = Math.atan2(yDistanceTraveled, xDistanceTraveled);
      return this.getCompassPoint(angleOfTravel);
    },

    /*
    * given an angle, return the closest compass direction (east, northeast, etc)
    */
    getCompassPoint: function(angleOfTravel) {
      let closestDirection = Object.keys(directions).reduce((result, direction) => {
        if (direction == 'west') {
          if ((angleOfTravel < directions[direction].range[0]) || (angleOfTravel > directions[direction].range[1])) {
              result = direction;
            }
        } else if (angleOfTravel > directions[direction].range[0] && angleOfTravel <= directions[direction].range[1]) {
          result = direction;
        }
        return result;
      }, null);
      return closestDirection;
    },

    getNewWindowPositionFromTravelDirection: function(travelDirection) {
      // direction vector is a unit vector. e.g. [1,-1] tells us to move 1 screen width right and 1 screen height down
      let directionVector = directions[travelDirection]['vector'];
      let reverseDirectionVector = this.scaleVector(directionVector, -1);
      let newWindowPositionX = this.gridState.windowPosition[0] + this.getCellWidth() * reverseDirectionVector[0];
      let newWindowPositionY = this.gridState.windowPosition[1] + this.getCellHeight() * reverseDirectionVector[1];
      return([newWindowPositionX, newWindowPositionY]);
    },

    keepWithinGridBoundaries: function(windowPosition) {
      let x = windowPosition[0];
      let y = windowPosition[1];
      if (x > this.GRID_SIZE * this.getCellWidth()) {
        x = this.GRID_SIZE * this.getCellWidth();
      } else if (x < 0) {
        x = 0;
      }
      if (y > this.GRID_SIZE * this.getCellHeight()) {
        y = this.GRID_SIZE * this.getCellHeight();
      } else if (y < 0) {
        y = 0;
      }
      return [x,y];
    },

    getCellWidth: function() {
      if (this.gridState.cellWidth === null) {
        this.gridState.cellWidth = document.getElementsByClassName('cell-1x1')[0].clientWidth;
      }
      return this.gridState.cellWidth;
    },

    getCellHeight: function() {
      let initialHeight = document.getElementsByClassName('cell-1x1')[0].clientHeight;
      if (window.innerHeight < initialHeight) {
        this.gridState.cellHeight = window.innerHeight;
        document.getElementsByClassName('cell-1x1')[0].style.height = this.gridState.cellHeight;
      } else {
        this.gridState.cellHeight = initialHeight;
      }
      // all possibilities:
      // document.getElementsByClassName('cell-1x1')[0].clientHeight;
      // document.getElementsByClassName('cell-1x1')[0].offsetHeight; // this seems to be bigger; the whole viewable window including scroll bars
      // document.getElementsByClassName('cell-1x1')[0].scrollHeight;
      return this.gridState.cellHeight;
    },

    addVectors: function(vect1, vect2) {
      if (vect1.length !== 2 || vect2.length !== 2 ) {
        throw new Error('both vectors must be arrays of length 2');
      }
      return [vect1[0] + vect2[0], vect1[1] + vect2[1]];
    },

    subtractVectors: function(vect1, vect2) {
      if (vect1.length !== 2 || vect2.length !== 2 ) {
        throw new Error('both vectors must be arrays of length 2');
      }
      return [vect1[0] - vect2[0], vect1[1] - vect2[1]];
    },

    scaleVector: function(vect1, scalar) {
      if (vect1.length !== 2 || typeof scalar != 'number') {
        throw new Error('the vector must be an array of length 2 and the scalar must be a number');
      }
      return [vect1[0] * scalar, vect1[1] * scalar];
    },

    getVectorLength: function(vector) {
      let sumOfSquares = 0;
      for (let i=0; i<vector.length; i++) {
        sumOfSquares += vector[i] * vector[i];
      }
      return Math.sqrt(sumOfSquares);
    },

    log: function(message) {
      if (this.gridState.loggingOn) {
        console.log(message);
      }
    },

    setOrientation: function() {
      if (window.screen.height > window.screen.width) {
        this.gridState.orientation = 'portrait';
      } else {
        this.gridState.orientation = 'landscape';
      }
      this.log('orientation is now ' + this.gridState.orientation);
      return this.gridState.orientation;
    },

    gridState: {
      loggingOn: true,
      cellWidth: null,
      cellHeight: null,
      windowPosition: [],
      touchStartPosition: [],
      orientation: null,
    },

    /*** some constants, for easy reading ***/
    GRID_SIZE: 3,
    TOP: 0,
    MIDDLE: 1,
    BOTTOM: 2,
    LEFT: 0,
    RIGHT: 2,
    THRESHOLD: 0.18,

    /* handleTouchCancel: function(evt) {
        log('touch cancel');
    },

    handleTouchEnd: function(evt) {
        log('touch end');
    }, */
  }
}
