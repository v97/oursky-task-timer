import './main.html';
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'

if(Meteor.isClient) {
    Session.set("sortOrder",1)
	Meteor.setInterval(function(){
        Todos.find().forEach(function(data) {
            if((data.paused == false)&&(data.done == false)) {
                Todos.update({_id: data._id}, {$set: {secondsTaken: data.secondsTaken + 1}});
            }
        });
	}
	    , 100)

    Template.toDoList.helpers({
        toDos: function () {
            return Todos.find({}, {sort: {done: Session.get("sortOrder"), paused: Session.get("sortOrder"), secondsTaken: Session.get("sortOrder")}});
        }
    });

    Template.toDoList.events({
        "click #add-todo": function () {
            Todos.insert({
                label: document.getElementById('todo-name').value,
                done: false,
                paused: false,
                //createdAt: new Date(),
                secondsTaken: 0
            })
        }
    })

    Template.toDoList.events({
        "click #reverse-sort": function () {
            Session.set("sortOrder", Session.get("sortOrder")*-1)
        }
    })

    Template.toDoList.events({
        "click #clear": function () {
            alert(Todos.count())
        }
    })

    Template.toDo.helpers({
        done: function () {
            return Todos.findOne({_id: this._id}).done
        }
    })

    Template.toDo.helpers({
        timeLeft: function () {
            var time = ""
            var task = Todos.findOne({_id: this._id})
            if(task.secondsTaken >= 60){
                time = parseInt(task.secondsTaken/60).toString() + " min "
            }
            time = time + parseInt(task.secondsTaken%60).toString() + " sec";
            if(task.done){
                time = "This task took " + time
            }
            if(task.paused){
                time = time + " (paused)"
            }
            return time
        }
    })

    Template.toDo.events({
        "click .markDone": function () {
            var isDone = Todos.findOne({_id: this._id}).done
            Todos.update({_id: this._id}, {$set: {done: true}})
        }
    })

    Template.toDo.events({
        "click .delete": function () {
			Todos.remove({_id : this._id})
        }
    })

    Template.toDo.events({
        "click .pause": function () {
            Todos.update({_id : this._id}, {$set: {paused: !this.paused}})
        }
    })
}