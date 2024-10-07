import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() searchPokemonName = new EventEmitter<string>();
  pokemonName: string = '';
  
  
    emitName() {
      this.searchPokemonName.emit(this.pokemonName);
      // console.log('its worked', this.pokemonName)
      // debugger;
    }
}
