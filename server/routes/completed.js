var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todo';


//PUT - update database status to completed once completed button is clicked
router.put('/:id', function (req, res) {
  var id = req.params.id;
  var status = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
                  'SET status = $1' +
                  'WHERE id = $2',
                  [status.stat, id],
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



module.exports = router;
