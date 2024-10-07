import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { SearchComponent } from '../search/search.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule,
    SearchComponent,
    PokemonCardComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent {
  pokemonData: any[] = [];
  filteredPokemon: any[] = [];
  baseData: any;
  pokemon: any;
  currentPokemon: any = null;
  private pokemonService = inject(PokemonService);
  private http = inject(HttpClient);
  slideIn: boolean = false;
  isLoading: boolean = false;


  ngOnInit() {
    setTimeout(() => {
      this.loadAllPokemons()
    }, 200);
  }


  loadAllPokemons() {
    this.pokemonService.fetchAllPokemons().subscribe((pokemons: any) => {
      this.baseData = pokemons;
      let result = this.baseData.results;
      for (let i = 0; i < result.length; i++) {
        const results = result[i];
        this.fetchPokemonUrl(results);
      }
    }, (error) => {
      console.log('fetch data failed', error);
    })
  }


  fetchPokemonUrl(results: any) {
    this.http.get(results.url).subscribe((url) => {
      this.pokemonData.push(url);
      // console.log(url);
      this.filteredPokemon = [...this.pokemonData];
    }, (error) => {
      console.log('fetch data failed', error);
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
    this.slideIn = slideIn;
  }
}
