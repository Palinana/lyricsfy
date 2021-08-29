import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom'
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";

import { removeCharsFromSongTitle } from '../lib/utility';
import { getSongPath, getLyrics } from '../lib/genius';
import SongLyrics from '../SongLyrics/SongLyrics';
import './CurrentlyPlaying.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const GENIUS_URL = 'https://api.genius.com'

export class CurrentlyPlaying extends Component {
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

    getNowPlaying = async () => {
        const response = await spotifyApi.getMyCurrentPlaybackState()
     
        console.log('response ', response)
        if (response.item) {
            // this.setState({ nowPlaying: { 
            //     ...this.state.nowPlaying, 
            //     artist: response.item.artists[0].name,
            //     song: removeCharsFromSongTitle(response.item.name),
            //     album: response.item.album.images[0].url,
            //     id: response.item.id,
            // }});

            let artist = response.item.artists[0].name;
            let song = removeCharsFromSongTitle(response.item.name)
            const text = await getLyrics(artist, song); 
            
            this.setState({ nowPlaying: { 
                ...this.state.nowPlaying, 
                artist,
                song,
                album: response.item.album.images[0].url,
                id: response.item.id,
                lyrics: text
                }
            });
        }
    }

    render() {
        return (
        <div className="App">
            <div>

                { this.state.nowPlaying.hasError ? (
                    <h1>Something went wrong.</h1>
                ) : (
                <div>
                    { this.state.loggedIn &&
                        <div>
                        { this.state.nowPlaying.hasError ? (
                            <a href='http://localhost:8888/login' > Login to Spotify </a>
                        ) : (
                            <button onClick={() => this.getNowPlaying()}>
                                Check Now Playing
                            </button>
                        )}
                        </div>                
                    }

                    { !this.state.nowPlaying.artist ? (
                        <div>
                            <h1>Play any song in Spotify</h1>
                        </div>
                        ) : (
                        <SongLyrics currentSong={this.state.nowPlaying}/>
                    )}
                </div>
                )}
            </div> 
        </div>
        );
    }
}

export default withRouter(CurrentlyPlaying)
