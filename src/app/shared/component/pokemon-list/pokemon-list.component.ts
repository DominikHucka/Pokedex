import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { SearchComponent } from '../search/search.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { Pokemon } from '../../../pokemon';
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


  pokemonData: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  baseData: any;
  abilities: Pokemon[] = [];


  currentPokemon: any = null;
  slideIn: boolean = false;
  isLoading: boolean = false;

  
  totalPokemonId: number = 1;
  limit: number = 1;
  offset: number = 0;


  ngOnInit() {
    this.loadAllPokemons();
    this.loadDetails();
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


  loadDetails() {
    const abilityRequests: any[] = [];
  
    for (let i = 1; i <= this.totalPokemonId; i++) {
      const request = this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/ability/${i}/`);
      abilityRequests.push(request);
    }
  
    
    forkJoin(abilityRequests).subscribe((abilities) => {
      this.abilities = abilities; 
      console.log('abilities', this.abilities);
    }, (error) => {
      console.error('Error fetching abilities:', error);
    });
  }


  searchPokemon(name: string) {
    if (name) {
      this.filteredPokemon = this.pokemonData.filter((pokemon: Pokemon) =>
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

