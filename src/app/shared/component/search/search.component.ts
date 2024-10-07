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
  
  
    emitName(event: any) {
      const pokemonName = event.target.value;
      this.searchPokemonName.emit(pokemonName);
    }
}
