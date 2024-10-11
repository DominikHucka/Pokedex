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


  ngOnInit(): void {
    this.loadEvolution()
  }


  loadEvolution() {
    this.pokemonService.fetchAPI(`${this.url}/${this.pokemon.id}`)
    .subscribe((result) => {
      this.evolutions.push(result);
      console.log('Evoltuins', this.evolutions);
    })
  }
}
