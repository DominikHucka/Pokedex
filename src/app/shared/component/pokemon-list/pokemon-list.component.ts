import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { SearchComponent } from '../search/search.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule,
    SearchComponent,
    PokemonCardComponent,
    HttpClientModule
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private http = inject(HttpClient);


  pokemonData: any[] = [];
  filteredPokemon: any[] = [];


  baseData: any;
  currentPokemon: any = null;
  pokemonDetails: any = null;
  slideIn: boolean = false;
  isLoading: boolean = false;


  limit: number = 1;
  offset: number = 0;


  ngOnInit(): void {
    this.loadAllPokemons();
  }


  loadAllPokemons() {
    this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`)
    .subscribe((pokemons: any) => {
      this.baseData = pokemons;
      let result = this.baseData.results;
      const pokemonRequest = result.map((pokemon: any) => this.http.get(pokemon.url));
      this.fetchPokemonUrl(pokemonRequest);
    }, (error) => {
      console.log('fetch data failed', error);
    })
  }


  fetchPokemonUrl(request: any) {
    forkJoin(request).subscribe((pokemonArray: any) => {
      this.pokemonData = pokemonArray;
      this.filteredPokemon = [...this.pokemonData];
      console.log('show Pokemon Data', this.pokemonData);
    }, (error) => {
      console.log('fetched failed', error);
    })
  }


  searchPokemon(name: string) {
    if (name) {
      this.filteredPokemon = this.pokemonData.filter((pokemon: any) =>
        pokemon.name.toLowerCase().startsWith(name.toLowerCase())
      );
    } else {
      this.filteredPokemon = [...this.pokemonData];
    }
  }


  openCard(pokemon: any, slideIn: boolean) {
    this.currentPokemon = pokemon;
    setTimeout(() => {
      this.slideIn = slideIn;
    }, 100)
  }
}

