import React from 'react';
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";

import './SongLyrics.css';

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
  
const SongLyrics = ({ currentSong }) => {
    return (
       <div className="song-lyrics__container">
            <div className="song-lyrics__left-panel">
                <div className="song-lyrics__image">
                    <img
                        crossOrigin="anonymous"
                        src={currentSong.album}
                    />
                </div>
            </div>

            <div className="song-lyrics__right-panel">
                <div className="song-lyrics__info">
                    <h2 className="song-lyrics__info-artist heading-secondary color-primary">
                        {currentSong.artist}
                    </h2>
                    <h3 className="song-lyrics__info-song">
                        {currentSong.song}
                    </h3>
                </div>

                <div className="song-lyrics__info-lyrics heading-tertiary color-secondary">
                    {ReactHtmlParser(currentSong.lyrics, options)}
                </div>
            </div>
        </div>
    );
};

export default SongLyrics;
