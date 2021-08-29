// import './App.css';

// import React from 'react'

// import { SpotifyAuth, Scopes } from 'react-spotify-auth'
// import 'react-spotify-auth/dist/index.css'


// import CurrentlyPlaying from './CurrentlyPlaying';

// const App = () => {
//   return (
//     <div className='app'>
//     <div>
//           <p>You are authorized with token: </p>

//           <CurrentlyPlaying  />
//         </div>
//       {/* {token ? (
//         // <SpotifyApiContext.Provider value={token}>

//         <div>
//           <p>You are authorized with token: </p>

//           <CurrentlyPlaying token={token} />
//         </div>
          
          
//         // </SpotifyApiContext.Provider>
//       ) : (
//         // Display the login page
//         null
//         // <a href='http://localhost:8888/login' > Login to Spotify </a>
//         // <SpotifyAuth
//         //   redirectUri='http://localhost:3000/callback'
//         //   clientID='2eae305031b9493cb53dca19e6c676ce'
//         //   scopes={[Scopes.userReadPrivate, 'user-read-private user-read-email user-read-playback-state']} // either style will work
//         // />
//       )} */}
//     </div>
//   )
// }
// export default App

import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import './App.css';
import Auth from './Auth';

import CurrentlyPlaying from './CurrentlyPlaying/CurrentlyPlaying';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    console.log('window.location', window.location)

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      token: token
    }
  }

  getHashParams() {
    const hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.pathname.substring(1);
        console.log('window q ', q)
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }


  render() {
    console.log('token', this.state.token)

    // to remove token that was saved before the render
    window.history.replaceState(null, null, 'http://localhost:3000');

    let routes;
    // if (this.props.isAuthenticated) <--- change to that in the future
    if (this.state.token) {
       routes = (
          <Switch>
              <Route exact path='/auth' component={Auth} />
          </Switch>
      );
    }

    return (
        <div className='app'>
            {this.state.loggedIn ? (
                <div>
                  <CurrentlyPlaying  token={this.state.token}/>
                  {routes}
                </div>
            ) : (
                <div>
                  <a href='http://localhost:8888/login' > Login to Spotify </a>
                </div>
            )}
        </div>
    )
  }
}

export default withRouter(App)
