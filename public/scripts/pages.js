const pageBuilder = () => {
  return {
    buildPage: () => {
      let pageContainer = document.getElementById('cell1-row1');

      let topNav = document.createElement('div');
      topNav.classList.add('nav');
      topNav.innerHTML = '<img src="/img/arrowNW.png" class="align-left"/><img src="/img/arrowN.png"/><img src="/img/arrowNE.png" class="align-right"/>';
      pageContainer.appendChild(topNav);

      let pageMiddle = document.createElement('div');
      pageMiddle.classList.add('page-middle');
      pageContainer.appendChild(pageMiddle);

      let leftNav = document.createElement('div');
      leftNav.classList.add('left-nav','align-left');
      leftNav.innerHTML = '<img src="/img/arrowW.png" class="align-left"/>';
      pageMiddle.appendChild(leftNav);

      let pageContent = document.createElement('div');
      pageContent.classList.add('page-content','align-left');
      pageMiddle.appendChild(pageContent);

      let whatWeDo = document.createElement('div');
      whatWeDo.classList.add('text-block-med');
      whatWeDo.innerHTML =
        "<p>Curated Entertainment is a one-of-a-kind, boutique entertainment company in the San Francisco Bay Area, specializing in custom creating and performing never seen before, immersive and story-driven entertainment programs.<br>" +
        "<br>Co-founded in 2018 by Mind-Magician & Speaker, Heather Rogers and Vocalist & Composer, Velia Amarasingham, we exist to collaborate with event planners and designers to bring their events' themes to vivid life through deeply customized, entertainment programs featuring music, magic, interactive games, emcee programs, and much, much more.<br>" +
        "<br>We're the company to call when you're looking for something different.</p>";
      pageContent.appendChild(whatWeDo);

      let logo = document.createElement('div');
      logo.classList.add('curated-logo');
      logo.innerHTML = '<img src="/img/curated-logo-min.png"/>';
      pageContent.appendChild(logo);

      let rightNav = document.createElement('div');
      rightNav.classList.add('right-nav');
      rightNav.innerHTML = '<img src="/img/arrowE.png"/>';
      pageMiddle.appendChild(rightNav);

      let bottomNav = document.createElement('div');
      bottomNav.classList.add('nav');
      bottomNav.innerHTML = '<img src="/img/arrowSW.png" class="align-left"/><img src="/img/arrowS.png"/><img src="/img/arrowSE.png" class="align-right"/>';
      pageContainer.appendChild(bottomNav);

    }
  }
}
