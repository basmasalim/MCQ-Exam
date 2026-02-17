import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneService } from '../services/phone.service';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

/**
 * Custom validator for phone numbers using libphonenumber-js
 */
export function createPhoneValidator(phoneService: PhoneService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use required validator for that)
    }

    const phoneState = phoneService.getPhoneState();

    if (!phoneState.selectedCountry) {
      return { phoneCountryRequired: 'Please select a country' };
    }

    if (!phoneState.phoneNumber) {
      return { phoneRequired: 'Phone number is required' };
    }

    try {
      const fullPhoneNumber = phoneState.selectedCountry.idd.root + phoneState.phoneNumber;
      const isValid = isValidPhoneNumber(fullPhoneNumber, phoneState.selectedCountry.cca2 as any);

      if (!isValid) {
        return {
          phoneInvalid: 'Invalid phone number format for selected country',
          phoneCountry: phoneState.selectedCountry.cca2,
        };
      }

      return null; // Valid
    } catch (error) {
      return {
        phoneInvalid: 'Invalid phone number format',
        phoneError: true,
      };
    }
  };
}

/**
 * Async phone validator for server-side validation if needed
 */
export function createAsyncPhoneValidator(phoneService: PhoneService): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      // Simulate async validation (could be API call)
      setTimeout(() => {
        const syncResult = createPhoneValidator(phoneService)(control);
        resolve(syncResult);
      }, 100);
    });
  };
}

/**
 * Validator for phone number with specific country code
 */
export function createPhoneWithCountryValidator(countryCode: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    try {
      const isValid = isValidPhoneNumber(control.value, countryCode as any);

      if (!isValid) {
        return {
          phoneInvalidForCountry: `Invalid phone number for ${countryCode}`,
          countryCode,
        };
      }

      return null;
    } catch (error) {
      return { phoneInvalid: 'Invalid phone number format' };
    }
  };
}

/**
 * Validator to check if phone number is from allowed countries
 */
export function createPhoneCountryValidator(allowedCountries: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    try {
      const phoneNumber = parsePhoneNumber(control.value);

      if (!phoneNumber) {
        return { phoneInvalid: 'Invalid phone number format' };
      }

      const countryCode = phoneNumber.country;

      if (!countryCode || !allowedCountries.includes(countryCode)) {
        return {
          phoneCountryNotAllowed: `Phone number from ${countryCode} is not allowed`,
          allowedCountries,
          detectedCountry: countryCode,
        };
      }

      return null;
    } catch (error) {
      return { phoneInvalid: 'Invalid phone number format' };
    }
  };
}

/**
 * Error message helper for phone validation errors
 */
export function getPhoneErrorMessage(error: any): string {
  switch (Object.keys(error)[0]) {
    case 'phoneCountryRequired':
      return 'Please select a country';
    case 'phoneRequired':
      return 'Phone number is required';
    case 'phoneInvalid':
      return error.phoneInvalid || 'Invalid phone number format';
    case 'phoneInvalidForCountry':
      return error.phoneInvalidForCountry || 'Invalid phone number for selected country';
    case 'phoneCountryNotAllowed':
      return `Phone numbers from ${error.detectedCountry} are not supported`;
    case 'phoneError':
      return 'Error validating phone number';
    default:
      return 'Invalid phone number';
  }
}
