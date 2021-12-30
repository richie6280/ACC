import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'Task Tracker';
  showAddTask: boolean = false;
  subscription: Subscription;

  constructor(private ui: UiService, private router: Router) {
    this.subscription = this.ui
    .onToggle()
    .subscribe((value) => (this.showAddTask = value));
  }
  
  ngOnInit() {}

  toggleAddTask() {
    this.ui.toggleAddTask();
  }

  hasRoute(router: string) {
    return this.router.url === router;
  }
}
