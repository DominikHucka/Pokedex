let currentPokemon;
let allPokemons;
let allPokemonUrl = []; //sind alle URL von der Pokemon API 



async function init() {
    await includeHTML();
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
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=33&offset=0'; // API limit auf 30 gesetzt 
    let response = await fetch(url); //ladet die API runter (aller Pokemons)
    allPokemons = await response.json(); //wandelt das in eine JSON um
    console.log('show all Pokemons', allPokemons);
    let result = allPokemons['results']; //results ist ein Array in der API 
    loadUrl(result);
    loadPokemon();
}


function loadUrl(result) {
    for (let i = 0; i < (result.length); i++) { //ist ein Array aus der Function loadAllPokemons - hier habe ich die Max zahl in einem Array hinterlegt
        let pokemon = result[i];
        let url = pokemon['url'];//wird auf die URL in dem ARRAY results zugegriffen
        allPokemonUrl.push(url); //wird in der Array allPokemonUrl gepusht
    }
}


async function loadPokemon() {
    for (let j = 0; j < allPokemonUrl.length; j++) {
        let pokemonUrl = allPokemonUrl[j];
        let response = await fetch(pokemonUrl);// ladet die URL aus dem Array 
        currentPokemon = await response.json();
        console.log('load Pokemon', currentPokemon);
        renderPokemonInformation();
    }   
}


function renderPokemonInformation() {
    let pokemonImage = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pokemonName = currentPokemon['forms']['0']['name'];
    let modifiedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1); //anfangsbuchstaben wird in einen Große umgewandelt
    let pokemonId = currentPokemon['id'];
    let pokemonType = currentPokemon['types']['0']['type']['name'];
    let modifiedType = pokemonType.charAt(0).toUpperCase() + pokemonType.slice(1);
    let backgroundColorClass = `bg-${pokemonType.toLowerCase()}`; // platzhalter für die CSS klasse bg-.....CSS ab Zeile 135
    let shadowClass = `shadow-${pokemonType.toLowerCase()}`;
    document.getElementById('pokedex').innerHTML += generateHTMLPokedex(pokemonImage, modifiedName, pokemonId, modifiedType, backgroundColorClass, shadowClass);
}


function generateHTMLPokedex(img, name, id, type, color, shadow) { 
    return /*html*/`
        <div  class="pokemon-card ${shadow}" >
            <div class="pokemon-card-img">
                <img src="${img}" alt="Pokemon Image">
            </div>
            <div class="pokemon-card-information">
                <p class="pokemon-id"># ${id}</p>
                <h3>${name}</h3>
                <div id="typeColor" class="pokemon-card-type ${color}">
                    <p>${type}</p>
                </div>
            </div>
        </div>
    `
}


async function loadMorePokemon() {
    let loadingNext = allPokemons['next'];
    let response = await fetch(loadingNext);
    allPokemons = await response.json();
    console.log('show Next', allPokemons);
    loadPokemon();
}