import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../../service/pokemon.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.scss'
})
export class PokemonInfoComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  @Input() pokemon: any;

  
  totalPokemonId: number = 1;
  abilities: any[] = [];
  species: any[] = [];


  ngOnInit(): void {
    this.loadAbilities();
    this.loadSpecies();
  }

  
  requestOfAbilities(param: any) {
    forkJoin(param).subscribe((response: any) => {
      this.abilities = response;
      console.log('abilities', this.abilities);
    }, (error) => {
      console.error('Error fetching abilities:', error);
    });
  }


  requestOfSpecies(param: any) {
    forkJoin(param).subscribe((response: any) => {
      this.species = response;
      console.log('species', this.species);
    }, (error) => {
      console.error('Error fetching abilities:', error);
    });
  }


  loadAbilities() {
    for (let i = 1; i <= this.totalPokemonId; i++) {
      let request = this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/ability/${i}/`);
      this.requestOfAbilities(request);
    }
  }


  loadSpecies() {
    for (let i = 1; i <= this.totalPokemonId; i++) {
      let request = this.pokemonService.fetchAPI(`https://pokeapi.co/api/v2/pokemon-species/${i}/`);
      this.requestOfSpecies(request);
    }
  }
}
