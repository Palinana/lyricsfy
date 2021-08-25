// vanila react version ----->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// import React, { Component } from 'react';
// import './App.css';

// import SpotifyWebApi from 'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();

// const CurrentlyPlaying = ({token}) => {
// class App extends Component {
//   constructor(){
//     super();
//     const params = this.getHashParams();
//     const token = params.access_token;

//     if (token) {
//       spotifyApi.setAccessToken(token);
//     }
//     this.state = {
//       loggedIn: token ? true : false,
//       nowPlaying: { name: 'Not Checked', albumArt: '' }
//     }
//   }
//   getHashParams() {
//     var hashParams = {};
//     var e, r = /([^&;=]+)=?([^&;]*)/g,
//         q = window.location.hash.substring(1).slice(1);
//     e = r.exec(q)
//     while (e) {
//        hashParams[e[1]] = decodeURIComponent(e[2]);
//        e = r.exec(q);
//     }
//     return hashParams;
//   }

//   getNowPlaying(){
//     spotifyApi.getMyCurrentPlaybackState()
//       .then((response) => {
//         this.setState({
//           nowPlaying: { 
//               name: response.item.name, 
//               albumArt: response.item.album.images[0].url
//             }
//         });
//       })
//   }

//   render() {
//     return (
//       <div className="App">
//         <a href='http://localhost:8888/login' > Login to Spotify </a>
//         <div>
//           Now Playing: { this.state.nowPlaying.name }
//         </div>
//         <div>
//           <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
//         </div>
//         { this.state.loggedIn &&
//           <button onClick={() => this.getNowPlaying()}>
//             Check Now Playing
//           </button>
//         }
//       </div>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom'

import './App.css';
import { removeCharsFromSongTitle } from './lib/utility';
import { getSongPath, getLyrics } from './lib/genius';

import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// parser option
const options = {
    decodeEntities: true,
    transform
};
  
/**
 * Transform <a> into <div>
 * @param  {number} index The index of the current node
 * @param  {obejct} node A DOM node
 * @return {function} The function that takes params and
 * current funstion to transform all a tags to divs
 */
function transform(node, index) {
    /* A node can be modified and passed to the convertNodeToElement 
      function which will continue to render it and it's children
    */
  
    if (node.name === "a") {
      node.name = "span";
      return convertNodeToElement(node, index, transform);
    }
}

const GENIUS_URL = 'https://api.genius.com'

export class CurrentlyPlaying extends Component {
// const CurrentlyPlaying = ({token}) => {
    constructor(props){
        super(props);
        const token = this.props.token;
    
        if (token) {
          spotifyApi.setAccessToken(token);
        }
        this.state = {
          loggedIn: token ? true : false,
          nowPlaying: {
            song: 'Not Checked', 
            album: '', 
            hasError: false 
            }
        }
    }
    // state = {
    //     // loggedIn: token ? true : false,
    //     nowPlaying: {
    //         name: 'Not Checked', 
    //         album: '', 
    //         hasError: false 
    //     }
    // }

    
    // let  loggedIn = token ? true : false;
    // const nowPlaying = { name: 'Not Checked', album: '', hasError: false }
  
    // getNowPlaying = async () => {
    //     spotifyApi.getMyCurrentPlaybackState()
    //     .then((response) => {
    //         if (response.item) {
    //             console.log('response ', response)

    //             const title = this.state.nowPlaying.song.replace(/\s+/g, "%20").toLowerCase();

    //             const query = `${GENIUS_URL}/search/?q=${this.state.nowPlaying.artist}%20${title}&client_id=${
    //                 process.env.REACT_APP_GENIUS_API_CLIENT_KEY
    //             }&client_secret=${
    //                 process.env.REACT_APP_GENIUS_API_CLIENT_SECRET
    //             }&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`;
                
    //             // console.log('genius query: ', query)
    //             const response = await fetch(query)
    //             const data = await response.json();
    //             const resultPath = data.response.hits[0].result.url; 

    //             const res = await fetch(`https://cors.bridged.cc/${songPath}`);
    //             console.log('response from path: ', res)
    //             const responseHTML = await res.text();
    //             console.log('responseHTML from path: ', responseHTML)

    //             var parser = new DOMParser();
    //             var doc = parser.parseFromString(responseHTML, 'text/html');
                
    //             var tds = doc.querySelector("div#lyrics-root.SongPageGriddesktop__OneColumn-sc-1px5b71-0.fthhzM.Lyrics__Root-sc-1ynbvzw-1.eCrMrb");

    //             var text = tds.querySelector("div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW")
   
    //             console.log('tds: ', tds)
    //             console.log('text: ', text.innerHTML)

    //             this.setState({ nowPlaying: { 
    //                 ...this.state.nowPlaying, 
    //                 artist: response.item.artists[0].name,
    //                 song: removeCharsFromSongTitle(response.item.name),
    //                 album: response.item.album.images[0].url,
    //                 id: response.item.id,
    //                 lyrics: text.innerHTML
    //                 // lyrics: getLyrics(this.state.nowPlaying.artist, this.state.nowPlaying.song)
    //              }
    //             });

    //             // const lyrics = getLyrics(this.state.nowPlaying.artist, this.state.nowPlaying.song);
    //             // console.log('awaiing lurics ', lyrics)

    //             // this.setState({ nowPlaying: { 
    //             //     ...this.state.nowPlaying, 
    //             //     lyrics
    //             //  }
    //             // });

    //         } else {
    //             this.setState({ 
    //                 ...this.state.nowPlaying, 
    //                 hasError: true
    //             }) 
    //         }
    //     })
    //     .catch(err => {
    //         console.log("ERROR: " + err);
    //         this.setState({ 
    //             ...this.state.nowPlaying, 
    //             hasError: true
    //         }) 
    //         // console.log('nowPlaying.hasError ', nowPlaying.hasError)

    //     });

    // }
    
    getNowPlaying = async () => {
        const response = await spotifyApi.getMyCurrentPlaybackState()
     
        console.log('response ', response)
        if (response.item) {
            this.setState({ nowPlaying: { 
                ...this.state.nowPlaying, 
                artist: response.item.artists[0].name,
                song: removeCharsFromSongTitle(response.item.name),
                album: response.item.album.images[0].url,
                id: response.item.id,
            }});

            const text = await getLyrics(this.state.nowPlaying.artist, this.state.nowPlaying.song);

            // const title = this.state.nowPlaying.song.replace(/\s+/g, "%20").toLowerCase();

            // const query = `${GENIUS_URL}/search/?q=${this.state.nowPlaying.artist}%20${title}&client_id=${
            //     process.env.REACT_APP_GENIUS_API_CLIENT_KEY
            // }&client_secret=${
            //     process.env.REACT_APP_GENIUS_API_CLIENT_SECRET
            // }&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`;
            
            // // console.log('genius query: ', query)
            // const queryResponse = await fetch(query)
            // const data = await queryResponse.json();
            // const resultPath = data.response.hits[0].result.url; 
            // console.log('data  : ', data)
            // console.log('resultPath  : ', resultPath)


            // const res = await fetch(`https://cors.bridged.cc/${resultPath}`);
            // console.log('response from path: ', res)
            // const responseHTML = await res.text();
            // console.log('responseHTML from path: ', responseHTML)

            // var parser = new DOMParser();
            // var doc = parser.parseFromString(responseHTML, 'text/html');
            
            // var tds = doc.querySelector("div#lyrics-root.SongPageGriddesktop__OneColumn-sc-1px5b71-0.fthhzM.Lyrics__Root-sc-1ynbvzw-1.eCrMrb");

            // var text = tds.querySelector("div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW")

            // console.log('tds: ', tds)
            // console.log('text: ', text.innerHTML)    
            
            this.setState({ nowPlaying: { 
                ...this.state.nowPlaying, 
                    lyrics: text
                }
            });
        }
    }

    render() {
        console.log('state LYRRYUCS', this.state)
        return (
        <div className="App">
            {/* <a href='http://localhost:8888/login' > Login to Spotify </a> */}
            <div>

                { this.state.nowPlaying.hasError ? (
                    // You can render any custom fallback UI
                    <h1>Something went wrong.</h1>
                ) : (
                <div>
                    {/* <div>
                        <b>Now Playing:</b> { this.state.nowPlaying.song }
                    </div>
                    <div>
                        <img src={this.state.nowPlaying.album} style={{ height: 150 }}/>
                    </div> */}

                    {!this.state.nowPlaying.artist ? (
                        <div>
                            <h1>Play any song in Spotify</h1>
                        </div>
                        ) : (
                        <div>
                            <div>
                            <b>Now Playing:</b> 

                        <div>
                            <img
                            ref={node => {
                                this.imgRef = node;
                            }}
                            crossOrigin="anonymous"
                            src={this.state.nowPlaying.album}
                            style={{ height: 250 }}
                            />
                        </div>

                        <div>
                            <h2>
                                {this.state.nowPlaying.artist}
                            </h2>
                            <h4 >
                                {this.state.nowPlaying.song}
                            </h4>
                        </div>

                        <div>
                            <div>-----</div>
                            {ReactHtmlParser(this.state.nowPlaying.lyrics, options)}
                        </div>
                        </div>


                        </div>
                    )}
                    

                    {/* {this.state.nowPlaying.artist && (
                        <div>
                            <b>Now Playing:</b> 

                        <div>
                            <img
                            ref={node => {
                                this.imgRef = node;
                            }}
                            crossOrigin="anonymous"
                            src={this.state.nowPlaying.album}
                            style={{ height: 250 }}
                            />
                        </div>

                        <div>
                            <h2>
                                {this.state.nowPlaying.artist}
                            </h2>
                            <h4 >
                                {this.state.nowPlaying.song}
                            </h4>
                        </div>
                        </div>
                    )} */}
                </div>
                )}
            </div> 
                
            { this.state.loggedIn &&
                <div>
                { this.state.nowPlaying.hasError ? (
                    // You can render any custom fallback UI
                    <a href='http://localhost:8888/login' > Login to Spotify </a>
                ) : (
                    <button onClick={() => this.getNowPlaying()}>
                        Check Now Playing
                    </button>
                )}
            </div>                
            }
        </div>
        );
    }
}

// export default CurrentlyPlaying;
export default withRouter(CurrentlyPlaying)


// hooks version ----->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// change how it's updates state


// import React, { useState, useEffect } from 'react'

// import SpotifyWebApi from 'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();

// const initialState = {
//     name: "Not Checked",
//     album: "",
//     refreshToken: ""
// };

// const CurrentlyPlaying = ({token}) => {
//     const [nowPlaying, setNowPlaying] = useState(initialState);
//     const [loggedIn, setLoggedIn] = useState(token ? true : false);

//     useEffect(() => {
//         const params = getHashParams();
//         const token = params.access_token;

//         if (token) {
//             console.log('ttok', token)
//             spotifyApi.setAccessToken(token);
//             setLoggedIn(!loggedIn)
//         }
//     },[]);

//     const  getHashParams = () => {
//         var hashParams = {};
//         var e, r = /([^&;=]+)=?([^&;]*)/g,
//             q = window.location.hash.substring(1).slice(1);
//         e = r.exec(q)
//         while (e) {
//         hashParams[e[1]] = decodeURIComponent(e[2]);
//         e = r.exec(q);
//         }
//         return hashParams;
//     }
    

//     const getNowPlaying = () => {
//         spotifyApi.getMyCurrentPlaybackState()
//             .then((response) => {
//                 setNowPlaying({
//                     name: response.item.name,
//                     album: response.item.album.images[0].url
//                 });
//             })
//     }
    
//     return (
//         <div className="App">
//             <a href='http://localhost:8888/login' > Login to Spotify </a>
//             <div>
//                 Now Playing: { nowPlaying.name }
//             </div>
//             <div>
//                 <img src={nowPlaying.album} style={{ height: 150 }}/>
//             </div>
//             { loggedIn &&
//             <button onClick={() => getNowPlaying()}>
//                 Check Now Playing
//             </button>
//             }
//         </div>
//     );
// }

// export default CurrentlyPlaying;