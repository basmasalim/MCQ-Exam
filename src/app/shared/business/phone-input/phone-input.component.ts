import { Component, Input, signal, computed, inject, effect, HostListener } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { CountryService } from '../../../core/services/country/country.service';
import { ICountry } from '../../../core/interfaces/i-country.interface';

@Component({
  selector: 'app-phone-input',
  imports: [FormField],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.css',
})
export class PhoneInputComponent {
  private countryService = inject(CountryService);

  countries = signal<ICountry[]>([]);
  dropdownOpen = signal(false);
  selectedCountry = signal<ICountry | null>(null);
  searchTerm = signal('');

  @Input({ required: true }) field!: any;
  @Input() label = 'Phone Number';

  // Computed signal for filtered countries
  filteredCountries = computed(() => {
    const countries = this.countries();
    const term = this.searchTerm().toLowerCase();

    if (!term) return countries;

    return countries.filter(
      (country) =>
        country.name.common.toLowerCase().includes(term) ||
        country.cca2.toLowerCase().includes(term),
    );
  });

  constructor() {
    effect(() => {
      const countries = this.countries();
      if (countries.length > 0 && !this.selectedCountry()) {
        // Set Egypt as default country (cca2: EG)
        const egypt = countries.find((country) => country.cca2 === 'EG');
        if (egypt) {
          this.selectedCountry.set(egypt);
        }
      }
    });
  }

  ngOnInit() {
    this.countryService.getCountrys().subscribe((countries) => {
      this.countries.set(countries);
      console.log('countries', countries);
    });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  selectCountry(country: ICountry) {
    this.selectedCountry.set(country);
    this.searchTerm.set(''); // Clear search when selecting a country
    this.dropdownOpen.set(false);
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
}
