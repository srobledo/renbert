//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

router.use(bodyParser.json());       // to support JSON-encoded bodies

router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/mail', function(req, res) {
    return res.status(200).json({data:req.body, sendstatus:1});
});

server.listen(process.env.PORT, process.env.IP, function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
