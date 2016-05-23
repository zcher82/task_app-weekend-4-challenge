var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todo';


// PUT -- update notes field in database with new data from DOM
router.put('/:id', function (req, res) {
  var id = req.params.id;
  var task = req.body;

  console.log(req.body);
  console.log(req.params.id);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
                  'SET notes = $1 ' +
                  'WHERE id = $2',
                  [task.notes, id],
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                    return;
                  }
                    res.sendStatus(200);
                });
  });
});


// DELETE - delete a task from the database
router.delete('/:id', function (req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }

    client.query('DELETE FROM tasks ' +
                  'WHERE id = $1',
                   [id],
                 function (err, result) {
                   done();

                   if (err) {
                     console.log(err);
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(200);
                 });
  });
});



module.exports = router;
