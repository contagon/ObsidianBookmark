This is a fork to run the server headless in a docker container. I currently sync all my obsidian notes to a server using Syncthing, and run this on the server as well. This way I can use this on any device with chrome installed, and only have to have the server running once.

# **![logo](extension/icons/favicon-48x48.png) Obsidian Bookmark**

![Screencap](docs/sceencap1.gif)

# A Chrome extension and nodejs server to allow web clipping to Obsidian.

The extension copies highlight areas of a web page to markdown, and sends it to a local node server. This then saves it as a markdown file in a folder, like an Obsidian vault, the user has chosen.


Until Obsidian supports adding new notes through their custom `Obsidian://` URL protocol, this might be the best way. 

Inspired by jplattel's [Obsidian clipper](https://github.com/jplattel/obsidian-clipper) - a much less janky solution. 

## Features

- Automatically create a markdown note from a webpage.
- Notes use a Zettelkasten identifier prefix, and the title of the webpage.
- Downloads highlighted images to a custom attatchement folder, and updates links in the note.


## Installation:
---
Clone the repo.

Chrome extension:
Change "http://localhost:43110/" in `extension/clip.js` and `extension/background.js` to wherever your server will be hosted at. Open chrome://extensions and turn on Developer mode in the top right. Select load unpacked and choose the extension folder.

Server:
There's a folder for notes and attachments that need to be mapped to. Navigate into the repo, then an example docker command would be:
```bash
docker build . -t obsidian-bookmark
docker run -p 43110:43100 -v vault/webclips:/notes -v vault/attachments:/attachments obsidian-bookmark
```
 

## Usage
---
With the node server running, clicking the extension icon will save the current page as a markdown bookmark. 

Any selected text or images will be included in the note.




