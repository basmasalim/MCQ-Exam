import { Component, Input, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-password-input',
  imports: [FormField],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css',
})
export class PasswordInputComponent {
  @Input({ required: true }) field!: any;
  @Input() label = 'Password';

  show = signal(false);

  toggle() {
    this.show.update((v) => !v);
  }
}
