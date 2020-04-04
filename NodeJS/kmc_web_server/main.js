var http = require('http'); // http protocol
var fs = require('fs'); // filesystem
var url = require('url'); // use module 'url'

function makeHTML(title, data, list){
  var my_list = list;

  if(list === undefined)
    my_list = '';

  var content_html = `
  <!doctype html>
  <html>
  <head>
    <title>Home of NODE JS</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">Home of NODE JS</a></h1>
    <ol>
      ${my_list}
    </ol>
    <h2>${title}</h2>
    <p>${data}</p>
  </body>
  </html>
  `

  return content_html;
}

function makeList_ul(list, list_len){
  // make page list!
  var list_ul = '<ul>';

  var i = 0;
  while(i < list_len)
  {
    list_ul = list_ul + `<li><a href="/?id=${list[i]}">${list[i]}</a></li>`;
    i = i+1;
  }

  list_ul = list_ul + '</ul>'; // end of make page list

  return list_ul;
}

var app = http.createServer(function(request,response){

    var req_url = request.url; // request.url = '/?id=HTML' after port number in URL

    // skip favicon request
    if(req_url == '/favicon.ico'){
      return response.writeHead(404);
    }

    // Get Query.
    var queryData = url.parse(req_url, true).query; // extract query , url = "localhost:3000/?id=HTML"
    var query_id = queryData.id;

    if(queryData.id === undefined){
      if(req_url == '/') {// home
        req_url = '/?id=home';
        query_id = 'home';
      }
      else{ // nothing.
        var undefined_page = makeHTML('Fail to Found', 'Please check your URL');
        response.writeHead(404); // ERROR MESSAGE HEADER
        response.end(undefined_page);
        return response;
      }
    }

    // Make Response Message.
    fs.readdir('./data', function(err, dir_list){
      var result_list = makeList_ul(dir_list, dir_list.length);

      fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, file_data){
        var result_html = makeHTML(query_id, file_data, result_list);

        response.writeHead(200); // ERROR MESSAGE HEADER
        response.end(result_html);
      });
    }); // end of Making Response Message.

}); // end of Server

app.listen(3000); // port number 3000.
