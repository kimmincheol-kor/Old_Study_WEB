SELECT Host,User FROM mysql.user; // Print all User in this DATABASE SERVER

// CREATE new user => User = kmc, Host = localhost
CREATE USER 'kmc'@'localhost' IDENTIFIED BY '123456'; // no authority.

// GRANT authority to User.
GRANT ALL PRIVILEGES ON tutorial_nodejs.* TO 'kmc'@'localhost'; // ALL Authority : Database:tutorial_nodejs, Table:all(*)

// Effect Modified PRIVILEGES.
FLUSH PRIVILEGES;
