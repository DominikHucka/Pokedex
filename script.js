let currentPokemonName = [];
let currentPokemon;
let pokemons;
let allPokemons = []; //sind alle URL von der Pokemon API 
let limit = 5;
let offset = 0;
window.onscroll = function () { scrollFunction() }; // scroll on Top funktion


async function init() {
    await includeHTML();
    await loadAllPokemons();
    await loadPokemon();
    updateProgressBar();
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
    try {
        let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`; // API limit auf 33 gesetzt 
        let response = await fetch(url); //ladet die API runter (aller Pokemons)
        pokemons = await response.json(); //wandelt das in eine JSON um
        let result = pokemons['results']; //results ist ein Array in der API
        console.log('load first 34 Pokemons', result);
        loadPokemonId(result);
    } catch (error) {
        console.log('Fehler beim laden der Pokemon Liste');
    }
    
}


function loadPokemonId(result) {
    for (let i = 0; i < result.length; i++) { //ist ein Array aus der Function loadAllPokemons - hier habe ich die Max zahl in einem Array hinterlegt
        let pokemon = result[i];
        let url = pokemon['url'];//wird auf die URL in dem ARRAY results zugegriffen
        allPokemons.push(url); //wird in die Array allPokemonUrl gepusht
    }
}


async function loadPokemon() {
    try {
        for (let j = offset; j < allPokemons.length; j++) {
            let pokemonCurrentUrl = allPokemons[j];
            let response = await fetch(pokemonCurrentUrl);// ladet die URL aus dem Array 
            currentPokemon = await response.json();
            currentPokemonName.push(currentPokemon);
            console.log('pokemons', currentPokemon);
            renderPokemonInformation(j);
        }
    } catch (error) {
        console.log('Fehler beim laden der Pokemons');
    }
}


function renderPokemonInformation(j) {
    let pokemon = currentPokemonName[j]
    let pokemonImage = pokemon['sprites']['other']['official-artwork']['front_default'];
    let pokemonName = pokemon['forms']['0']['name'].charAt(0).toUpperCase() + pokemon['forms']['0']['name'].slice(1);
    let pokemonId = pokemon['id'].toString().padStart(4, '0');
    let pokemonType = pokemon['types']['0']['type']['name'].charAt(0).toUpperCase() + pokemon['types']['0']['type']['name'].slice(1);
    let backgroundColorClass = `bg-${pokemonType.toLowerCase()}`;
    let shadowClass = `shadow-${pokemonType.toLowerCase()}`;
    document.getElementById('pokedex').innerHTML += generateHTMLPokedex(pokemonImage, pokemonName, pokemonId, pokemonType, backgroundColorClass, shadowClass, j);
    // showInformation(`about-0`, `aboutButton-0`);
}


function loadMorePokemon() {
    offset += 5;
    init();
}


function generateHTMLPokedex(img, name, id, type, color, shadow, j) {
    let flipCard = `flipper-${j}`;
    return /*html*/`
                <div id="${flipCard}" class="pokemon-container">
                    ${generateHTMLFrontCard(img, name, id, type, color, shadow, flipCard)}
                    ${generateHTMLBackCard(img, name, color, shadow, flipCard, j)}
                </div>
    `;
}


function generateHTMLFrontCard(img, name, id, type, color, shadow, flipCard) {
    return /*html*/`
        <div class="pokemon-card pokemon-card-front ${shadow}">
            <div id="openCard" onclick="openPokemonCard('${flipCard}')" class="pokemon-card-img">
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


function generateHTMLBackCard(img, name, color, shadow, flipCard, j) {
    let about = `about-${j}`;
    let baseStats = `baseStats-${j}`;
    let aboutButton = `aboutButton-${j}`;
    let baseStatsButton = `baseStatsButton-${j}`;
    return /*html*/`
        <div class="stats-container pokemon-card-back">
            <div class="back-id ${color}">
                <div class="back-card-header">
                    <h2>${name}</h2>
                    <img onclick="closePokemonCard('${flipCard}')" class="back-close-pokeball-button" src="img/pokeball.png" alt="close Button Pokeball">
                </div>
                <img class="back-img" src="${img}" alt="">
            </div> 
                <div class="back-category">
                    <button id="${aboutButton}" class="show-stats-button" onclick="showInformation('${about}', '${aboutButton}')">About</button>
                    <button id="${baseStatsButton}" class="show-stats-button" onclick="showInformation('${baseStats}', '${baseStatsButton}')">Base Stats</button>
                </div>
                ${generateHTMLBackCardStats(shadow, baseStats, j)}
                ${generateHTMLBackCardAbout(about)}
        </div>
    `
}




function generateHTMLBackCardAbout(about) {
    return /*html*/`
        <table id="${about}" class="back-div back-div-about">
            <tr>
                <td><b>Name:</b></td>
                <td>${currentPokemon['forms']['0']['name'].charAt(0).toUpperCase() + currentPokemon['forms']['0']['name'].slice(1)}</td>
            </tr>
            <tr>
                <td><b>Weight:</b></td>
                <td>${(currentPokemon['weight'] / 10).toFixed(1).replace(".", ",")} Kg</td>
            </tr>
            <tr>
                <td><b>Types:</b></td>
                <td>${currentPokemon['types']['0']['type']['name'].charAt(0).toUpperCase() + currentPokemon['types']['0']['type']['name'].slice(1)}</td>
            </tr>
            <tr>
                <td><b>Abilities:</b></td>
                <td>${currentPokemon['abilities']['0']['ability']['name']}</td>
            </tr>
        </table>
    `
}


function updateProgressBar() {
    for (let j = 0; j < currentPokemonName.length; j++) {
        let pokemon = currentPokemonName[j];
        for (let m = 0; m < 5; m++) {
            const stat = pokemon['stats'][m]['base_stat'];
            const calc = (stat / 150) * 100;
            const progressBarId = `progressBar0${j}${m + 1}`;
            
            document.getElementById(progressBarId).style.width = `${calc}%`;
            document.getElementById(progressBarId).innerHTML = `${calc.toFixed(1)}%`;
        }
    }
}


function generateHTMLBackCardStats(shadow, baseStats, j) {
    return /*html*/`
        <table id="${baseStats}" class="back-div d-none back-div-baseStats">
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['0']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['0']['stat']['name'].slice(1)}</td>
                <td class="progress-style"><div class="progress">
                    <div id="progressBar0${j}1" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150">25%</div>
                </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['1']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['1']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                <div class="progress">
                    <div id="progressBar0${j}2" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150">25%</div>
                </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['2']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['2']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                <div class="progress">
                    <div id="progressBar0${j}3" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150">25%</div>
                </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['3']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['3']['stat']['name'].slice(1)}</td>
                <td class="progress-style"><div class="progress">
                    <div id="progressBar0${j}4" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150">25%</div>
                </div></td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['4']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['4']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                <div class="progress">
                    <div id="progressBar0${j}5" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150">25%</div>
                </div>
                </td>
            </tr>
        </table>
    `;
}


function showInformation(information, button) {
    document.querySelectorAll('.back-div').forEach(function (dNone) {
        dNone.classList.add('d-none');
});
    document.querySelectorAll('.show-stats-button').forEach(function (btnStyle) {
        btnStyle.classList.remove('active');
        btnStyle.style.backgroundColor = "#fff";
        btnStyle.style.color = "black";
        btnStyle.style.transform = "scale(1)";
});

    let info = document.getElementById(information);
    let btn = document.getElementById(button);
    

    if (info && btn) {
        info.classList.remove('d-none');
        btn.classList.add('active');
        btn.style.transition = "225ms";
        btn.style.transform = "scale(1.1)";
        btn.style.backgroundColor = "#ffcc01";
        btn.style.color = "#375ca9";
    }; 
}


function openPokemonCard(flipCard) {
    let flipPokemonCard = document.getElementById(`${flipCard}`);

    if (flipPokemonCard) {
        flipPokemonCard.style.transition = "1.5s";
        flipPokemonCard.style.transform = "scale(1) translateY(-50%)";
        flipPokemonCard.style.zIndex = "10";
        flipPokemonCard.style.position = "static";
        setTimeout(() => {
            flipPokemonCard.style.transform = "scale(1.2) rotate3D(0, 1, 0, 45deg)";
            flipPokemonCard.style.zIndex = "10";
            flipPokemonCard.style.position = "static";
        }, 800);
        setTimeout(() => {
            flipPokemonCard.style.transform = "scale(1.5) rotate3D(0, 1, 0, 90deg)";
            flipPokemonCard.style.zIndex = "10";
            flipPokemonCard.style.position = "fixed";
            flipPokemonCard.style.top = "20vh";
        }, 800);
        setTimeout(() => {
            flipPokemonCard.style.transform = "scale(1.5) rotate3D(0, 1, 0, 180deg)";
            flipPokemonCard.style.zIndex = "10";
            flipPokemonCard.style.position = "fixed";
            flipPokemonCard.style.top = "20vh";
        }, 800);
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
        flipPokemonCart.style.transition = "1s";
        flipPokemonCart.style.transform = "scale(1) rotate3D(0, 1, 0, 0deg)";
        flipPokemonCart.style.zIndex = "auto";
        flipPokemonCart.style.position = "static";
    }
}


function searchPokemon() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    let pokedexContainer = document.getElementById('pokedex');
    pokedexContainer.innerHTML = '';

    for (let k = 0; k < currentPokemonName.length; k++) {
        let pokemonName = currentPokemonName[k]['forms']['0']['name'];
        if (pokemonName.toLowerCase().includes(search)) {
            renderPokemonInformation(k);
        }
    }
}
