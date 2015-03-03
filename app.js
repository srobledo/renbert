var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    express = require('express'),
    router = express(),
    server = http.createServer(router),
    port = process.env.PORT || 9000,
    nodemailer = require('nodemailer'),
    root = path.normalize(__dirname),
    DNS = process.argv.slice(2)[0],
    serverUrl;

if(DNS == 1){
    serverUrl = 'https://renbert-srobledo.c9.io';
}
else{
    serverUrl = 'http://localhost:9000';
}
console.log(serverUrl);
var transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: 'sergiorobledo2k5@outlook.com',
        pass: 'spiderman12391+'
    }
});

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

router.use(express.static(path.resolve(__dirname, 'client')));

router.use(bodyParser.json({limit: '50mb'}));

router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

router.post('/mail', function(req, res) {
    var mailOptions = {
        from: req.body.c_email,
        to: 'sergiorobledo2k5@gmail.com',
        subject: req.body.c_name + ' | renbert.com',
        html: '<b>'+req.body.c_message+'</b>'
        },
        message = 'Tu mensaje fue enviado con exito';
    if(req.body && req.body.c_image == 'false'){
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                return res.status(200).json({sendstatus:0, message:error})
            }else{
                return res.status(200).json({sendstatus:1, message:message});
            }
        });
    }
    else{
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)),
            uniqid = randLetter + Date.now(),
            imageBuffer = decodeBase64Image(req.body.c_image),
            imageroot = root+'/client/assets/email/'+uniqid+'.jpg',
            emailImage = '/assets/email/'+uniqid+'.jpg';
        fs.writeFile(imageroot, imageBuffer.data, function(err) {
            if(err){return res.status(200).json({sendstatus:0, message:'Error en el servidor'});}
            mailOptions.html = '<b>'+req.body.c_message+'</b> <br> <a href="'+ serverUrl + emailImage +'" target="_blank">Click aqui para ver la imagen</a>';
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    return res.status(200).json({sendstatus:0, message:error})
                }else{
                    return res.status(200).json({sendstatus:1, message:message});
                }
            });
        });
    }
});

server.listen(port, process.env.IP, function(){
  var addr = server.address();
  console.log("server listening at:" + addr.port);
});
