import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Pokemon } from '../pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  http = inject(HttpClient);


  fetchAPI(url: any): Observable<any> {
    return this.http.get<any>(url);
  }
}
