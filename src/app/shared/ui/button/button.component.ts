import { Component, Input, Output, Signal } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input({ required: true }) btnDesc!: Signal<string>;
  @Input() classes?: Signal<string>;
  @Input({ required: true }) onClick!: () => void;
}
