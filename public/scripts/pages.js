const pageBuilder = (grid) => {
    function makeNavBtn(direction) {
      let btn = document.createElement('div');
      btn.innerHTML = directions[direction]['img'];
      directions[direction]['classes'].forEach((btnClass) => {
        btn.classList.add(btnClass);
      });
      btn.addEventListener('click', grid.handleNav.bind(grid, directions[direction]['gridPosition']));
      return btn;
    }

    return {
      boilerplate: function(cellId) {
        let pageContainer = document.getElementById(cellId);

        // note that divs have to be appended in the order left, right, center
        // otherwise the right div will be pushed down a line

        let topNav = document.createElement('div');
        topNav.classList.add('nav-top');

        let northWestBtn = makeNavBtn('northwest');
        topNav.appendChild(northWestBtn);

        let northEastBtn = makeNavBtn('northeast');
        topNav.appendChild(northEastBtn);

        let northBtn = makeNavBtn('north');
        topNav.appendChild(northBtn);

        pageContainer.appendChild(topNav);

        let pageMiddle = document.createElement('div');
        pageMiddle.classList.add('page-middle');

        let leftNav = makeNavBtn('west');
        pageMiddle.appendChild(leftNav);

        let rightNav = makeNavBtn('east');
        rightNav.classList.add('right-nav', 'align-right');
        rightNav.innerHTML = directions.east.img;
        pageMiddle.appendChild(rightNav);

        let pageContent = document.createElement('div');
        pageContent.classList.add('page-content','align-center');
        pageMiddle.appendChild(pageContent);

        pageContainer.appendChild(pageMiddle);

        let bottomNav = document.createElement('div');
        bottomNav.classList.add('clear', 'nav-bottom');

        let southWestBtn = makeNavBtn('southwest');
        bottomNav.appendChild(southWestBtn);

        let southEastBtn = makeNavBtn('southeast');
        bottomNav.appendChild(southEastBtn);

        let southBtn = makeNavBtn('south');
        bottomNav.appendChild(southBtn);

        pageContainer.appendChild(bottomNav);

        return pageContent;
      },

      correctSideNavHeights: function() {
        let navTopHeight = this.getElementHeight('#cell1-row1 .nav-top');
        let navBottomHeight = this.getElementHeight('#cell1-row1 .nav-bottom');
        let sideNavHeight = window.innerHeight - navTopHeight - navBottomHeight; // - (2 * navDivMarginPx);
        console.log('got window.innerHeight = ' + window.innerHeight + ', navBottomHeight = ' + navBottomHeight + ', navTopHeight = ' + navTopHeight + ', sideNavHeight = ' + sideNavHeight);
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

      homePage: function(pageContentDiv) {
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
      },
    }
}
