import { email, minLength, pattern, required, schema, validate } from '@angular/forms/signals';
import { RegisterFormModel } from './register.model';

export const registerFormSchema = schema<RegisterFormModel>((schemaPath) => {
  required(schemaPath.username, { message: 'Username is required' });

  required(schemaPath.email, { message: 'Email is required' });
  email(schemaPath.email, { message: 'Please enter a valid email' });

  required(schemaPath.phone, { message: 'Phone is required' });
  // pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
  //     message: 'Phone must be in format: 555-123-4567',
  //   });

  required(schemaPath.password, { message: 'Password is required' });
  minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });

  // required(schemaPath.confirmPassword, { message: 'Please confirm your password' });

  validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
    const confirmPassword = value();
    const password: string = valueOf(schemaPath.password);

    if (confirmPassword !== password) {
      return {
        kind: 'passwordMismatch',
        message: 'Passwords do not match',
      };
    }

    return null;
  });
});
