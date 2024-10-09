export interface Pokemon {
    sprites: any;
    types: any;
    name: string;
    id: number;
    abilities: PokemonDetails[];
    url: any;
}


export interface PokemonDetails {
    ability: {
        name: string;
        url: any;
    }
}
