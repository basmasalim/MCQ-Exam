import { Component } from '@angular/core';
import { IAuthInfo } from '../../interfaces/iauth-info.interface';
import { AuthInfo } from '../../enums/auth-info..';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-auth-info',
  imports: [IconComponent],
  templateUrl: './auth-info.component.html',
  styleUrl: './auth-info.component.css',
})
export class AuthInfoComponent {
  features: IAuthInfo[] = AuthInfo;
}
