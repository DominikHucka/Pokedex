let allSpecies;


async function loadInformationForEvo() {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon-species/${evolution}`;
        let response = await fetch(url);
        allSpecies = await response.json();
        console.log('show', response);
    } catch (error) {
        console.log('Fehler beim Laden')
    }
}

async function loadInformationForEvolution() {
    
}