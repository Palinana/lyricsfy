const GENIUS_URL = 'https://api.genius.com'

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

    const songPath = getSongPath(data);
    const songLyrics = getLyricsFromPath(songPath)

    return songLyrics



//     const res = await fetch(`https://cors.bridged.cc/${songPath}`);
//     console.log('response from path: ', res)


//     const responseHTML = await res.text();
//     console.log('responseHTML from path: ', responseHTML)


// //Convert the HTML string into a document object
// 	var parser = new DOMParser();
//     var doc = parser.parseFromString(responseHTML, 'text/html');
    
//     // var tds = doc.getElementsByTagName("div");
//     //   var tds = doc.getElementsByClassName("SongPageGriddesktop__OneColumn-sc-1px5b71-0");

//     var tds = doc.querySelector("div#lyrics-root.SongPageGriddesktop__OneColumn-sc-1px5b71-0.fthhzM.Lyrics__Root-sc-1ynbvzw-1.eCrMrb");

//     var text = tds.querySelector("div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW")
   
   
//     console.log('tds: ', tds)
//     console.log('text: ', text.innerHTML)

    
    
//     return text.innerHTML
}

const getSongPath = (data) => {
    try {
      const resultPath = data.response.hits[0].result.url; 
      return resultPath
    } catch (exception) {
      throw new Error('Lyrics not found :(')
    }
}

export const getLyricsFromPath = async (url) => {
    const response = await fetch(`https://cors.bridged.cc/${url}`);
    const responseHTML = await response.text();

    //Convert the HTML string into a document object
	var parser = new DOMParser();
    var doc = parser.parseFromString(responseHTML, 'text/html');

    var tds = doc.querySelector("div#lyrics-root.SongPageGriddesktop__OneColumn-sc-1px5b71-0.fthhzM.Lyrics__Root-sc-1ynbvzw-1.eCrMrb");
    var text = tds.querySelector("div.Lyrics__Container-sc-1ynbvzw-8.eOLwDW")
   
    // console.log('tds: ', tds)
    // console.log('text: ', text.innerHTML)
 //   if (!title || !artist || !lyrics) {
 //     throw new Error('Error while parsing lyrics. Please, try again.')
 //   }
    return text.innerHTML
    
}
