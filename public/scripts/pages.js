const pageBuilder = () => {
    return {
      boilerplate: function(cellId) {
        let pageContainer = document.getElementById(cellId);

        let topNav = document.createElement('div');
        topNav.classList.add('nav');
        topNav.innerHTML = directions.northwest.html + directions.north.html + directions.northeast.html;
        pageContainer.appendChild(topNav);

        let pageMiddle = document.createElement('div');
        pageMiddle.classList.add('page-middle');
        pageContainer.appendChild(pageMiddle);

        let leftNav = document.createElement('div');
        leftNav.classList.add('left-nav','align-left');
        leftNav.innerHTML = directions.west.html;
        pageMiddle.appendChild(leftNav);

        let pageContent = document.createElement('div');
        pageContent.classList.add('page-content','align-left');
        pageMiddle.appendChild(pageContent);

        let rightNav = document.createElement('div');
        rightNav.classList.add('right-nav');
        rightNav.innerHTML = directions.east.html;
        pageMiddle.appendChild(rightNav);

        let bottomNav = document.createElement('div');
        bottomNav.classList.add('nav');
        bottomNav.innerHTML =  directions.southwest.html + directions.south.html + directions.southeast.html;
        pageContainer.appendChild(bottomNav);

        return pageContent;
      },

      correctSideNavHeights: function() {
        // nav divs have max-height: 4vh
        // since the nav imagees are large, this will push the size to the max height
        // so the height of the nav divs will be window.outerHeight * 4/100
        let navDivHeight = window.outerHeight * 4 / 100;
        let sideNavHeight = window.innerHeight - (2 * navDivHeight);
        console.log('got window.innerHeight = ' + window.innerHeight + ', window.outerHeight = ' + window.outerHeight + ', navDivHeight = ' + navDivHeight + ', sideNavHeight = ' + sideNavHeight);
        this.setHeightForElements(sideNavHeight, document.getElementsByClassName('left-nav'));
        this.setHeightForElements(sideNavHeight, document.getElementsByClassName('right-nav'));
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
