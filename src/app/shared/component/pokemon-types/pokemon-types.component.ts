import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PokemonService } from '../../../service/pokemon.service';

@Component({
  selector: 'app-pokemon-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-types.component.html',
  styleUrl: './pokemon-types.component.scss'
})
export class PokemonTypesComponent implements OnInit {
  @Input() pokemon: any;
  pokemonService = inject(PokemonService);
  types: any[] = [];
  totalPokemonId = 1;

  ngOnInit(): void {
    this.loadTypes();
    this.test();
  }


  test() {
    if (this.pokemon) {
      return console.log('finished');
    } else {
      return console.log('Error');
    }
  }


  requestOfTypes(param: any) {
    forkJoin(param).subscribe((response: any) => {
      this.types = response;
      console.log('types', this.types);
    }, (error) => {
      console.error('Error fetching abilities:', error);
    });
  }


  loadTypes() {
    for (let i = 1; i <= this.totalPokemonId; i++) {
      let request = this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/type/${i}/`);
      this.requestOfTypes(request);
    }
  }
}
