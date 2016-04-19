'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const url            = require('url');

app.use('/client', express.static(path.join(__dirname, '/client')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function parseUrlQueryBy(req){
  return url.parse(req.url, true).query;
};

app.get('/trends', function(req, res){
  let query = parseUrlQueryBy(req).query;
  //console.log(query);
  res.send('<html><head></head><body style="width: 800px; height: 330px; margin: 0;"><script type="text/javascript" src="//www.google.de/trends/embed.js?hl=de&q='+query+'&tz=Etc/GMT-2&content=1&cid=TIMESERIES_GRAPH_0&export=5&w=800&h=330"></script></body></html>');
});

const server = require('http').Server(app);

server.listen(3000, function(){
  console.log('listening on *:3000');
});
