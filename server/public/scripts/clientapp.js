$(document).ready(function () {

  getTasks();
  $('#submit').on('click', createTask);

  $('#taskContainer').on('click', '.updateNotes', putNotes);
  $('#taskContainer').on('click', '.completed', completeTask);
  $('#taskContainer').on('click', '.delete', deleteTask);


});

//**-----------UTILITY FUNCTIONS--------------**/

// prepare updated notes about task into an object
function dataPrep(button) {
  var notes = {};

  $.each(button.parent().find('#notes').serializeArray(), function (i, field) {
    notes[field.name] = field.value;
  });
  //console.log(button.parent().find('#notes').serializeArray());

  return notes;
}

// get the ID of the div holding specific task
function getTaskId(button) {
  var taskId = button.parent().data("id");
  return taskId;
  console.log(button.parent().data("id"));
}


//**--------------POST & GET -- MAIN FUNCTIONS----------------**

// POST -- take info from form and put it into database
function createTask() {
  event.preventDefault();
  var tasks = {};

  $.each($('#taskInput').serializeArray(), function (i, field) {
      tasks[field.name] = field.value;
    });
    console.log(tasks);

    $('#taskInput')[0].reset();


    $.ajax({
      type: 'POST',
      url: '/tasks',
      data: tasks,
      success: function(response) {
        console.log(response);

        getTasks();
      }
    });
    $('input[name=task]').focus(); //auto focuses cursor back to input field where name = task (from html page)
}

// GET -- retrieve data from database, create container/fields to dispaly data on DOM
function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(data) {
      $('#taskContainer').empty();
      data.forEach(function(task, i) {

        if(task.status == "completed") {
          $container = $('<div class="finallyComplete"></div>');
        }
        else {
          $container = $('<div class="task"></div>');
        }
          $container.data("id", task.id);
          $container.append('<h3>Task: '+task.task+'</h3>');
          $container.append('<h4>status: '+task.status+'</h4>');
          $container.append('<h5>notes: '+task.notes+'</h5>');

          // editable notes field
          var notesProperty = ['notes'];
          notesProperty.forEach(function (prop) {

            var $el = $('<form id="updater">' + '<textarea id="notes" name="notes" class="newNotes"' +
                      'cols="20" rows="4" placeholder="update notes..."></textarea>' + '</form>');


            $el.val(task[prop]);
            $container.append($el);
          });

          $container.append('<button class="updateNotes">submit</button>');
          $container.append('<button class="completed">complete task</button>');
          $container.append('<button class="delete">delete task</button>');
          $('#taskContainer').append($container);
      });
    }
  });
}


//**------------------ PUT & DELETE -- SPECIALIZED FUNCTIONS --------------**

// PUT -- update data from DOM to database when "update notes" is clicked
function putNotes(event) {
  event.preventDefault();

  var preparedData = dataPrep($(this));
  var notesId = getTaskId($(this));

  console.log(dataPrep($(this)));
  console.log(getTaskId($(this)));

  //clear update notes input box
  //$(this).parent().find('#notes')[0].reset();

  $.ajax({
    type: 'PUT',
    url: '/updates/' + notesId,
    data: preparedData,
    success: function (data) {
      console.log(data);
      getTasks();
    },
  });
}

// PUT -- update database of completed task when "complete task" is clicked
function completeTask() {
  event.preventDefault();

  var status = {stat: "completed"};
  var notesId = getTaskId($(this));

  $.ajax({
    type: 'PUT',
    url: '/completed/' + notesId,
    data: status,
    success: function (data) {
      getTasks();
    }
  });

}

// DELETE -- delete data from DOM and database
function deleteTask() {
  event.preventDefault();
  var done = confirm('FINISHED ALREADY?');

  if (done == true) {
    var notesId = getTaskId($(this));

    $.ajax({
      type: 'DELETE',
      url: '/updates/' + notesId,
      success: function (data) {
        getTasks();
      }
    });
  }
}

//   var notesId = getTaskId($(this));
//
//   $.ajax({
//     type: 'DELETE',
//     url: '/updates/' + notesId,
//     success: function (data) {
//       getTasks();
//     }
//   });
// }
