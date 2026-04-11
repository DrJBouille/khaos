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
import {catchError, Subject, Subscription, throwError} from "rxjs";
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
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import {WebrtcProvider} from "y-webrtc";

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
  private taskService = inject(TaskService);
  private websocketService = inject(WebsocketService);
  private sessionService = inject(SessionsService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  protected session: Session | undefined;
  private sessionSubscription: Subscription | undefined;
  protected saveStatus = 'Saved';

  private user: KhaosUser | undefined;

  private ydoc!: Y.Doc;
  private provider!: WebrtcProvider;
  private ytext!: Y.Text;

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

    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText('codemirror');

    this.provider = new WebrtcProvider(session.id, this.ydoc, {
      signaling: ['ws://localhost:4444']
    });

    const initContent = () => {
      if (this.ytext.length === 0 && session.code) {
        this.ytext.insert(0, session.code);
      }
    };

    if (this.provider.connected) {
      initContent()
    } else {
      const onSync = (arg0: { synced: boolean }) => {
        if (arg0.synced) {
          initContent();
          this.provider.off('synced', onSync)
        }
      };

      this.provider.on('synced', onSync);

      setTimeout(() => {
        if (this.ytext.length === 0 && session.code) {
          this.ytext.insert(0, session.code);
        }
      }, 1500);
    }

    const randomColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

    const awareness = this.provider.awareness
    awareness.setLocalStateField('user', {
      name: this.user?.username,
      color: randomColor(),
    })

    this.editor = new EditorView({
      extensions: [
        basicSetup,
        this.languageCompartment.of(javascript()),
        yCollab(this.ytext, this.provider.awareness)
      ],
      parent: this.editorRef.nativeElement
    });


    this.cdr.detectChanges();
  };

  ngOnInit() {
    this.user = this.route.snapshot.data['user'] as KhaosUser;
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
  }

  ngOnDestroy() {
    if (this.session) {
      const code = this.ytext.toString();
      this.sessionService.updateSession(this.session.id, {code}).subscribe();
    }

    this.taskSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();

    this.provider?.destroy();
    this.ydoc?.destroy();
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

  private base64ToUint8(base64: string): Uint8Array {
    console.log('base64 reçu:', base64.substring(0, 50));
    console.log('longueur:', base64.length);
    console.log('caractères invalides:', base64.match(/[^A-Za-z0-9+/=_-]/g));
    // Corriger le padding si manquant
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private uint8ToBase64(u8: Uint8Array): string {
    let binary = '';
    // Traiter par chunks pour éviter le stack overflow
    const chunkSize = 0x8000;
    for (let i = 0; i < u8.length; i += chunkSize) {
      binary += String.fromCharCode(...u8.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  protected readonly STATUS_COLORS = STATUS_COLORS;
}
