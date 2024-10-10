import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PokemonEvolutionComponent } from '../pokemon-evolution/pokemon-evolution.component';
import { PokemonInfoComponent } from '../pokemon-info/pokemon-info.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';


@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule,
    PokemonEvolutionComponent,
    PokemonInfoComponent,
    PokemonStatsComponent
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent {
  @Input() pokemons: any;

}



