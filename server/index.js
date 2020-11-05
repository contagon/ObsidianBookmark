//express middleware
const bodyParser = require('body-parser');
const cors = require("cors")

const express = require('express')
const serve = express()

const fs = require('fs')
const request = require('request');
const path = require('path')
const open = require("open")



var settings = require('./settings.json')

const port = settings.port || 43110;

//----------------------------------------- EXPRESS -----------------
serve.use(cors())
serve.use(bodyParser.json());


serve.post('/new',(req,res)=>{

    let bm = req.body;

    downloadImages(bm).then(newNote=>{ //download images and replace links with local filepaths
        saveToVault(newNote.text, newNote.name)
        res.send('...') //todo send useful response
    })
})

//ping route
serve.get('/', (req,res)=>{   

    res.send({alive:true})
})

//----------------------------------------- OTHER -----------------

function saveToVault(data, filename){
    return new Promise((resolve,reject)=>{
        filename = filename.replace(/[/\\?%*:|"<>]/g, '-'); //regex illegal chars

        let saveLocation = settings.save_location || settings.vault_location 
        saveLocation += "/"+(filename)+".md";
    
        fs.writeFile(saveLocation, data, function(err){
            if(err){
                reject(err)
            }else{
                console.log("Bookmark saved.")
                console.log(saveLocation)
                resolve(saveLocation)
            }
        })
    })

}

async function downloadImages(bm){
    return new Promise(async (resolve,reject)=>{
        if(settings.download_images){
            for(i = 0; i < bm.imageLinks.length;i++){
                let filePath = settings.attatchment_location+"\/"+path.basename(bm.imageLinks[i])
                await download(bm.imageLinks[i],filePath ).then(()=>{
                    console.log("Downloaded to "+filePath)
                    // bm.text = bm.text.replace(bm.imageLinks[i], path.relative(settings.save_location,filePath))
                    bm.text = bm.text.replace(bm.imageLinks[i], path.basename(filePath))

                }).catch(err=>{
                    console.log("Couldn't download "+path.basename(bm.imageLinks[i]))
                })
            }
        }
        resolve(bm)
    })

}




var download = function(uri, filename){
    
    return new Promise((resolve,reject)=>{
        // resolve(":)")
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            if(err) reject(err);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){resolve()});
          });
    })

    
  };
  

function startServer(){
    serve.listen(port, () => {

        console.log(`Obsidian bookmark server running on localhost:${port}`)
    })
}

startServer();

