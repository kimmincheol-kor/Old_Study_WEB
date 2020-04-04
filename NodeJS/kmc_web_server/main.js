var http = require('http'); // http protocol
var fs = require('fs'); // filesystem
var url = require('url'); // use module 'url'
var qs = require('querystring');

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
    <a href="/create">CREATE</a>
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
    var queryPathname = url.parse(req_url, true).pathname;
    var query_id = queryData.id;

    if(queryPathname === '/') { // home
      if(queryData.id === undefined) {
        req_url = '/?id=home';
        query_id = 'home';
      }

      // Make Response Message.
      var dir_list = fs.readdirSync('./data', 'utf8');
      var result_list = makeList_ul(dir_list, dir_list.length);

      var file_data = fs.readFileSync(`./data/${query_id}`, 'utf8');
      var result_html = makeHTML(query_id, file_data, result_list);

      response.writeHead(200); // ERROR MESSAGE HEADER
      response.end(result_html);

      return response;
    } // end of if home
    else if(queryPathname === "/create") { // create
      var create_title = 'This Is Create Menu'
      var create_data = `
      <form action="http://localhost:8080/create_data" method="post">
        <p><input type="text" name="title" placeholder="title"></p>

        <p><textarea name="description" rows="10" cols="40" placeholder="description"></textarea></p>

        <p><input type="submit"></p>
      </form>
      `;

      var result_html = makeHTML(create_title, create_data, "");

      response.writeHead(200);
      response.end(result_html);
    } // end of if create
    else if(queryPathname === '/create_data') { // get POST Message.
      // parameter of this web server, 'Request'

      var create_body = '';

      request.on('data', function(data){ // when receive request. Do this.
        create_body = create_body + data;
      });

      request.on('end', function(){ // no remain data => end, Do this.
        var post = qs.parse(create_body);
        // post.tile => create title.
        // post.description => create description.

        fs.writeFile(`data/${post.title}`, post.description, 'utf8', function(err) {
          console.log('Creating File is Successed!');
        });

        response.writeHead(302, {Location: `/?id=${post.title}`}); // 302 => Redirection
        response.end();
      });


    } // end of get POST
    else { // not found
      var undefined_page = makeHTML('Fail to Found', 'Please check your URL');
      response.writeHead(404);
      response.end(undefined_page);
    } // end of not found

    return response;

}); // end of Server

app.listen(8080); // port number 3000.
