import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PokemonService } from '../../service/pokemon.service';


@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
  imports: [CommonModule,
    HttpClientModule
  ]
})

export class PokemonListComponent implements OnInit {

  pokemonData: any[] = [];
  currentPokemon: any;
  baseData: any;
  limitPokemon: any;
  private pokemonService = inject(PokemonService);
  http = inject(HttpClient);


  ngOnInit() {
    setTimeout(() => {
      this.loadAllPokemons()
    }, 1000);
    
  }


  loadAllPokemons()  {
    this.pokemonService.fetchAllPokemons().subscribe((pokemons: any) => {
      this.baseData = pokemons;
      let result = this.baseData.results;
      for (let i = 0; i < result.length; i++) {
        const results = result[i];
        console.log('show all Pokemons', results);
        this.filterPokemonName(results);
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
    }, (error) => {
      console.log('fetch data failed', error);
    })
  }


  filterPokemonName(results: any) {
    this.results.filter()
  }


  getBgClass(typeName: string): string {
    return typeName ? `bg-${typeName.toLowerCase()}` : '';
  }


  getShadowClass(typeName: string): string {
    return typeName ? `shadow-${typeName.toLowerCase()}` : '';
  }
}

