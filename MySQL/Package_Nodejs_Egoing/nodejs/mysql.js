var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'kmc',
  password : '123456',
  database : 'tutorial_nodejs'
});
 
connection.connect(); // 접속
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error){
      console.log(error);
  };
  console.log(results);
  console.log(results.length);
});
 
connection.end();