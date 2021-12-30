import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TASKS } from '../../mock-tasks';
import { Task } from '../../Task';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  // id: string;

  constructor(
    private taskService: TaskService,
    private afs: AngularFirestore
  ) {
  
  }

  ngOnInit() {
    // this.tasks = this.taskService.getTasks();       //使用Observable前
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));   //使用Observable後
  }
  
  ngDoCheck() {
    this.tasks = this.taskService.tasks;
  }

  deleteTask(task: Task) {
    // this.taskService
    //   .deleteTask(task)
    //   .subscribe(() => (this.tasks = this.tasks.filter((t) => t.id !== task.id)));
    this.afs.collection('task').doc(`${task.id}`).delete();
  }

  toggleReminder(task: Task) {
    task.reminder = !task.reminder;
    // this.taskService.updateTaskReminder(task).subscribe();
    this.afs.collection('task').doc(`${task.id}`).update(task);
    // console.log(task.id)
  }

  addTask(task: Task) {
    // this.taskService.addTask(task).subscribe(() => (this.tasks.push(task)));
    let idArr = [];
    for (let i = 0; i < this.tasks.length; i++) {
      idArr.push(Number(this.tasks[i].id));
    }
    let maxId = Math.max(...idArr);

    if (this.tasks.length === 0) {
      this.afs.collection('task').doc('1').set(task);
    } else {
      this.afs.collection('task').doc(`${maxId + 1}`).set(task);
    }

  }
}