document.addEventListener("DOMContentLoaded", (evt) => {
  makeGrid();

  //getUsableScreenSize();

  window.addEventListener("touchstart", (evt) => {
    //evt.preventDefault ();
    handleTouchStart(evt);
  }, {passive: false});

  window.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
    handleTouchMove(evt);
  }, {passive: false});

  //window.addEventListener("touchcanel", (evt) => {
    //evt.preventDefault ();
    //handleTouchCancel(evt);
  //  }, {passive: false});
  //window.addEventListener("touchend", (evt) => {
    //s   evt.preventDefault ();
    //handleTouchEnd(evt);
  //}, {passive: false});

  window.addEventListener("orientationchange", (evt) => {
    handleOrientationChange(evt);
  }, {passive: false}); // setting passive to false means we want to interrupt the scrolling while we run this callback. This is the default anyway

  window.addEventListener("load", (evt) => {
    handleOrientationChange(evt);
    let navData = {gotoRow: MIDDLE, gotoCell: MIDDLE};
    handleNav(navData);
  }, {passive: false});
});

const getUsableScreenSize = () => {
  let chromeHeight = getCellHeight() - window.innerHeight;
  let realWidth = window.innerWidth;
  let realHeight = window.innerHeight;
  alert('innerWidth=' + realWidth + ', innerHeight=' + realHeight + ', getCellWidth=' + getCellWidth() + ', getCellHeight=' + getCellHeight() + ', chromeHeight=' + chromeHeight);
  //see https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  // First we get the viewport width & height and we multiple them by 1% to get a value for the vw & vh units
  //let vw = window.innerWidth * 0.01;
  //let vh = window.innerHeight * 0.01;
  // Then we set the value in the custom property to the root of the document
  //document.documentElement.style.setProperty('--vw', `${vw}px`);
  //document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const makeGrid = () => {
  let grid = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    grid += makeOneRow(i);
  }
  let gridDiv = document.createElement('div');
  gridDiv.innerHTML = grid;
  let rootDiv = document.getElementById('root');
  rootDiv.appendChild(gridDiv);
}

const makeOneRow = (rowPosition) => {
  let row = '', children = '';
  let rowId = getNextId();
  for (let i = 0; i < GRID_SIZE; i++) {
    children += makeOneCell(i, rowPosition);
  }
  row = '<div class="cell-3x1" id="' + rowId + '">' + children + '</div>';
  return row;
}

const makeOneCell = (cellPosition, rowPosition) => {
  let buttonId = getNextId();
  let subPageTopNavId = getNextId();
  let cellId = getNextId();
  let navData = {gotoRow: MIDDLE, gotoCell: MIDDLE};
  let button = '<button type="button" onClick=handleNav(navData) id="' + buttonId + '">home</button>';
  let subPageTopNav = '<div className="sub-page-top-nav" id="' + subPageTopNavId + '">' + button + '</div>';
  let cell = '<div class="cell-1x1 color-' + cellPosition + '-' + rowPosition + ' id="' + cellId + '">' + subPageTopNav + '</div>';
  return cell;
}

const getNextId = () => {
  let currentId = gridState.nextId;
  gridState.nextId += 1;
  return currentId;
}

const handleNav = (navData) => {
  // note that gotoCell and gotoRow will be 0, 1 or 2
  let leftPosition = navData.gotoCell * getCellWidth();
  let topPosition = navData.gotoRow * getCellHeight();
  window.scroll({
    top: topPosition,
    left: leftPosition,
    behavior: 'smooth'
  });
  log('handleNav, destination = ' + leftPosition + ', ' + topPosition);
}

const handleTouchStart = (evt) => {
  // just want to capture scroll position and the touch position
    let touch0 = evt.touches[0];
    log('touchStartPosition=(' + touch0.clientX + ',' + touch0.clientY + ') windowPosition=(' + window.pageXOffset + ',' + window.pageYOffset + ')');
    gridState.touchStartPosition = [touch0.clientX, touch0.clientY];
    gridState.windowPosition = [window.pageXOffset, window.pageYOffset];
}

/*
* handleTouchMove - adjusts the scrolling of the window as expected, up until
* it reaches a THRESHOLD, then the window srolls all the way to the next grid section
*/
const handleTouchMove = (evt) => {
    log('touch move');
    let newTouchPosition = [evt.touches[0].clientX, evt.touches[0].clientY]
    let distanceMoved = getDistanceMoved(newTouchPosition);
    //log(' -> position = ' + newTouchPosition[0] + ',' + newTouchPosition[1]);

    if (Math.abs(distanceMoved) > THRESHOLD * getCellWidth()) {
      log(' -> position exceeded THRESHOLD...now we want to scroll');
      evt.preventDefault();
      let travelDirection = getTravelDirection(newTouchPosition);
      log('handleTouchMove - travelDirection=' + travelDirection);
      let newWindowPosition = getNewWindowPositionFromTravelDirection(travelDirection);
      let correctedWindowPosition = keepWithinGridBoundaries(newWindowPosition);
      window.scroll({
        top: correctedWindowPosition[1],
        left: correctedWindowPosition[0],
        behavior: 'smooth'
      });
    } else {
      let moveVector = subtractVectors(newTouchPosition, gridState.touchStartPosition);
      let reverseMoveVector = scaleVector(moveVector, -1);
      let newScrollPosition = addVectors(gridState.windowPosition, reverseMoveVector);
      window.scroll({
        top: newScrollPosition[1],
        left: newScrollPosition[0]
      });
    }
}

const handleTouchCancel = (evt) => {
    log('touch cancel');
}

const handleTouchEnd = (evt) => {
    log('touch end');
}

/*
* handleOrientationChange - when the deive is rotated, we need to update what the app considers
* as the width and length, for use by handleTouchMove
*/
const handleOrientationChange = (evt) => {
  toggleRootDivOrientation();
  //getUsableScreenSize();
  gridState.cellWidth = window.screen.width;
  gridState.cellHeight = window.screen.height;
}

const toggleRootDivOrientation = () => {
  let rootDiv = document.getElementById('root');
  if (window.screen.width < window.screen.height) {
    rootDiv.classList.add('full-grid-portrait');
    rootDiv.classList.remove('full-grid-landscape');
  } else {
    rootDiv.classList.add('full-grid-landscape');
    rootDiv.classList.remove('full-grid-portrait');
  }
}

const getDistanceMoved = (newTouchPosition) => {
  let differenceBetweenStartAndEndPositions = subtractVectors(newTouchPosition, gridState.touchStartPosition);
  return getVectorLength(differenceBetweenStartAndEndPositions);
}

/*
* getTravelDirection - when the user is in the middle of a touchMove, determine
* the compass direction the user is heading in (east, northeast, etc), based on their direction of travel
*/
const getTravelDirection = (newTouchPosition) => {
  if (gridState.touchStartPosition.length !== 2 || newTouchPosition.length !== 2) {
    throw new Error('both touchStartPosition and newTouchPosition must be arrays of length 2');
  }
  let xDistanceTraveled = newTouchPosition[0] - gridState.touchStartPosition[0];
  let yDistanceTraveled = newTouchPosition[1] - gridState.touchStartPosition[1];
  let angleOfTravel = Math.atan2(yDistanceTraveled, xDistanceTraveled);
  return getCompassPoint(angleOfTravel);
}

/*
* given an angle, return the closest compass direction (east, northeast, etc)
*/
const getCompassPoint = (angleOfTravel) => {
  let directionRanges = Object.values(DIRECTION_RANGES);
  let directionNames = Object.keys(DIRECTION_RANGES);
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

const getNewWindowPositionFromTravelDirection = (travelDirection) => {
  // direction vector is a unit vector. e.g. [1,-1] tells us to move 1 screen width right and 1 screen height down
  let directionVector = DIRECTION_VECTORS[travelDirection];
  let reverseDirectionVector = scaleVector(directionVector, -1);
  let newWindowPositionX = gridState.windowPosition[0] + getCellWidth() * reverseDirectionVector[0];
  let newWindowPositionY = gridState.windowPosition[1] + getCellHeight() * reverseDirectionVector[1];
  return([newWindowPositionX, newWindowPositionY]);
}

const keepWithinGridBoundaries = (windowPosition) => {
  let x = windowPosition[0];
  let y = windowPosition[1];
  if (windowPosition[0] > GRID_SIZE * getCellWidth()) {
    x = GRID_SIZE * getCellWidth();
  } else if (windowPosition[0] < 0) {
    x = 0;
  }
  if (windowPosition[1] > GRID_SIZE * getCellHeight()) {
    y = GRID_SIZE * getCellHeight();
  } else if (windowPosition[1] < 0) {
    y = 0;
  }
  return [x,y];
}

const getCellWidth = () => {
  if (gridState.cellWidth === null) {
    gridState.cellWidth = document.getElementsByClassName('cell-1x1')[0].clientWidth;
  }
  return gridState.cellWidth;
}

const getCellHeight = () => {
  //if (gridState.cellHeight === null) {
    let initialHeight = document.getElementsByClassName('cell-1x1')[0].clientHeight;
    if (window.innerHeight < initialHeight) {
      gridState.cellHeight = window.innerHeight;
      document.getElementsByClassName('cell-1x1').style.height = gridState.cellHeight;
    } else {
      gridState.cellHeight = initialHeight;
    }
    // all possibilities:
    // document.getElementsByClassName('cell-1x1')[0].clientHeight;
    // document.getElementsByClassName('cell-1x1')[0].offsetHeight; // this seems to be bigger; the whole viewable window including scroll bars
    // document.getElementsByClassName('cell-1x1')[0].scrollHeight;
  //}
  return gridState.cellHeight;
}

const addVectors = (vect1, vect2) => {
  if (vect1.length !== 2 || vect2.length !== 2 ) {
    throw new Error('both vectors must be arrays of length 2');
  }
  return [vect1[0] + vect2[0], vect1[1] + vect2[1]];
}

const subtractVectors = (vect1, vect2) => {
  if (vect1.length !== 2 || vect2.length !== 2 ) {
    throw new Error('both vectors must be arrays of length 2');
  }
  return [vect1[0] - vect2[0], vect1[1] - vect2[1]];
}

const scaleVector = (vect1, scalar) => {
  if (vect1.length !== 2 || typeof scalar != 'number') {
    throw new Error('the vector must be an array of length 2 and the scalar must be a number');
  }
  return [vect1[0] * scalar, vect1[1] * scalar];
}

const getVectorLength = (vector) => {
  let sumOfSquares = 0;
  for (let i=0; i<vector.length; i++) {
    sumOfSquares += vector[i] * vector[i];
  }
  return Math.sqrt(sumOfSquares);
}

const log = (message) => {
  if (gridState.loggingOn) {
    console.log(message);
  }
}

const gridState = {
  loggingOn: true,
  nextId: 0,
  cellWidth: null,
  cellHeight: null,
  windowPosition: [],
  touchStartPosition: [],
}

/*** some constants, for easy reading ***/
const GRID_SIZE = 3;
//const TOP = 0;
const MIDDLE = 1;
//const BOTTOM = 2;
//const LEFT = 0;
//const RIGHT = 2;
const THRESHOLD = 0.25;

// a range of angles, in radians, for each direction a cell can be found in
const DIRECTION_RANGES = {
  'east': [-1/8 * Math.PI, 1/8 * Math.PI],
  'northeast': [1/8 * Math.PI, 3/8 * Math.PI],
  'north': [3/8 * Math.PI, 5/8 * Math.PI],
  'northwest': [5/8 * Math.PI, 7/8 * Math.PI],
  'west': [-7/8 * Math.PI, 7/8 * Math.PI],
  'southwest': [-7/8 * Math.PI, -5/8 * Math.PI],
  'south': [-5/8 * Math.PI, -3/8 * Math.PI],
  'southeast': [-3/8 * Math.PI, -1/8 * Math.PI],
};

const DIRECTION_VECTORS = {
  'east': [1,0],
  'northeast': [1,1],
  'north': [0,1],
  'northwest': [-1, 1],
  'west': [-1,0],
  'southwest': [-1,-1],
  'south': [0,-1],
  'southeast': [1,-1],
};
