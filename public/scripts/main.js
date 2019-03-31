"use strict";

document.addEventListener("DOMContentLoaded", (evt) => {
  makeGrid();
  let buildIt = pageBuilder();
  let homePageContentDiv = buildIt.boilerplate('cell1-row1');
  buildIt.homePage(homePageContentDiv);
  let topPageContentDiv = buildIt.boilerplate('cell1-row0');
});
