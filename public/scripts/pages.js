const pageBuilder = (grid) => {
    function makeNavBtn(direction, cellId) {
      if (!direction || !cellId) {
        throw new Error('pageBuilder.makeNavBtn got direction ' + direction + ', & cellId ' + cellId);
        return;
      }
      let location = getCellLocationFromCellId(cellId);
      let buttonValid = validiateButtonDirection(location, direction);
      let btn = document.createElement('div');
      if (buttonValid) {
        btn.innerHTML = directions[direction]['img'];
        btn.addEventListener('click', grid.handleNav.bind(grid, location, directions[direction]['vector']));
      }
      directions[direction]['classes'].forEach((btnClass) => {
        btn.classList.add(btnClass);
      });
      return btn;
    }

    // the cellId is something like "cell0-row1"
    // this will return something like [0,1]
    function getCellLocationFromCellId(cellId) {
      if (!cellId) {
        throw new Error('pageBuilder.getCellLocationFromCellId got cellId ' + cellId);
        return;
      }
      let regex = /cell(\d)-row(\d)/ig;
      let cellRegexArr = regex.exec(cellId);
      if (cellRegexArr.length >= 3) {
          return [parseInt(cellRegexArr[1]), parseInt(cellRegexArr[2])];
      } else {
        throw new Error('pageBuilder.getCellLocationFromCellId could not find the cell and row from the string ' + cellId);
        return;
      }
    }

    function validiateButtonDirection(location, direction) {
      let buttonValid = true;
      for (i=0; i<location.length; i++) {
        if (location[i] <= 0 && directions[direction]['vector'][i] < 0) {
          buttonValid = false;
        } else if (location[i] >= (grid.GRID_SIZE - 1) && directions[direction]['vector'][i] > 0) {
          buttonValid = false;
        }
      }
      return buttonValid;
    }

    return {
      boilerplate: function(cellId) {
        let pageContainer = document.getElementById(cellId);

        // note that divs have to be appended in the order left, right, center
        // otherwise the right div will be pushed down a line

        let topNav = document.createElement('div');
        topNav.classList.add('nav-top');

        let northWestBtn = makeNavBtn('northwest', cellId);
        topNav.appendChild(northWestBtn);

        let northEastBtn = makeNavBtn('northeast', cellId);
        topNav.appendChild(northEastBtn);

        let northBtn = makeNavBtn('north', cellId);
        topNav.appendChild(northBtn);

        pageContainer.appendChild(topNav);

        let pageMiddle = document.createElement('div');
        pageMiddle.classList.add('page-middle');

        let leftNav = makeNavBtn('west', cellId);
        pageMiddle.appendChild(leftNav);

        let rightNav = makeNavBtn('east', cellId);
        pageMiddle.appendChild(rightNav);

        let pageContent = document.createElement('div');
        pageContent.classList.add('page-content','align-center');
        pageMiddle.appendChild(pageContent);

        pageContainer.appendChild(pageMiddle);

        let bottomNav = document.createElement('div');
        bottomNav.classList.add('clear', 'nav-bottom');

        let southWestBtn = makeNavBtn('southwest', cellId);
        bottomNav.appendChild(southWestBtn);

        let southEastBtn = makeNavBtn('southeast', cellId);
        bottomNav.appendChild(southEastBtn);

        let southBtn = makeNavBtn('south', cellId);
        bottomNav.appendChild(southBtn);

        pageContainer.appendChild(bottomNav);

        return pageContent;
      },

      correctSideNavHeights: function() {
        let navTopHeight = this.getElementHeight('#cell1-row1 .nav-top');
        let navBottomHeight = this.getElementHeight('#cell1-row1 .nav-bottom');
        let sideNavHeight = window.innerHeight - navTopHeight - navBottomHeight;
        this.setHeightForElements(sideNavHeight, document.getElementsByClassName('nav-left'));
        this.setHeightForElements(sideNavHeight, document.getElementsByClassName('nav-right'));
      },

      getElementHeight: function(elementSelector) {
        let element = document.querySelector(elementSelector);
        let elementHeight = parseFloat(window.getComputedStyle(element).height) +
          parseFloat(window.getComputedStyle(element).marginTop) +
          parseFloat(window.getComputedStyle(element).marginBottom);
        return elementHeight;
      },

      setHeightForElements: function(height, elements) {
        let elementArr = Object.values(elements);
        for (let i=0; i< elementArr.length; i++) {
          elementArr[i].style.height = height + 'px';
        }
      },

      /*homePage: function(pageContentDiv) {
        let whatWeDo = document.createElement('div');
        whatWeDo.classList.add('text-block-med');
        whatWeDo.innerHTML =
          "<p>Curated Entertainment is a one-of-a-kind, boutique entertainment company in the San Francisco Bay Area, specializing in custom creating and performing never seen before, immersive and story-driven entertainment programs.<br>" +
          "<br>Co-founded in 2018 by Mind-Magician & Speaker, Heather Rogers and Vocalist & Composer, Velia Amarasingham, we exist to collaborate with event planners and designers to bring their events' themes to vivid life through deeply customized, entertainment programs featuring music, magic, interactive games, emcee programs, and much, much more.<br>" +
          "<br>We're the company to call when you're looking for something different.</p>";
        pageContentDiv.appendChild(whatWeDo);

        let logo = document.createElement('div');
        logo.classList.add('curated-logo');
        logo.innerHTML = '<img src="/img/curated-logo-min.png"/>';
        pageContentDiv.appendChild(logo);
      }, */
    }
}
