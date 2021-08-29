const GENIUS_URL = 'https://api.genius.com';

export const getLyrics = async (artist, song) => {
    // replacing title spaces with %20
    const title = song.replace(/\s+/g, "%20").toLowerCase();

    const query = `${GENIUS_URL}/search/?q=${artist}%20${title}&client_id=${
        process.env.REACT_APP_GENIUS_API_CLIENT_KEY
    }&client_secret=${
        process.env.REACT_APP_GENIUS_API_CLIENT_SECRET
    }&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`;
    
    // console.log('genius query: ', query)
    const response = await fetch(query)
    const data = await response.json();

    console.log('genius data: ', data)

    const songPath = getSongPath(data, song);
    console.log('songPath data: ', songPath)
    if(songPath) {
        const songLyrics = getLyricsFromPath(songPath)
        console.log('songPath data: 1')
        return songLyrics
    }
    console.log('songPath data: 2')
    return 'Lyrics not found '

}

const getSongPath = (data,title) => {
    if(data.response.hits[0]) {
        console.log('data.response.hits[0].result.title ', data.response.hits[0].result.title)
        console.log('title ', title)

        console.log('its[0].result.title ', data.response.hits[0].result.title === title)
        // checking case for two strings
        let geniusTitle = data.response.hits[0].result.title.toLowerCase().replace(/[&\/\\#,+$~%.’'":*?<>{}]/g, '');
        let currentTitle = title.toLowerCase().replace(/[&\/\\#,+$~%.’'":*?<>{}]/g, '');

        if (geniusTitle.indexOf("(") !== -1) {
            geniusTitle = geniusTitle.slice(0, geniusTitle.indexOf("(") - 1);
        }

        if (currentTitle.indexOf("(") !== -1) {
            currentTitle = currentTitle.slice(0, currentTitle.indexOf("(") - 1);
        }

        if(geniusTitle === currentTitle) {
            const resultPath = data.response.hits[0].result.url; 
            return resultPath
        }
    }

    return null;
      
}

export const getLyricsFromPath = async (url) => {
    
    const response = await fetch(`https://cors.bridged.cc/${url}`);
    const responseHTML = await response.text();
    console.log('got here url: ', url)
    console.log('got here response: ', response)
    //Convert the HTML string into a document object
	const parser = new DOMParser();
    const doc = parser.parseFromString(responseHTML, 'text/html');

    const tds = doc.querySelector("div#lyrics-root.SongPageGriddesktop__OneColumn-sc-1px5b71-0.fthhzM.Lyrics__Root-sc-1ynbvzw-1.eCrMrb");
    // var text = tds.querySelector("div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW")
    console.log('got here: tds', tds)
    let lyricsResult = 'No lyrics found';
    
    try {
        lyricsResult = tds.querySelectorAll('div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW');

        if(!lyricsResult) {
            // var text = tds.querySelector("div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW")
            return lyricsResult.innerHTML
        }
        lyricsResult = Array.from(lyricsResult).reduce(function (acc, val) {
            return acc + val.innerHTML;
        }, '');
        return lyricsResult

    } catch (exception) {
        return lyricsResult;
    }
}
