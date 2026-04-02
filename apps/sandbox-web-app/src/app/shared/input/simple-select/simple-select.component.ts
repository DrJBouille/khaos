import {AfterViewInit, Component, input, OnInit, output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-simple-select',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './simple-select.component.html',
  styleUrl: './simple-select.component.css',
})
export class SimpleSelect implements AfterViewInit {
  elements = input<string[]>([]);
  selected = input<string>("");
  change = output<string>();

  value = signal<string>('');


  ngAfterViewInit() {
    this.value.set(this.selected());
  }

  onChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.value.set(selectedValue);
    this.change.emit(selectedValue);
  }
}
