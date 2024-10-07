import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule,
    SearchComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent {
  pokemonData: any[] = [];
  filteredPokemon: any[] = [];
  baseData: any;
  private pokemonService = inject(PokemonService);
  private http = inject(HttpClient);


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


  getBgClass(typeName: string): string {
    return typeName ? `bg-${typeName.toLowerCase()}` : '';
  }


  getShadowClass(typeName: string): string {
    return typeName ? `shadow-${typeName.toLowerCase()}` : '';
  }
}
