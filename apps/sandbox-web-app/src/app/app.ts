import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BlackButton} from "./shared/buttons/black-button/black-button";
import {STATUS, STATUS_COLORS} from "./shared/status/STATUS_COLOR";
import {SimpleSelect} from "./shared/input/simple-select/simple-select.component";
import {FormsModule} from "@angular/forms";
import {TaskRequest} from "./service/types/TaskRequest";
import {TaskService} from "./service/task-service";
import {Subject, Subscription} from "rxjs";
import {TaskResultEvent} from "./service/types/TaskResultEvent";
import {EditorView} from "@codemirror/view";
import {javascript} from "@codemirror/lang-javascript";
import {basicSetup} from "codemirror";
import {Compartment} from "@codemirror/state";
import {python} from "@codemirror/lang-python";

@Component({
  imports: [RouterModule, BlackButton, SimpleSelect, FormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  protected title = 'sandbox-web-app';

  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  protected languages = ["JAVASCRIPT", "PYTHON"];

  private languageCompartment = new Compartment();
  @ViewChild('editor', { static: true }) editorRef!: ElementRef;
  editor!: EditorView;

  protected error = "";
  protected output = "";
  protected status: STATUS = STATUS.NOT_STARTED;
  protected language = this.languages[0];

  private taskSubscription: Subscription | undefined;

  protected run() {
    const code = this.editor.state.doc.toString();
    const taskRequest: TaskRequest = {language: this.language, code};
    const taskEvents$ = new Subject<TaskResultEvent>();

    this.taskService.connect(taskEvents$).subscribe(() => {
      this.taskService.createTask(taskRequest).subscribe(task => {
        this.status = task.status;
        this.taskService.subscribeToTask(task.id, taskEvents$);

        this.taskSubscription = taskEvents$.subscribe(event => {
          this.output = event.output;
          this.error = event.error;
          this.status = event.status;

          this.cdr.detectChanges();
        });
      });
    });
  }

  ngAfterViewInit() {
    this.editor = new EditorView({
      doc: "setTimeout(function(){\n    console.log('test');\n}, 4000);",
      extensions: [basicSetup, this.languageCompartment.of(javascript())],
      parent: this.editorRef.nativeElement
    });
  }

  ngOnDestroy() {
    this.taskService.closeConnection();
    this.taskSubscription?.unsubscribe();
  }

  protected changeLanguage(lang: string) {
    if (typeof lang !== "string") return
    this.language = lang;
    let extension;

    switch (lang.toLowerCase()) {
      case 'python':
        extension = python();
        break;
      case 'javascript':
        extension = javascript();
        break;
      default:
        extension = javascript();
    }

    this.editor.dispatch({
      effects: this.languageCompartment.reconfigure(extension)
    });
  }

  protected readonly STATUS_COLORS = STATUS_COLORS;
}
