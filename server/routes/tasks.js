var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todo';


router.post('/', function (req, res) {
  var task = req.body;
  var status = {stat: "pending"};

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO tasks (task, notes, status) ' +
                  'VALUES ($1, $2, $3)',
                   [task.task, task.notes, status.stat],
                 function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(201);
                 });
  });
});


router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks ' +
                'ORDER BY status DESC',
                function (err, result) {
                done();

                console.log(result.rows);

                res.send(result.rows);
    });
  });
});

module.exports = router;
