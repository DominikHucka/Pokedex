import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  offset: number = 0;
  private BASE_URL: string = `https://pokeapi.co/api/v2/pokemon?limit=1302&offset={$this.offset}`;
  http = inject(HttpClient);
  url: string = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';




  fetchAllPokemons(): Observable<any> {
    return this.http.get<any>(this.BASE_URL);
  }



  // fetchPokemon() {
  //   return this.http.get(this.url);
  // }


  loadMorePokemons() {
    this.offset += 20;
  }
}
