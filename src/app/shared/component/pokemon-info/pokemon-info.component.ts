import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule
  ],
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.scss'
})
export class PokemonInfoComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  @Input() pokemon: any;


  abilities: any[] = [];
  species: any[] = [];
  url = {
      species: "https://pokeapi.co/api/v2/pokemon-species",
      abilities: "https://pokeapi.co/api/v2/ability",
    }
  


  ngOnInit(): void {
    this.loadAbilities();
    this.loadSpecies();
  }


  loadSpecies() {
    this.pokemonService.fetchAPI(`${this.url.species}/${this.pokemon.id}/`)
      .subscribe((result) => {
        this.species.push(result);
      }); 
  }


  loadAbilities() {
    this.pokemonService.fetchAPI(`${this.url.abilities}/${this.pokemon.id}/`)
    .subscribe((result) => {
      this.abilities.push(result);
    }); 
  }
}
