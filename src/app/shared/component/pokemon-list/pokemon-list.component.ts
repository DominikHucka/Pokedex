import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { SearchComponent } from '../search/search.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { forkJoin } from 'rxjs';

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
  pokemonChar: any;
  characteristic: any[] = [];
  totalCharacteristics: number = 10;


  ngOnInit() {
    setTimeout(() => {
      this.loadAllPokemons();
      this.loadCharInfos();
      // this.pushCharToArray();
    }, 200);
  }


  loadAllPokemons() {
    this.pokemonService.fetchAllPokemons().subscribe((pokemons: any) => {
      this.baseData = pokemons;
      let result = this.baseData.results;
      // console.log('base-Url', result);
      for (let i = 0; i < result.length; i++) {
        let results = result[i];
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

// DOKUMENTATION NOCH DURCHFÜHREN IN NOTION FÜR JOINFROK //


  loadCharInfos() {
    const requests = [];
  
    for (let j = 1; j <= this.totalCharacteristics; j++) {
      requests.push(this.pokemonService.fetchChar(j)); 
    }
  
    forkJoin(requests).subscribe((results: any[]) => {
      this.characteristic = results; 
      console.log('show characteristic', this.characteristic); 
    }, (error) => {
      console.log('fetch data failed', error);
    });
  }





//   loadCharInfos() {
//     for (let j = 1; j <= this.totalCharacteristics; j++) {
//       const fetched = this.pokemonService.fetchChar(j)
//     }

//   console.log('show characteristic', this.characteristic);
// }



  // loadingChar(results: any) {
  //   this.http.get(results).subscribe((url) => {
  //     this.pokemonChar.push(url);
  //     console.log('show char information', this.pokemonChar);
  //   })
  // }


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
