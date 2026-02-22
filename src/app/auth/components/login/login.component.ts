import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';
import { LoginFormModel } from './login.model';
import { form } from '@angular/forms/signals';
import { FormFieldComponent } from '../../../shared/ui/form-field/form-field.component';
import { PasswordInputComponent } from '../register/password-input/password-input.component';
import { loginformSchema } from './login.schema';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, RouterLink, FormFieldComponent, PasswordInputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // UI
  btnText = signal('Login');
  btnClasses = signal('w-full');

  handleClick() {
    console.log(this.loginForm().value());
  }

  onRoleChange(role: string) {
    this.formModel.update((model) => ({ ...model, role }));
    this.loginForm().markAsTouched();
  }

  formModel = signal<LoginFormModel>({
    role: '',
    email: '',
    password: '',
  });

  loginForm = form<LoginFormModel>(this.formModel, loginformSchema);
}
