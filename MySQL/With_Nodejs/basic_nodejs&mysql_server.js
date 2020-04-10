var http = require('http'); // http protocol
var fs = require('fs'); // filesystem
var url = require('url'); // use module 'url'
var qs = require('querystring');
var path = require('path');
var sanitizeHTML = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'tutorial_nodejs'
});

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

function makeList_ul(list){
  // make page list!
  var list_ul = '<ul>';

  var i = 0;
  while(i < list.length)
  {
    list_ul = list_ul + `<li><a href="/?id=${list[i].id}">${list[i].title}</a></li>`;

    i =  i+1;
  }

  list_ul =
   list_ul + '</ul>'; // end of make page list

  return list_ul;
}

var app = http.createServer(function(request,response){

    var req_url = request.url; // request.url = '/?id=HTML' after port number in URL

    // skip favicon request
    if(req_url == '/favicon.ico'){
      return response.writeHead(404);
    }

    var queryPathname = url.parse(req_url, true).pathname;
    var queryData = url.parse(req_url, true).query; // extract query , url = "localhost:3000/?id=HTML"
    var filteredID = sanitizeHTML(queryData.id);

    ////////////////////////////////////////////////////////////////////////////////////////
    if(queryPathname === '/'){ // Open Page
      db.query('SELECT * FROM topic;', function(err, topics){
        if(err) throw err;

        var result_list = makeList_ul(topics);

        // Filtering => for Secure.
        if(queryData.id === undefined) { // Home
          var html = makeHTML('Home', 'Welcome to the Home Page.', result_list, `<a href="/create">CREATE</a><hr>`);
        
          response.writeHead(200); // ERROR MESSAGE HEADER
          response.end(html);
        }
        else { // Not Home 
          var btn_set = ` <a href="/create">CREATE</a><br>
                          <a href="/update?id=${filteredID}">UPDATE</a><br>
                          <form action="/delete_data" method="post">
                            <input type="hidden" name="id" value=${filteredID}>
                            <input type="submit" value="Delete">
                          </form>
                          <hr>`;

          db.query('SELECT * FROM topic WHERE id = ?', [filteredID], function(err, topic){
            if(err) throw err;

            var html = makeHTML(topic[0].title, topic[0].description, result_list, btn_set);
          
            response.writeHead(200); // ERROR MESSAGE HEADER
            response.end(html);
          });
        }
      });
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

        db.query(`INSERT INTO topic (title, description, created, author_id)
                  VALUES(?, ?, NOW(), ?)`,
                  [post.title, post.description, 1],
                  function(err, results) {
                    if(err) throw err;

                    response.writeHead(302, {Location: `/?id=${results.insertId}`});
                    response.end();
        });
      });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === "/update") { // UPDATE
      db.query(`SELECT * FROM topic WHERE id=?`, [filteredID], function(err, result){
        var update_data = `
        <form action="/update_data" method="post">

          <input type="hidden" name="id" value=${result[0].id}>
          <p><input type="text" name="title" value=${result[0].title}></p>
          <p><textarea name="description" rows="10" cols="40" placeholder="description">${result[0].description}</textarea></p>

          <p><input type="submit"></p>
        </form>
        `;

        var result_html = makeHTML(`Updating topic id = ${result[0].id}`, update_data, '', '');

        response.writeHead(200);
        response.end(result_html);
      });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if(queryPathname === "/update_data") { // Get POST -> UPDATE
      var create_body = '';

      request.on('data', function(data){ // when receive request. Do this.
        create_body = create_body + data;
      });

      request.on('end', function(){ // no remain data => end, Do this.
        var post = qs.parse(create_body);

        var modify_id = post.id;
        var new_title = post.title;
        var new_description = post.description;

        // Operate modify
        db.query('UPDATE topic SET title=?, description=? WHERE id=?',
                  [new_title, new_description, modify_id],
                  function(err, results) {
                    if(err) throw err;

                    response.writeHead(302, {Location: `/?id=${modify_id}`});
                    response.end();
        });
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

        // Operate delete
        db.query('DELETE FROM topic WHERE id=?', [post.id], function(err, results) {
          if(err) throw err;
        });

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
