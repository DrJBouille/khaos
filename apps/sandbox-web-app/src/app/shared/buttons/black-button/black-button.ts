import {Component, Input, output} from '@angular/core';

@Component({
  selector: 'app-black-button',
  imports: [],
  templateUrl: './black-button.html',
  styleUrl: './black-button.css',
})
export class BlackButton {
  @Input({ required: true }) text!: string
  protected onClick = output<void>();
}
