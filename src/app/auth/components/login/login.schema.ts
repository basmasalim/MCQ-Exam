import { LoginFormModel } from './login.model';
import { email, minLength, required, schema } from '@angular/forms/signals';

export const loginformSchema = schema<LoginFormModel>((schemaPath) => {
  required(schemaPath.role, { message: 'Role is required' });

  required(schemaPath.email, { message: 'Email is required' });
  email(schemaPath.email, { message: 'Please enter a valid email' });

  required(schemaPath.password, { message: 'Password is required' });
  minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });
});
