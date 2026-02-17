import {
  Component,
  Input,
  signal,
  computed,
  inject,
  effect,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { PhoneService } from './services/phone.service';
import { PhoneCountry } from '../../../core/interfaces/phone-country.interface';

@Component({
  selector: 'app-phone-input',
  imports: [],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.css',
})
export class PhoneInputComponent {
  private phoneService = inject(PhoneService);

  // Computed signals from PhoneService
  countries = this.phoneService.countriesSignal;
  selectedCountry = this.phoneService.selectedCountrySignal;
  phoneNumber = this.phoneService.phoneNumberSignal;
  isValid = this.phoneService.isValidSignal;
  validationError = this.phoneService.validationErrorSignal;
  formattedNumber = this.phoneService.formattedNumberSignal;

  // Local component state
  dropdownOpen = signal(false);
  searchTerm = signal('');

  @Input({ required: true }) field!: any;
  @Input() label = 'Phone Number';

  // Output events for form integration
  @Output() phoneChange = new EventEmitter<string>();
  @Output() phoneValid = new EventEmitter<boolean>();

  // Computed signal for filtered countries
  filteredCountries = computed(() => {
    return this.phoneService.filterCountries(this.searchTerm());
  });

  constructor() {
    // Emit changes when phone number becomes valid
    effect(() => {
      if (this.isValid() && this.formattedNumber()) {
        this.phoneChange.emit(this.formattedNumber());
        this.phoneValid.emit(true);
      } else {
        this.phoneChange.emit('');
        this.phoneValid.emit(false);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  selectCountry(country: PhoneCountry) {
    this.phoneService.selectCountry(country);
    this.searchTerm.set(''); // Clear search when selecting a country
    this.dropdownOpen.set(false);
  }

  onPhoneNumberChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const rawPhone = target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedPhone = this.phoneService.formatPhoneNumber(rawPhone);

    this.phoneService.updatePhoneNumber(formattedPhone);

    // Update input value with formatted number
    target.value = formattedPhone;
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  closeDropdown() {
    this.searchTerm.set(''); // Clear search when closing dropdown
    this.dropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement = target.closest('.relative');

    if (!dropdownElement && this.dropdownOpen()) {
      this.closeDropdown();
    }
  }

  // Helper method to get validation state for UI
  getValidationState(): 'valid' | 'invalid' | 'empty' {
    if (!this.phoneNumber()) return 'empty';
    return this.isValid() ? 'valid' : 'invalid';
  }

  // Helper method to get display phone number
  getDisplayPhoneNumber(): string {
    if (this.isValid() && this.formattedNumber()) {
      return this.formattedNumber();
    }
    const country = this.selectedCountry();
    if (country && this.phoneNumber()) {
      return country.idd.root + this.phoneNumber();
    }
    return this.phoneNumber() || '';
  }
}
