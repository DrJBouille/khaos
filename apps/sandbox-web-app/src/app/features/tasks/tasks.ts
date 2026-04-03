import {Component, inject, OnInit, signal} from '@angular/core';
import {TaskService} from "../../core/service/task-service";
import {Task} from "../../shared/types/Task";
import {DatePipe, DecimalPipe} from "@angular/common";
import {STATUS_COLORS} from "../../shared/status/STATUS_COLOR";

@Component({
  selector: 'app-tasks',
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);

  protected tasks = signal<Task[]>([]);

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  protected readonly STATUS_COLORS = STATUS_COLORS;
}
