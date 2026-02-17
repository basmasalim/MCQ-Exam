import { CountryCode } from 'libphonenumber-js';

export interface PhoneCountry {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  flags: {
    svg: string;
    png: string;
    alt: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
}

export interface PhoneValidationResult {
  isValid: boolean;
  formattedNumber?: string;
  internationalFormat?: string;
  nationalFormat?: string;
  countryCode?: CountryCode;
  error?: string;
}

export interface PhoneState {
  selectedCountry: PhoneCountry | null;
  phoneNumber: string;
  isValid: boolean;
  validationError: string;
  formattedNumber: string;
}
