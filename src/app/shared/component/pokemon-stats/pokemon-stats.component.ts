import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-pokemon-stats',
  standalone: true,
  imports: [CommonModule,
    BaseChartDirective
  ],
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss'
})
export class PokemonStatsComponent implements OnInit {
  @Input() pokemon: any;
  pokemonStats: number[] = [];
  // stats: any;
  strongMode: string = 'red';
  normalMode: string = 'rgba(0, 123, 255, 0.5)';


  ngOnInit(): void {
    this.generateStats();
  }


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        suggestedMax: 200,
        beginAtZero: true,
        display: false,
      },
      x: {
        ticks: {
          font: {
            size: 10,
            family: 'Arial',
            weight: 'normal',
            style: 'italic',
          },
          color: '#000000',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
        },
      },
      title: {
        display: true,
        text: 'Species-specific strengths',
        font: {
          size: 14,
          family: 'Comic Sans MS',
        },
        color: '#00000',
      },
    }
  }


  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['HP', 'Attack', 'Def.', 'Sp.-Att.', 'Sp.-De.', 'Speed'],
    datasets: [
      {
        label: 'Pokemon Stats',
        data: [] = this.pokemonStats,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: '',
        borderWidth: 1
      }
    ]
  };


  generateStats() {
    for (let i = 0; i < this.pokemon.stats.length; i++) {
      const stats = this.pokemon.stats[i].base_stat;
      this.pokemonStats.push(stats);
    }
  }
}

