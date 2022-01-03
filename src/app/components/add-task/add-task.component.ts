import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { Task } from '../../Task'
import { FormControl } from '@angular/forms';

import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "YYYY/MM/DD",
    monthYearLabel: "YYYY MMM",
    dateA11yLabel: "YYYY/MM/DD",
    monthYearA11yLabel: "YYYY MMM"
  }
};

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class AddTaskComponent implements OnInit {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  text: string;
  day: string;
  reminder: boolean = false;
  showAddTask: boolean;
  subscription: Subscription;
  date: string;
  dateEmpty = new FormControl();

  constructor(private ui: UiService) {
    this.subscription = this.ui
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));

    window['addTask'] = this;
  }

  ngOnInit(): void {
  }

  keyIn(event) {
    this.text = event.target.value;
  }

  getDate(event: MatDatepickerInputEvent<Date>) {
    this.convert(`${event.value}`);
  }

  convert(str) {
    let date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    this.date =[date.getFullYear(), month, day].join("-");
  }

  onSubmit() {
    if (!this.text) {
      alert('Please add a task!');
      return;
    } else if (!this.date) {
      alert('Please choose a date!');
      return;
    }

    const newTask = {
      text: this.text,
      day: this.date,
      reminder: this.reminder
    }

    this.onAddTask.emit(newTask);
    this.reset();
  }

  reset() {
    this.text = '';
    this.day = '';
    this.reminder = false;
    this.dateEmpty = new FormControl();
  }

}
