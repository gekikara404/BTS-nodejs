'use strict';

var response = require('./res');
var connection = require('./conn');


exports.users = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        connection.query('SELECT * FROM shopping', function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                response.ok(rows, res)
            }
        });

    });
};



exports.index = function(req, res) {
    response.ok("Hello from the Node JS RESTful side!", res)
};

exports.findUsers = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        var shopping_id = req.params.shopping_id;

        connection.query('SELECT * FROM shopping where id = ?',
        [ shopping_id ], 
        function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                var data = {
                    'shopping': rows[0]
                };
                res.json(data);
                res.end();
            }
        });
    });
};

exports.createUsers = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        var name = req.body.name;
        var createddate = req.body.createddate;

        connection.query('INSERT INTO shopping (name, createddate) values (?,?)',
        [ name, createddate ], 
        function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                response.ok("Berhasil menambahkan shopping!", res)
            }
        });
    });
    
};

exports.updateUsers = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        var id = req.body.id;
        var name = req.body.name;
        var createddate = req.body.createddate;

        connection.query('UPDATE shopping SET name = ?, createddate = ? WHERE id = ?',
        [ name, createddate, id ], 
        function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                response.ok("Berhasil merubah shopping!", res)
            }
        });
    });
};

exports.deleteUsers = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        var user_id = req.body.id;

        connection.query('DELETE FROM shopping WHERE id = ?',
        [ user_id ], 
        function (error, rows, fields){
            if(error){
                console.log(error)
            } else{
                response.ok("Berhasil menghapus shopping!", res)
            }
        });
    });
};


exports.registers = function(req, res) {
    var username = req.body.username;
    var password = bcrypt.hashSync(req.body.password, 8);
    var email = req.body.email;
    var phone = req.body.phone;
    var country = req.body.country;
    var city = req.body.city;
    var postcode = req.body.postcode;
    var name = req.body.name;
    var address = req.body.address;

    

    connection.query('INSERT INTO user (username, password, email, phone, country, city, postcode, name, address) values (?,?,?,?,?,?,?,?,?)',
    [ username, password, email, phone, country, city, postcode, name, address ], 
    function (error, rows, fields){
        if(error){
            console.log(error)
        } else{
            var token = jwt.sign({ id: rows.id }, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', {
                expiresIn: 86400 // expires in 24 hours
              });
            var data = {
                'email': email,
                'token' : token,
                'username' : username
            };
            res.json(data);
            res.end();
            // response.ok("Berhasil menambahkan users!", res)
        }
    });
};
exports.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    connection.query('SELECT * FROM user where email = ? ',
    [ email ], 
    function (error, rows, fields){
        if(error){
            console.log(error)
        } else{
            var passwordIsValid = bcrypt.compareSync(password, rows[0].password);

            if(passwordIsValid){
                var token = jwt.sign({ id: rows.id }, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', {
                    expiresIn: 86400 // expires in 24 hours
                  });

                var data = {
                    'email': rows[0].email,
                    'token': token,
                    'username': rows[0].username
                };
                res.json(data);
                res.end();
            }else{
                var data = {
                    'state' : false,
                    'message' : 'password salah'
                };
                res.json(data);
                res.end();
            }

        }
    });
};

exports.verify = function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'qb5tUjFS18G2MjadwKA1FsZUSytyeME9xnT7AMZQZmIJlrkbq1ihITkIxESAUUYn', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        res.status(200).send(decoded);
    });
};