import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {TaskService} from "../../core/service/task-service";
import {Compartment} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import {STATUS, STATUS_COLORS} from "../../shared/status/STATUS_COLOR";
import {Subject, Subscription} from "rxjs";
import {TaskRequest} from "../../shared/types/TaskRequest";
import {TaskResultEvent} from "../../shared/types/TaskResultEvent";
import {basicSetup} from "codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {python} from "@codemirror/lang-python";
import {BlackButton} from "../../shared/buttons/black-button/black-button";
import {SimpleSelect} from "../../shared/input/simple-select/simple-select.component";

@Component({
  selector: 'app-home',
  imports: [
    BlackButton,
    SimpleSelect
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  protected title = 'sandbox-web-app';

  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  protected languages = ["JAVASCRIPT", "PYTHON", "JAVA"];

  private languageCompartment = new Compartment();
  @ViewChild('editor', {static: true}) editorRef!: ElementRef;
  editor!: EditorView;

  protected error = "";
  protected output = "";
  protected status: STATUS | undefined;
  protected language = this.languages[0];
  protected duration: number | undefined
  protected id: string | undefined

  private taskSubscription: Subscription | undefined;

  protected run() {
    const code = this.editor.state.doc.toString();
    const taskRequest: TaskRequest = {language: this.language, code};
    const taskEvents$ = new Subject<TaskResultEvent>();

    this.taskService.connect().subscribe(() => {
      this.taskService.createTask(taskRequest).subscribe(task => {
        this.status = task.status;
        this.taskService.subscribeToTask(task.id, taskEvents$);

        this.taskSubscription = taskEvents$.subscribe(event => {
          this.output = event.output;
          this.error = event.error;
          this.status = event.status;
          this.id = event.id;
          this.duration = event.duration;

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
