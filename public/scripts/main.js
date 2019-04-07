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
  //let homePageContentDiv = buildIt.boilerplate('cell1-row1');
  let homePageCell = document.getElementById('cell1-row1');
  let homePageContentDiv = homePageCell.getElementsByClassName('page-content')[0];
  buildIt.homePage(homePageContentDiv);
  //let topPageContentDiv = buildIt.boilerplate('cell1-row0');
  buildIt.correctSideNavHeights();

  window.addEventListener("touchstart", (evt) => {
    //evt.preventDefault ();
    grid.handleTouchStart(evt);
  }, {passive: false});

  window.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
    grid.handleTouchMove(evt);
  }, {passive: false});

  /*window.addEventListener("orientationchange", (evt) => {
    grid.handleOrientationChange(evt).then(buildIt.correctSideNavHeights.bind(buildIt));
    //buildIt.correctSideNavHeights();
  }, {passive: false});*/

  window.addEventListener("resize", (evt) => {
    grid.handleWindowRezise();
    buildIt.correctSideNavHeights();
  }, {passive: true}); // setting passive to true means we do not want to interrupt the scrolling while we run this callback.

  window.addEventListener("load", (evt) => {
    let navData = [grid.MIDDLE, grid.MIDDLE];
    grid.handleNav(navData);
  }, {passive: false});
});
