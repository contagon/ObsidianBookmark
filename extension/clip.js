(function() {
    var date = new Date().toISOString().slice(0,19)
    var title = document.title
    var url = window.location.href
    var host = window.location.host
    var defaultNoteFormat =  
    `## [{title}]({url})
    Clipped from {host} on {date}.

{clip}`
    
        var noteFormat = defaultNoteFormat
        var sel = rangy.getSelection().toHtml();
        var turndownService = new TurndownService()
        var selection = turndownService.turndown(sel)

        // var imageReg = ;

        var matches = [...selection.matchAll(/\!\[.*\]\((.*)\)/g)]

        var imageLinks = [];

        for(i = 0; i < matches.length;i++){
            imageLinks.push(matches[i][1])  //only want the second group
        }
        console.log(imageLinks)



        noteFormat = noteFormat.replace('{clip}', selection)
        noteFormat = noteFormat.replace('{date}', date)
        noteFormat = noteFormat.replace('{url}', url)
        noteFormat = noteFormat.replace('{title}', title)
        noteFormat = noteFormat.replace('{host}', host)

        // console.log(noteFormat)

        let bookmark = {
            text:(noteFormat),
            name:(dateString()+title),
            imageLinks:imageLinks
        }
        console.log(bookmark)
        fetchResource('http://localhost:43110/new',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body:(JSON.stringify(bookmark))
        })

})();

// Workaround for fetching mixed content
// See here: https://stackoverflow.com/questions/55214828/how-to-stop-corb-from-blocking-requests-to-data-resources-that-respond-with-cors/55215898#55215898
function fetchResource(input, init) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({input, init}, messageResponse => {
        const [response, error] = messageResponse;
        if (response === null) {
          reject(error);
        } else {
          // Use undefined on a 204 - No Content
          const body = response.body ? new Blob([response.body]) : undefined;
          resolve(new Response(body, {
            status: response.status,
            statusText: response.statusText,
          }));
        }
      });
    });
  }

function dateString(){
    let rawDate = new Date()
    let filename = ""+rawDate.getFullYear().toString().substr(-2)
                    +"."+('0' + (rawDate.getMonth()+1)).slice(-2)
                    +"."+('0' + rawDate.getDate()).slice(-2)
                    +"."+('0' + rawDate.getHours())+" - "
    return(filename)
}