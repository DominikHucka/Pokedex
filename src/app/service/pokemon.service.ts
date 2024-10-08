import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  limit: number = 1; // limit ist 1302; 
  offset: number = 0;
  BASE_URL: string = `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`;
  http = inject(HttpClient);
  // URL: string = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';




  fetchAllPokemons(): Observable<any> {
    return this.http.get<any>(this.BASE_URL);
  }


  fetchChar(id: number): Observable<any> {
    const CHAR_URL = `https://pokeapi.co/api/v2/characteristic/${id}`;
    return this.http.get<any>(CHAR_URL);
  }


  loadMorePokemons() {
    this.offset += 20;
  }
}
