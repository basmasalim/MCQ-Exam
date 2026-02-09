import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // UI
  btnText = signal('Create Account');
  btnClasses = signal('w-full');

  handleClick() {
    this.btnText.set('Clicked ✅');
  }
}
