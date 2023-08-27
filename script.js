let currentPokemon;
let allPokemons;
let allPokemonUrl = [];


function init() {
    includeHTML();
    loadAllPokemons();
    loadPokemon();
    
}   


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]'); //  Wir rufen unseren DIV im Index auf 
    for (let i = 0; i < includeElements.length; i++) { // hier iterieren wir alles Obejekte in diesem DIV container sprich alles was in dem Fall im Header Bereich ist 
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");// hier liest er den Wert im Index.Html "includes/header.html" aus. Und wir deieser Varibale file zugeordnet 
        let resp = await fetch(file); // hier laden wir die datei mit fetch 
        if (resp.ok) {
            element.innerHTML = await resp.text(); // hier haben wir jetzt alles in der Variable contetn als Text gespeichert^
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


async function loadAllPokemons() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=20';
    let response = await fetch(url);
    allPokemons = await response.json();
    console.log('load all Pokemons', allPokemons);
    let result = allPokemons['results'];
    renderAllPokemons(result);
}


function renderAllPokemons(result) {
    for (let i = 0; i < result.length; i++) {
        let loadPokemons = result[i];
        allPokemonUrl.push(loadPokemons);
    }
}


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/ditto';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('load Pokemon', currentPokemon);
    renderPokemonInformation();
}



function renderPokemonInformation() {
    let pokemonImage = currentPokemon['sprites']['other']['dream_world']['front_default'];
    let pokemonName = currentPokemon['name'];
    let pokemonId = currentPokemon['id'];
    let pokemonType = currentPokemon['types']['0']['type']['name'];
    document.getElementById('pokedex').innerHTML = '';
    document.getElementById('pokedex').innerHTML += generateHTMLPokedex(pokemonImage, pokemonName, pokemonId, pokemonType);
}


function generateHTMLPokedex(pokemonImage, pokemonName, pokemonId, pokemonType) {
    return /*html*/`
        <div  class="pokemon-card">
            <div class="pokemon-card-img">
                <img src="${pokemonImage}" alt="Pokemon Image">
            </div>
            <div class="pokemon-card-information">
                <p class="pokemon-id">Nr. ${pokemonId}</p>
                <h2>${pokemonName}</h2>
                <div class="pokemon-card-type normal">
                    <p>${pokemonType}</p>
                </div>
            </div>
        </div>
    `
}


