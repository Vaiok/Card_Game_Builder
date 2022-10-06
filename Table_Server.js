'use strict';
const http = require('http');
const fs = require('fs');

let htmlFile, cssFile, jsFiles = [];
let jsFileNames = ['Main.js', 'Player.js', 'Table.js', 'Draw_Util.js'];
fs.readFile('index.html', (err, data) => {
  if (err) {console.error('index.html is not in that directory.');}
  else {htmlFile = data;}
});
fs.readFile('Layout.css', (err, data) => {
  if (err) {console.error('Layout.css is not in that directory.');}
  else {cssFile = data;}
});
for (let jsfn of jsFileNames) {
  fs.readFile(jsfn, (err, data) => {
    if (err) {console.error(`${jsfn} is not in that directory.`);}
    else {jsFiles.push(data);}
  });
}

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

    let urlFound = false;
    if (url.endsWith('.js')) {for (let jsf = 0; jsf < jsFileNames.length; jsf++) {
      if (url === '/' + jsFileNames[jsf]) {
        if (jsFiles[jsf]) {
          res.writeHead(200, {'Content-Type': 'text/javascript'});
          res.end(jsFiles[jsf]);
        } else {
          res.statusCode = 404;
          res.end();
        }
        urlFound = true;
        break;
      }
    }}
    else if (url.endsWith('.css')) {
      if (url === '/Layout.css') {
        if (cssFile) {
          res.writeHead(200, {'Content-Type': 'text/css'});
          res.end(cssFile);
        } else {
          res.statusCode = 404;
          res.end();
        }
        urlFound = true;
      }
    }
    if (!urlFound) {
      if (htmlFile) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(htmlFile);
      } else {
        res.statusCode = 404;
        res.end();
      }
    }
  });
}).listen(port);
