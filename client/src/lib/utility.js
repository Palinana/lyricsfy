// change the title of the song to request the correct lyrics
export const removeCharsFromSongTitle = ( name ) => {
    let songTitle = name;
    // make different requests if sees - in the name; had to remove it
    if (songTitle.indexOf("-") !== -1) {
        // cutting string
        songTitle = songTitle.substring(0, songTitle.indexOf("-") - 1);
    }

    if (songTitle.indexOf("(") !== -1 || songTitle.indexOf("/") !== -1) {
        // cutting string
        if (songTitle.indexOf("/") !== -1) {
        let ind = songTitle.indexOf("/"); //saving index
        if (songTitle[ind - 1] === " ") {
            songTitle = songTitle.slice(0, songTitle.indexOf("/") - 1); //cutting if there is a space
        } else {
            songTitle = songTitle.slice(0, songTitle.indexOf("/") + 1); //cutting without a space
        }
        }

        if (songTitle.indexOf("(") !== -1) {
        if (songTitle[0] !== "(") {
            //if first element is not '('
            let ind = songTitle.indexOf("("); //saving index
            if (songTitle[ind - 1] === " ") {
            songTitle = songTitle.slice(0, songTitle.indexOf("(") - 1); //cutting if there is a space
            } else {
            songTitle = songTitle.slice(0, songTitle.indexOf("(") + 1); //cutting without a space
            }
        }
        }
    }

    // if first element is '(' or any other
    songTitle = songTitle.replace(/[\/\\#+$✝~%*<>{}().]/g, "");

    return songTitle;
}