"use strict";

document.addEventListener("DOMContentLoaded", (evt) => {
  let grid = gridMaker();
  grid.setOrientation();
  grid.makeGrid();
  let buildIt = pageBuilder();
  let homePageContentDiv = buildIt.boilerplate('cell1-row1');
  buildIt.homePage(homePageContentDiv);
  let topPageContentDiv = buildIt.boilerplate('cell1-row0');
  buildIt.correctSideNavHeights();

  window.addEventListener("touchstart", (evt) => {
    //evt.preventDefault ();
    grid.handleTouchStart(evt);
  }, {passive: false});

  window.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
    grid.handleTouchMove(evt);
  }, {passive: false});

  window.addEventListener("orientationchange", (evt) => {
    grid.handleOrientationChange(evt).then(buildIt.correctSideNavHeights.bind(buildIt));
    //buildIt.correctSideNavHeights();
  }, {passive: false}); // setting passive to false means we want to interrupt the scrolling while we run this callback. This is the default anyway

  window.addEventListener("load", (evt) => {
    //grid.handleOrientationChange(evt, buildIt.correctSideNavHeights.bind(buildIt));
    let navData = {gotoRow: grid.MIDDLE, gotoCell: grid.MIDDLE};
    grid.handleNav(navData);
  }, {passive: false});
});
