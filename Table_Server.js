'use strict';
const http = require('http');
const fs = require('fs');

async function runServer() {
  const fileObj = await loadFiles();
  startServer(fileObj);
}
async function loadFiles() {
  const fileObj = {html: [{str: 'index.html'}], css: [{str: 'Layout.css'}],
    js: [{str: 'Util_Funcs.js'},{str: 'Seat.js'},{str: 'Menu_Bar.js'},{str: 'Table.js'},
      {str: 'Raker.js'},{str: 'Dealer.js'},{str: 'Render.js'},{str: 'Game.js'},{str: 'Main.js'}]};
  try {for (let tp of [fileObj.html, fileObj.css, fileObj.js]) {await loadFileType(tp);}}
  catch (err) {console.error(`${err}`);}
  return fileObj;
}
async function loadFileType(fileType) {
  let flPrms;
  for (let obj of fileType) {
    flPrms = await fs.promises.readFile(obj.str);
    obj.data = flPrms;
  }
}
function startServer({html, css, js}) {
  const port = 8080;
  const server = http.createServer((req, res) => {
    const {method, url, headers} = req;
    let body = [];
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      res.on('error', (err) => {console.error(err);});
      let urlFnd = false;
      if (url.endsWith('.js')) {urlFnd = findFile(res, url, js, 'text/javascript');}
      else if (!urlFnd && url.endsWith('.css')) {urlFnd = findFile(res, url, css, 'text/css');}
      else if (!urlFnd && url.endsWith('.html')) {urlFnd = findFile(res, url, html, 'text/html');}
      if (!urlFnd) {
        if (html[0].data) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html[0].data);
        } else {
          res.statusCode = 404;
          res.end();
        }
      }
    });
  }).listen(port);
}
function findFile(res, url, files, mmtp) {
  for (let fls = 0; fls < files.length; fls++) {if (url === '/' + files[fls].str) {
    if (files[fls].data) {
      res.writeHead(200, {'Content-Type': mmtp});
      res.end(files[fls].data);
    } else {
      res.statusCode = 404;
      res.end();
    }
    return true;
  }}
  return false;
}

runServer();
