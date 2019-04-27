import React, { Component } from 'react';

function HomePage(props) {
  return (<div>
      <div id="what-we-do" className="text-block-med">
        <p>Curated Entertainment is a one-of-a-kind, boutique entertainment company in the San Francisco Bay Area, specializing in custom creating and performing never seen before, immersive and story-driven entertainment programs.<br/>
          <br/>Co-founded in 2018 by Mind-Magician & Speaker, Heather Rogers and Vocalist & Composer, Velia Amarasingham, we exist to collaborate with event planners and designers to bring their events' themes to vivid life through deeply customized, entertainment programs featuring music, magic, interactive games, emcee programs, and much, much more.<br/>
          <br/>We're the company to call when you're looking for something different.
        </p>
      </div>
      <div id="logo" className="curated-logo">
        <img src="/img/curated-logo-min.png" alt="Curated Entertainment logo"/>
      </div>
    </div>);
}

function VideosPage(props) {
  return(<div>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/bHtxSvckIN4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>);
}

class App extends Component {

  componentDidMount() {
    console.log('****componentDidMount****');
  }

  render() {
    console.log('****rendering****');
    return (
      <div>
        <div id="page-content-1-0">
          <VideosPage />
        </div>
        <div id="page-content-1-1">
          <HomePage />
        </div>
      </div>
    );
  }
}

export default App;
