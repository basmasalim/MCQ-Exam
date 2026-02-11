import { Component, Input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-form-field',
  imports: [FormField],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input({ required: true }) field!: any;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder = '';
}
