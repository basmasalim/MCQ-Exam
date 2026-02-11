import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  base_url: string = 'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags';

  getCountrys() {
    return this.http.get<any[]>(this.base_url);
  }
}
