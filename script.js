let currentPokemon;
let pokemons;
let allPokemons = []; //sind alle URL von der Pokemon API 
let pokemonStats = []; //ladet alle stats aus den pokemon
let limit = 34;
let offset = 0;


async function init() {
    await includeHTML();
    loadAllPokemons();
    await loadPokemon();
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
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`; // API limit auf 33 gesetzt 
    let response = await fetch(url); //ladet die API runter (aller Pokemons)
    pokemons = await response.json(); //wandelt das in eine JSON um
    let result = pokemons['results']; //results ist ein Array in der API
    loadPokemonId(result);
    loadPokemon();
}


function loadPokemonId(result) {
    for (let i = 0; i < result.length; i++) { //ist ein Array aus der Function loadAllPokemons - hier habe ich die Max zahl in einem Array hinterlegt
        let pokemon = result[i];
        let url = pokemon['url'];//wird auf die URL in dem ARRAY results zugegriffen
        allPokemons.push(url); //wird in die Array allPokemonUrl gepusht
    }
}


async function loadPokemon() {
    for (let j = 0; j < allPokemons.length; j++) {
        let pokemonCurentUrl = allPokemons[j];
        let response = await fetch(pokemonCurentUrl);// ladet die URL aus dem Array 
        currentPokemon = await response.json();
        console.log('show Pokemon', currentPokemon);
        renderPokemonInformation(j);
    }
}


function renderPokemonInformation(j) {
    let pokemon = currentPokemon;
    let pokemonImage = pokemon.sprites.other['official-artwork'].front_default;
    let pokemonName = pokemon.forms[0].name.charAt(0).toUpperCase() + pokemon.forms[0].name.slice(1);
    let pokemonId = pokemon.id;
    let pokemonType = pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1);
    let backgroundColorClass = `bg-${pokemonType.toLowerCase()}`;
    let shadowClass = `shadow-${pokemonType.toLowerCase()}`;
    
    document.getElementById('pokedex').innerHTML += generateHTMLPokedex(pokemonImage, pokemonName, pokemonId, pokemonType, backgroundColorClass, shadowClass, j);
}


// function generateHTMLPokedex(img, name, id, type, color, shadow, j) {
//     const cardId = `card-${j}`;

//     return /*html*/`
//         <div class="pokemon-card-container" id="${cardId}">
//             <div class="pokemon-card pokemon-card-front ${shadow}">
//                 <div class="pokemon-card-img">
//                     <img src="${img}" alt="Pokemon Image">
//                 </div>
//                 <div class="pokemon-card-information">
//                     <p class="pokemon-id"># ${id}</p>
//                     <h3>${name}</h3>
//                     <div class="pokemon-card-type ${color}">
//                         <p>${type}</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="pokemon-card pokemon-card-back">
//                 <div class="backId">
//                     <h2>${name}</h2>
//                     <img class="back-img" src="${img}" alt="">
//                     <div class="stats">
//                         <!-- Hier kannst du die Statistiken einfügen -->
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Funktion zum Umschalten zwischen Vorder- und Rückseite
// function flipPokemonCard(cardId) {
//     const card = document.getElementById(cardId);
//     if (card) {
//         card.classList.toggle('flipped');
//     }
// }


function generateHTMLPokedex(img, name, id, type, color, shadow, j) {
    let flippCart = `flipper-${j}`;
    // const backfaceId = `backface-${j}`;
    return /*html*/`
            <div id="${flippCart}" class="pokemon-container">
                <div class="pokemon-card pokemon-card-front ${shadow}">
                    <div onclick="flipPokemonCart('${flippCart}')" class="pokemon-card-img">
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
                <div class="stats-container pokemon-card-back ${color}">
                    <div class="back-id">
                        <h2>${name}</h2>
                        <img class="back-img" src="${img}" alt="">
                    </div>   
                    <div class="stats">
                        <p>${pokemonStats}</p>
                    </div>
                </div>
            </div>
    `
}


function loadMorePokemon() {
    offset += 34; // Globale Variable ladet immer 34 neue Pokemons
    allPokemons = []; // Liste wird vor dem  Laden einmal zurückgesetzt, nun können die neuen Pokemons geladen werden
    loadAllPokemons();
}


function flipPokemonCart(flipper) {
    let flipCard = document.getElementById(`${flipper}`);
    if (flipCard) {
        flipCard.style.transition = "2s";
        flipCard.style.transform = "scale(1.5) rotate3D(0, 1, 0, 180deg) translateX(-20%)";
        flipCard.style.zIndex = "9999";
        flipCard.style.position = "fixed";
    }
}


// function showBackSide(backfaceId) {
//     let styleBackId = document.getElementById(`${backfaceId}`);
//     if (styleBackId) {
//         styleBackId.style.backfaceVisibility = "visibile";
//         styleBackId.style.backgroundColor = "black";
//     }
    
// }


