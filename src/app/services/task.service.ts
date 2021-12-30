import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { Task } from '../Task';
// import { TASKS } from '../mock-tasks';

import { AngularFirestore } from '@angular/fire/compat/firestore';

const httpOptions = {
  headers: new HttpHeaders ({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  tasks: Task[] = [];

  constructor(private http: HttpClient, private afs: AngularFirestore) { 
    // this.afs.collection<Task>('task').valueChanges().subscribe((data) => this.taskList = data);
    
    this.afs.collection<Task>('task').snapshotChanges().subscribe((data) => {
      this.tasks = [];
      data.forEach((item) => {
        this.tasks.push({
          id: item.payload.doc.id,
          ...item.payload.doc.data(),
        });
      });
      // console.log('this.tasks=>', this.tasks);
    });
  }

  getTasks(): Observable<Task[]> {
    // return TASKS;          使用Observable前

    // const tasks = of(TASKS);    使用HttpClient前
    // return tasks;

    return this.http.get<Task[]>(this.apiUrl);
  }

  deleteTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.delete<Task>(url);
  }
  
  updateTaskReminder(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put<Task>(url, task, httpOptions);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, httpOptions);
  }

}
