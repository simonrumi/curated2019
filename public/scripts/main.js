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
  let homePageContentDiv = homePageCell.getElementsByClassName('page-content')[0];
  buildIt.homePage(homePageContentDiv);
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
