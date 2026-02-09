import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, RouterLink],
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
