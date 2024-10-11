import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';

@Component({
  selector: 'app-pokemon-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-types.component.html',
  styleUrl: './pokemon-types.component.scss'
})
export class PokemonTypesComponent {
  @Input() pokemon: any;
  pokemonService = inject(PokemonService);
  types: any[] = [];
  url: string = 'https://pokeapi.co/api/v2/type';
 


  ngOnInit(): void {
    this.loadTypes();
  }


  loadTypes() {
    this.pokemonService.fetchAPI(`${this.url}/${this.pokemon.id}`)
    .subscribe((result) => {
      this.types.push(result);
    })
  }
}
