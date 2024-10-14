import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';

@Component({
  selector: 'app-pokemon-evolution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-evolution.component.html',
  styleUrl: './pokemon-evolution.component.scss'
})
export class PokemonEvolutionComponent implements OnInit {
  @Input() pokemon: any;
  pokemonService = inject(PokemonService);
  url: string = 'https://pokeapi.co/api/v2/evolution-chain';
  evolutions: any[] = [];
  evoOne: any[] = [];
  evoTwo: any[] = [];
  evoThree: any[] = [];
  isLoading: false | undefined;


  ngOnInit(): void {
    this.loadEvolution();
    // this.getPokemonFromEvolution();
  }


  loadEvolution() {
    this.pokemonService.fetchAPI(`${this.url}/${this.pokemon.id}`)
      .subscribe((result) => {
        this.fetchEvoOne(result);
        setTimeout(() => {
          this.fetchEvoTwo(result);
        }, 100);
        setTimeout(() => {
          this.fetchEvoThree(result);
        }, 200);
        
        
        console.log('Evoltuins', this.evolutions);
      })
  }


  fetchEvoOne(result: any) {
    this.pokemonService.fetchAPI(result.chain.species.url)
      .subscribe((details) => {
        this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/pokemon/${details.name}`)
          .subscribe((one) => {
            this.evoOne.push(one);
            console.log('evolution one', one);
          })
      })
  }


  fetchEvoTwo(result: any) {
    this.pokemonService.fetchAPI(result.chain.evolves_to[0].species.url)
      .subscribe((details) => {
        this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/pokemon/${details.name}`)
          .subscribe((two) => {
            this.evoTwo.push(two);
            console.log('evolution two', two);
          })
      })
  }


  fetchEvoThree(result: any) {
    this.pokemonService.fetchAPI(result.chain.evolves_to[0].evolves_to[0].species.url)
      .subscribe((details) => {
        this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/pokemon/${details.name}`)
          .subscribe((three) => {
            this.evoThree.push(three);
            console.log('evolution three', three);
          })
      })
  }
}


