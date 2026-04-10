import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {TaskService} from "../../core/services/task-service/task-service";
import {Compartment} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import {STATUS, STATUS_COLORS} from "../../shared/status/STATUS_COLOR";
import {catchError, debounceTime, EMPTY, Subject, Subscription, switchMap, throwError} from "rxjs";
import {TaskRequest} from "../../shared/types/tasks/TaskRequest";
import {TaskResultEvent} from "../../shared/types/tasks/TaskResultEvent";
import {basicSetup} from "codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {python} from "@codemirror/lang-python";
import {BlackButton} from "../../shared/buttons/black-button/black-button";
import {SimpleSelect} from "../../shared/input/simple-select/simple-select.component";
import {SessionsService} from "../../core/services/sessions-service/sessions-service";
import {NgIcon} from "@ng-icons/core";
import {NgClass} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {WebsocketService} from "../../core/services/websocket-service/websocket-service";

@Component({
  selector: 'app-home',
  imports: [
    BlackButton,
    SimpleSelect,
    NgIcon,
    NgClass
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  protected title = 'sandbox-web-app';

  private taskService = inject(TaskService);
  private websocketService = inject(WebsocketService);
  private sessionService = inject(SessionsService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  protected session: Session | undefined;
  private sessionSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>();
  private editorChanges$ = new Subject<void>();
  protected saveStatus = 'Saved';
  private isRemoteUpdate = false;

  protected languages = ["JAVASCRIPT", "PYTHON", "JAVA"];

  private languageCompartment = new Compartment();
  @ViewChild('editor', {static: true}) editorRef!: ElementRef;
  editor!: EditorView;
  updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      if (this.isRemoteUpdate) return;
      this.editorChanges$.next();
      this.saveStatus = 'Saving...';
      this.cdr.detectChanges();
    }
  });

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

    this.taskService.createTask(taskRequest).subscribe(task => {
      this.status = task.status;
      this.websocketService.subscribe<TaskResultEvent>(`/topic/tasks/${task.id}`, taskEvents$);

      this.taskSubscription = taskEvents$.subscribe(event => {
        this.output = event.output;
        this.error = event.error;
        this.status = event.status;
        this.id = event.id;
        this.duration = event.duration;

        this.cdr.detectChanges();
      });
    });
  }

  private setSession = (session: Session) => {
    this.session = session;

    this.editor = new EditorView({
      doc: session.code == "" ? "setTimeout(function(){\n    console.log('test');\n}, 4000);" : session.code,
      extensions: [basicSetup, this.languageCompartment.of(javascript()), this.updateListener],
      parent: this.editorRef.nativeElement
    });

    const sessionEvents$ = new Subject<SessionUpdateEvent>();
    this.websocketService.subscribe<SessionUpdateEvent>(`/topic/sessions/${session.id}`, sessionEvents$);

    this.sessionSubscription = sessionEvents$.subscribe(event => {
      this.isRemoteUpdate = true;

      this.editor.dispatch({
        changes: {
          from: 0,
          to: this.editor.state.doc.length,
          insert: event.message
        }
      });

      this.isRemoteUpdate = false;
    });

    this.cdr.detectChanges();
  }

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (sessionId) {
      this.sessionSubscription = this.sessionService.getSession(sessionId).subscribe(this.setSession);
    } else {
      this.sessionSubscription = this.sessionService.getMySession().pipe(
        catchError(err => {
          if (err.status === 404) {
            const sessionRequest: SessionRequest = {
              code: "setTimeout(function(){\n    console.log('test');\n}, 4000);"
            };
            return this.sessionService.createSession(sessionRequest);
          }
          return throwError(() => err);
        })
      ).subscribe(this.setSession);
    }

    this.editorChanges$.pipe(
      debounceTime(1000),
      switchMap(() => {
        if (!this.session) return EMPTY;

        const sessionRequest: SessionRequest = {
          code: this.editor.state.doc.toString()
        };

        const sessionUpdateEvent: SessionUpdateEvent = {
          id: this.session.id,
          message: this.editor.state.doc.toString()
        };

        this.websocketService.send(`/app/sessions/${this.session.id}`, sessionUpdateEvent);
        return this.sessionService.updateSession(this.session.id, sessionRequest);
      })
    ).subscribe({next: () => {
        this.saveStatus = 'Saved';
        this.cdr.detectChanges();
    }});
  }

  ngOnDestroy() {
    if (this.session) {
      const sessionRequest: SessionRequest = {
        code: this.editor.state.doc.toString()
      };
      this.sessionService.updateSession(this.session.id, sessionRequest).subscribe();
    }

    this.taskSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
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

  protected toggleSessionOpening() {
    if (this.session) this.sessionService.toggleSessions(this.session.id).subscribe(session => {
      this.session = session;
      this.cdr.detectChanges();
    });
  }

  protected readonly STATUS_COLORS = STATUS_COLORS;
}
