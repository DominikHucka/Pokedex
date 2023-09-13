let currentPokemon;
let pokemons;
let allPokemons = []; //sind alle URL von der Pokemon API 
let limit = 0;
let offset = 0;
window.onscroll = function () { scrollFunction() }; // scroll on Top funktion


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
    console.log('load first 334 Pokemons', result);
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


function generateHTMLPokedex(img, name, id, type, color, shadow, j) {
    let flipCard = `flipper-${j}`;
    return /*html*/`
            <div id="${flipCard}" class="pokemon-container">
                ${generateHTMLFrontCard(img, name, id, type, color, shadow, flipCard)}
                ${generateHTMLBackCard(img, name, color, shadow, flipCard)}
            </div>
    `
}


function generateHTMLFrontCard(img, name, id, type, color, shadow, flipCard) {
    return /*html*/`
        <div class="pokemon-card pokemon-card-front ${shadow}">
            <div id="imgContainer" onclick="flipPokemonCard('${flipCard}')" class="pokemon-card-img">
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


function generateHTMLBackCard(img, name, color, shadow, flipCard) {
    return /*html*/`
        <div class="stats-container pokemon-card-back">
            <div class="back-id ${color}">
                <div class="back-card-header">
                    <h2>${name}</h2>
                    <img onclick="closePokemonCard('${flipCard}')" class="back-close-pokeball-button" src="img/pokeball.png" alt="close Button Pokeball">
                </div>
                <img class="back-img" src="${img}" alt="">
            </div>   
                <table>
                    <tr class="${shadow}">
                        <td>${currentPokemon['stats']['0']['stat']['name']}</td>
                        <td class="stat-color">${currentPokemon['stats']['0']['base_stat']}</td>
                    </tr>
                    <tr class="${shadow}">
                        <td>${currentPokemon['stats']['1']['stat']['name']}</td>
                        <td class="stat-color">${currentPokemon['stats']['1']['base_stat']}</td>
                    </tr>
                    <tr class="${shadow}">
                        <td>${currentPokemon['stats']['2']['stat']['name']}</td>
                        <td class="stat-color">${currentPokemon['stats']['2']['base_stat']}</td>
                    </tr>
                    <tr class="${shadow}">
                        <td>${currentPokemon['stats']['3']['stat']['name']}</td>
                        <td class="stat-color">${currentPokemon['stats']['3']['base_stat']}</td>
                    </tr>
                    <tr class="${shadow}">
                        <td>${currentPokemon['stats']['4']['stat']['name']}</td>
                        <td class="stat-color">${currentPokemon['stats']['4']['base_stat']}</td>
                    </tr>
                </table>
        </div>
    `
}


function loadMorePokemon() {
    offset += 34; // Globale Variable ladet immer 34 neue Pokemons
    allPokemons = []; // Liste wird vor dem  Laden einmal zurückgesetzt, nun können die neuen Pokemons geladen werden
    loadAllPokemons();
}


function flipPokemonCard(flipCard) {
    let flipPokemonCart = document.getElementById(`${flipCard}`);
    if (flipPokemonCart) {
        flipPokemonCart.style.transition = "1.5s";
        flipPokemonCart.style.transform = "scale(1.5) translateY(-50%)";
        flipPokemonCart.style.zIndex = "9999";
        setTimeout(() => {
            flipPokemonCart.style.transform = "scale(1.5) rotate3D(0, 1, 0, 90deg)";
            flipPokemonCart.style.zIndex = "9999";
            flipPokemonCart.style.position = "fixed";
        }, 800);
        setTimeout(() => {
            flipPokemonCart.style.transform = "scale(1.5) rotate3D(0, 1, 0, 180deg)";
            flipPokemonCart.style.zIndex = "9999";
            flipPokemonCart.style.position = "fixed";
        }, 800);
    }
    flipCardOncklickDisable(flipCard);
}


function flipCardOncklickDisable(flipCard) {
    if (flipCard) {
        document.getElementById('imgContainer').disabled = true;
    } else {
        document.getElementById('imgContainer').disabled = false;
    }
}


function scrollFunction() {
    let scrollOnTOP = document.getElementById('scrollToTopButton');

    if (scrollOnTOP) {
        scrollOnTOP.style.display = "block";
    }
}


function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


function closePokemonCard(flipCard) {
    let flipPokemonCart = document.getElementById(`${flipCard}`);
    if (flipPokemonCart) {
        flipPokemonCart.style.transition = "1.5s";
        flipPokemonCart.style.transform = "scale(1) rotate3D(0, 1, 0, 0deg)";
        flipPokemonCart.style.zIndex = "auto";
        flipPokemonCart.style.position = "static";
    }
}




// function renderPokemonInformation(j) {
//     let pokemon = currentPokemon;
//     document.getElementById('pokemonImage').src = pokemon.sprites.other['official-artwork'].front_default;
//     document.getElementById('pokemonName').innerHTML = pokemon.forms[0].name.charAt(0).toUpperCase() + pokemon.forms[0].name.slice(1);
//     document.getElementById('pokemonId').innerHTML = pokemon.id;
//     document.getElementById('pokemonType').innerHTML = pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1);
//     // document.getElementById('typeColor').innerHTML = `bg-${pokemonType.toLowerCase()}`;
//     for (let k = 0; k < currentPokemon.length; k++) {
//         let pokemon = currentPokemon[k];
//         document.getElementById('pokedex').innerHTML += pokemon;
//     }
// let shadowClass = `shadow-${pokemonType.toLowerCase()}`;
// document.getElementById('typeColor').innerHTML = `${colors}`;
// document.getElementById('bgShadow').innerHTML = pokemonType.toLowerCase();
// document.getElementById('pokedex').innerHTML += pokedex;
// }