var http = require('http');
var fs = require('fs');
var url = require('url'); // use module 'url'

// create Server!!
var app = http.createServer(function(request,response){

    var req_url = request.url; // request.url = '/?id=HTML' after port number in URL

    var queryData = url.parse(req_url, true).query; // extract query , url = "localhost:3000/?id=HTML"
    var temp_id = queryData.id;

    if(req_url == '/'){
      req_url = '/index.html';
      temp_id = 'Welcome';
    }
    if(req_url == '/favicon.ico'){
      return response.writeHead(404); // ERROR MESSAGE HEADER
    }

    console.log(req_url);
    console.log(temp_id); // queryData.id = "HTML"

    var my_template = `
    <!doctype html>
    <html>
    <head>
      <title>NODE JS</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">NODE JS</a></h1>
      <ol>
        <li><a href="1.html">HTML</a></li>
        <li><a href="2.html">CSS</a></li>
        <li><a href="3.html">JavaScript</a></li>
      </ol>
      <h2>${temp_id}</h2>
      <p>This is ${temp_id}</p>
    </body>
    </html>
    `

    response.writeHead(200); // Success Message HEADER

    // text content of response Message.
    response.end(my_template);
    //response.end(fs.readFileSync(__dirname + req_url));

});

app.listen(3000); // port number 3000.
