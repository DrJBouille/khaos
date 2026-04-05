import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {TaskService} from "../../core/service/task-service";
import {Task} from "../../shared/types/Task";
import {DatePipe, DecimalPipe} from "@angular/common";
import {STATUS_COLORS} from "../../shared/status/STATUS_COLOR";
import {Client} from "@stomp/stompjs";
import {Subject, Subscription} from "rxjs";
import {TaskResultEvent} from "../../shared/types/TaskResultEvent";

@Component({
  selector: 'app-tasks',
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit, OnDestroy {
  private taskService = inject(TaskService);

  protected tasks = signal<Task[]>([]);
  private taskSubscription: Subscription | undefined;

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));

    const taskEvents$ = new Subject<TaskResultEvent>();
    this.taskService.connect().subscribe(() => {
      this.taskService.subscribeToAllTasks(taskEvents$);

      this.taskSubscription = taskEvents$.subscribe(event => {
        this.tasks.update(tasks =>
          tasks.map(task =>
            task.id === event.id ?
              {...task, status: event.status, duration: event.duration} :
              task
          )
        );
      });
    });
  }

  ngOnDestroy() {
    this.taskSubscription?.unsubscribe();
  }

  protected readonly STATUS_COLORS = STATUS_COLORS;
}
