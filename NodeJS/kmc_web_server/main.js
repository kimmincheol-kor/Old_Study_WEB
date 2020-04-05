var http = require('http'); // http protocol
var fs = require('fs'); // filesystem
var url = require('url'); // use module 'url'
var qs = require('querystring');

function makeHTML(title, data, list, button){
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
    ${my_list}
    <hr>
    ${button}
    <h2>Title : ${title}</h2>
    <hr>
    ${data}
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
    if(list[i] != 'Home')
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

    var queryData = url.parse(req_url, true).query; // extract query , url = "localhost:3000/?id=HTML"
    var queryPathname = url.parse(req_url, true).pathname;
    var query_id = queryData.id;

    if(queryPathname === '/') { // Load Page.
      if(queryData.id === undefined) {
        req_url = '/?id=home';
        query_id = 'Home';
      }

      // Make Response Message.
      var dir_list = fs.readdirSync('./data', 'utf8');
      var result_list = makeList_ul(dir_list, dir_list.length);

      var file_data = fs.readFileSync(`./data/${query_id}`, 'utf8');
      var btn_set = ` <a href="/create">CREATE</a><br>
                      <a href="/update?id=${query_id}">UPDATE</a><br>
                      <form action="/delete_data" method="post">
                        <input type="hidden" name="title" value=${query_id}>
                        <input type="submit" value="Delete">
                      </form>
                      <hr>`;

      if(query_id === 'Home')
        btn_set = `<a href="/create">CREATE</a><hr>`

      var result_html = makeHTML(query_id, file_data, result_list, btn_set);

      response.writeHead(200); // ERROR MESSAGE HEADER
      response.end(result_html);

      return response;
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === "/create") { // create
      var create_title = 'This Is Create Menu'
      var create_data = `
      <form action="/create_data" method="post">

        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" rows="10" cols="40" placeholder="description"></textarea></p>

        <p><input type="submit"></p>
      </form>
      `;

      var result_html = makeHTML(create_title, create_data, '', '');

      response.writeHead(200);
      response.end(result_html);
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === '/create_data') { // get POST -> CREATE.
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
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === "/update") { // UPDATE
      var update_title = query_id;
      var update_description = fs.readFileSync(`data/${query_id}`, 'utf8');
      var update_data = `
      <form action="/update_data" method="post">

        <input type="hidden" name="title" value=${update_title}>
        <p><input type="text" name="modified_title" value=${update_title}></p>
        <p><textarea name="modified_description" rows="10" cols="40" placeholder="description">${update_description}</textarea></p>

        <p><input type="submit"></p>
      </form>
      `;

      var result_html = makeHTML(update_title, update_data, '', '');

      response.writeHead(200);
      response.end(result_html);
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === "/update_data") { // Get POST -> UPDATE
      var create_body = '';

      request.on('data', function(data){ // when receive request. Do this.
        create_body = create_body + data;
      });

      request.on('end', function(){ // no remain data => end, Do this.
        var post = qs.parse(create_body);

        var title = post.title;
        var new_title = post.modified_title;
        var new_description = post.modified_description;

        // Operate modify
        fs.renameSync(`data/${title}`, `data/${new_title}`);
        fs.writeFile(`data/${new_title}`, new_description, 'utf8', function(err) {
          console.log('Creating File is Successed!');
        });

        response.writeHead(302, {Location: `/?id=${new_title}`}); // 302 => Redirection
        response.end();
      });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === "/delete_data") { // DELETE
      var create_body = '';

      request.on('data', function(data){ // when receive request. Do this.
        create_body = create_body + data;
      });

      request.on('end', function(){ // no remain data => end, Do this.
        var post = qs.parse(create_body);

        var title = post.title;

        // Operate delete
        fs.unlinkSync(`data/${title}`);

        response.writeHead(302, {Location: `/`}); // 302 => Redirection
        response.end();
      });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else { // not found
      var undefined_page = makeHTML('Fail to Found', 'Please check your URL', '','');
      response.writeHead(404);
      response.end(undefined_page);
    }

    return response;

}); // end of Server

app.listen(8080); // port number 3000.
