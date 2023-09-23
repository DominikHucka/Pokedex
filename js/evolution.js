let evolution = 2;
let loadEvolution = [];


async function loadEvolution() {
    try {
        let url = `https://pokeapi.co/api/v2/evolution-chain/${evolution}/`;
        let response = await fetch(url);
        loadEvolution = await response.json(); 
        console.log('showResponse', loadEvolution);
    } catch (error) {
        console.log('fehler');
    }
}