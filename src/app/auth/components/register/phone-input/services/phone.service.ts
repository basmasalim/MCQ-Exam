import { Injectable, signal } from '@angular/core';
import {
  getCountries,
  getCountryCallingCode,
  CountryCode,
  parsePhoneNumber,
  isValidPhoneNumber,
  AsYouType,
} from 'libphonenumber-js';
import {
  PhoneCountry,
  PhoneState,
  PhoneValidationResult,
} from '../interfaces/phone-country.interface';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  private readonly DEFAULT_COUNTRY = 'EG' as CountryCode;

  // Signal-based state management
  private countries = signal<PhoneCountry[]>([]);
  private selectedCountry = signal<PhoneCountry | null>(null);
  private phoneNumber = signal('');
  private isValid = signal(false);
  private validationError = signal('');
  private formattedNumber = signal('');

  // Public read-only signals
  public countriesSignal = this.countries.asReadonly();
  public selectedCountrySignal = this.selectedCountry.asReadonly();
  public phoneNumberSignal = this.phoneNumber.asReadonly();
  public isValidSignal = this.isValid.asReadonly();
  public validationErrorSignal = this.validationError.asReadonly();
  public formattedNumberSignal = this.formattedNumber.asReadonly();

  constructor() {
    this.initializeCountries();
  }

  /**
   * Initialize countries using libphonenumber-js
   */
  private initializeCountries(): void {
    const countryCodes = getCountries() as CountryCode[];
    const countriesData: PhoneCountry[] = countryCodes.map((code) => {
      const callingCode = getCountryCallingCode(code);
      return {
        name: {
          common: this.getCountryName(code),
          official: this.getCountryName(code),
        },
        cca2: code,
        flags: {
          svg: `https://flagcdn.com/w320/${code.toLowerCase()}.png`,
          png: `https://flagcdn.com/w320/${code.toLowerCase()}.png`,
          alt: `Flag of ${this.getCountryName(code)}`,
        },
        idd: {
          root: `+${callingCode}`,
          suffixes: [],
        },
      };
    });

    this.countries.set(countriesData);
    this.setDefaultCountry();
  }

  /**
   * Get country name using Intl.DisplayNames
   */
  private getCountryName(code: CountryCode): string {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) || code;
  }

  /**
   * Set default country (Egypt)
   */
  private setDefaultCountry(): void {
    const countries = this.countries();
    const defaultCountry = countries.find((country) => country.cca2 === this.DEFAULT_COUNTRY);
    if (defaultCountry) {
      this.selectedCountry.set(defaultCountry);
    }
  }

  /**
   * Select a country
   */
  public selectCountry(country: PhoneCountry): void {
    this.selectedCountry.set(country);
    this.validatePhoneNumber(); // Re-validate when country changes
  }

  /**
   * Update phone number
   */
  public updatePhoneNumber(phone: string): void {
    this.phoneNumber.set(phone);
    this.validatePhoneNumber();
  }

  /**
   * Validate phone number using libphonenumber-js
   */
  public validatePhoneNumber(): PhoneValidationResult {
    const phone = this.phoneNumber();
    const country = this.selectedCountry();

    if (!phone) {
      this.isValid.set(false);
      this.validationError.set('');
      this.formattedNumber.set('');
      return { isValid: false };
    }

    if (!country) {
      this.isValid.set(false);
      this.validationError.set('Please select a country');
      this.formattedNumber.set('');
      return { isValid: false, error: 'Please select a country' };
    }

    try {
      const fullPhoneNumber = country.idd.root + phone;
      const isValid = isValidPhoneNumber(fullPhoneNumber, country.cca2 as CountryCode);

      this.isValid.set(isValid);

      if (isValid) {
        this.validationError.set('');
        const parsedNumber = parsePhoneNumber(fullPhoneNumber, country.cca2 as CountryCode);
        const formatted = parsedNumber?.formatInternational() || fullPhoneNumber;
        this.formattedNumber.set(formatted);

        return {
          isValid: true,
          formattedNumber: formatted,
          internationalFormat: parsedNumber?.formatInternational(),
          nationalFormat: parsedNumber?.formatNational(),
          countryCode: country.cca2 as CountryCode,
        };
      } else {
        this.validationError.set('Invalid phone number format');
        this.formattedNumber.set('');
        return {
          isValid: false,
          error: 'Invalid phone number format',
        };
      }
    } catch (error) {
      this.isValid.set(false);
      this.validationError.set('Invalid phone number');
      this.formattedNumber.set('');
      return {
        isValid: false,
        error: 'Invalid phone number',
      };
    }
  }

  /**
   * Format phone number as user types
   */
  public formatPhoneNumber(phone: string): string {
    const country = this.selectedCountry();
    if (!country) return phone;

    try {
      const formatter = new AsYouType(country.cca2 as CountryCode);
      return formatter.input(phone);
    } catch {
      return phone;
    }
  }

  /**
   * Get current phone state
   */
  public getPhoneState(): PhoneState {
    return {
      selectedCountry: this.selectedCountry(),
      phoneNumber: this.phoneNumber(),
      isValid: this.isValid(),
      validationError: this.validationError(),
      formattedNumber: this.formattedNumber(),
    };
  }

  /**
   * Reset phone state
   */
  public reset(): void {
    this.phoneNumber.set('');
    this.isValid.set(false);
    this.validationError.set('');
    this.formattedNumber.set('');
  }

  /**
   * Get countries filtered by search term
   */
  public filterCountries(searchTerm: string): PhoneCountry[] {
    const countries = this.countries();
    const term = searchTerm.toLowerCase();

    if (!term) return countries;

    return countries.filter(
      (country) =>
        country.name.common.toLowerCase().includes(term) ||
        country.cca2.toLowerCase().includes(term) ||
        country.idd.root.includes(term),
    );
  }

  /**
   * Get country by code
   */
  public getCountryByCode(code: string): PhoneCountry | undefined {
    return this.countries().find((country) => country.cca2 === code);
  }
}
