"use strict";

document.addEventListener("DOMContentLoaded", (evt) => {
  let grid = gridMaker();
  grid.setOrientation();
  grid.makeGrid();
  let buildIt = pageBuilder(grid);
  let cells = Object.values(directions);
  cells.forEach((cell) => {
    buildIt.boilerplate('cell' + cell['gridPosition'][0] + '-row' + cell['gridPosition'][1]);
  });

  let homePageCell = document.getElementById('cell1-row1');
  let homePageContainer = homePageCell.getElementsByClassName('page-content')[0];
  let homePageContent = document.getElementById('page-content-1-1').children[0];
  homePageContainer.appendChild(homePageContent);

  let videosPageCell = document.getElementById('cell1-row0');
  let videosPageContainer = videosPageCell.getElementsByClassName('page-content')[0];
  let videosPageContent = document.getElementById('page-content-1-0').children[0];
  videosPageContainer.appendChild(videosPageContent);

  buildIt.correctSideNavHeights();

  window.addEventListener("touchstart", (evt) => {
    grid.handleTouchStart(evt);
  }, {passive: false});

  window.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
    grid.handleTouchMove(evt);
  }, {passive: false});

  window.addEventListener("resize", (evt) => {
    grid.handleWindowResize();
    buildIt.correctSideNavHeights();
  }, {passive: true}); // setting passive to true means we do not want to interrupt the scrolling while we run this callback.

  window.addEventListener("load", (evt) => {
    buildIt.correctSideNavHeights();
    grid.initPosition();
  }, {passive: false});
});
