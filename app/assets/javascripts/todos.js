
// wait for document.ready or window.onload
$(function(){

  // grab our form by id = "addTodo"
  //  listen for a submit event
  //  handle with a callback, that takes the event
  $('#addTodo').on('submit', function(event) {
    // begin callback, prevent from submission
    event.preventDefault();
    console.log("to do form was added!", event);

    var newTodo = {completed: false};
    newTodo.title = $("#todo_title").val();
    console.log(newTodo);

    // var data = {todo: newTodo};
    // $.ajax({url: 'todos/.json',
    //         type: 'post',
    //         data: data,
    //       }).done();

    // an alternate form of above post
    $.post("/todos.json", {todo: newTodo}).done(function(data) {
        console.log(data);
        var todoHTML = HandlebarsTemplates.todo(data);
        $("#todos").append(todoHTML);
      });
  });

  // Let's handle update a todo.
  $("#todos").on("click", ".todo", function(event) {
    console.log(event);
    if (event.target.name === 'completed') {
      var updatedTodo = {id: this.dataset.id};
      updatedTodo.completed = event.target.checked;
      console.log(updatedTodo);

      var _this = this;
      $.ajax({
          url: "/todos/" + updatedTodo.id + ".json",
          method: "PATCH",
          data: {todo: updatedTodo}
      }).done(function(data){
          // toggleClass turns a css class on or off
          // (see done-true class in todos.css.scss)
          $(_this).toggleClass("done-true");
      });
    }
    else if (event.target.id === "removeTodo") {
      var deletedTodo = {id: this.dataset.id};
      $.ajax({  url: "/todos/" + deletedTodo.id + ".json",
                method: "DELETE"
      }).done(function() {
        this.remove();
      });
    }
  });

  // load all todos to the page
  $.get("/todos.json").done(function(responseData) {
    $(responseData).each(function(index, todo) {
      var todoHTML = HandlebarsTemplates.todo(todo);
      $("#todos").append(todoHTML);
    });

    // for (var i=0, len = responseData.length; i < len; i++) {
    //   $("").make(responseData[i]).append();
    // }

  });

});
