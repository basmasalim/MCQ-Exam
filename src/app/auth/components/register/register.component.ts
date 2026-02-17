import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';
import { RegisterFormModel } from './register.model';
import { form } from '@angular/forms/signals';
import { registerFormSchema } from './register.schema';
import { FormFieldComponent } from '../../../shared/ui/form-field/form-field.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { PasswordInputComponent } from './password-input/password-input.component';

@Component({
  selector: 'app-register',
  imports: [
    ButtonComponent,
    RouterLink,
    FormFieldComponent,
    PhoneInputComponent,
    PasswordInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  phoneValue = signal('');
  isValid = signal(false);

  btnText = signal('Create Account');
  btnClasses = signal('w-full');

  handleClick() {
    this.btnText.set('Clicked ✅');
    console.log(this.registrationForm().value());
  }

  formModel = signal<RegisterFormModel>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  registrationForm = form<RegisterFormModel>(this.formModel, registerFormSchema);

  onPhoneChange(phone: string) {
    this.phoneValue.set(phone);
  }

  onPhoneValid(valid: boolean) {
    this.isValid.set(valid);
  }
}
