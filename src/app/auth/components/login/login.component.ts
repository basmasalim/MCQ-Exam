import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // UI
  btnText = signal('Login');
  btnClasses = signal('w-full');

  handleClick() {
    this.btnText.set('Clicked ✅');
  }

  // Form
}
