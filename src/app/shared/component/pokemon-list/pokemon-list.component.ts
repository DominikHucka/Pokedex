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
  currentPokemon: any;
  baseData: any;
  limitPokemon: any;
  private pokemonService = inject(PokemonService);
  private http = inject(HttpClient);


  ngOnInit() {
    setTimeout(() => {
      this.loadAllPokemons()
    }, 500);

  }


  loadAllPokemons() {
    this.pokemonService.fetchAllPokemons().subscribe((pokemons: any) => {
      this.baseData = pokemons;
      let result = this.baseData.results;
      for (let i = 0; i < result.length; i++) {
        const results = result[i];
        // console.log('show all Pokemons', results);
        // this.filterPokemonName(results);
        this.fetchPokemonUrl(results);
      }
    }, (error) => {
      console.log('fetch data failed', error);
    })
  }


  fetchPokemonUrl(results: any) {
    this.http.get(results.url).subscribe((url) => {
      this.currentPokemon = url;
      this.pokemonData.push(this.currentPokemon);
      // console.log(this.currentPokemon);
    }, (error) => {
      console.log('fetch data failed', error);
    })
  }


  // testFromChild(name: string ){
  //   console.log(name);
  // }


  // filterPokemonName(results: any) {
  //   results.filter((pokemon: any) => pokemon.name.toLowerCase().include())
  // }


  searchPokemon(name: string) {
    const filteredName = this.currentPokemon.name.filter((pokemon: string) => pokemon);
    filteredName.toLowerCase().include(name);
    
    console.log(filteredName);
    debugger;
    
  }


  getBgClass(typeName: string): string {
    return typeName ? `bg-${typeName.toLowerCase()}` : '';
  }


  getShadowClass(typeName: string): string {
    return typeName ? `shadow-${typeName.toLowerCase()}` : '';
  }
}
