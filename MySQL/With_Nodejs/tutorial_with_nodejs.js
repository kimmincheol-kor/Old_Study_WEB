// npm install -save mysql

var mysql      = require('mysql');
var connection = mysql.createConnection({
  // same with "./mysql -uroot -p" , "Type Password"
  host     : 'localhost',
  user     : 'root', // -uroot
  password : '123456', // Password
  database : 'tutorial_nodejs' // USE tutorial_nodejs
});
 
connection.connect(); // start connect
 
connection.query('SELECT * FROM topic', function (error, results, fields) { // same with "SELECT * FROM topic" => all data are in results
  if (error){
      console.log(error);
  };
  console.log(results); // all data of table
  console.log(results.length); // number of data in table.
});
 
connection.end(); // end connect
