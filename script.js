let currentPokemonName = [];
let currentPokemon;
let pokemons;
let allPokemons = [];
let limit = 20;
let offset = 0;
window.onscroll = function () { scrollFunction() };
window.addEventListener("DOMContentLoaded", loadPokemon, loadMorePokemon);


async function init() {
    await includeHTML();
    await loadAllPokemons();
    await loadPokemon();
    updateProgressBar();
    let loadingScreen = document.getElementById('loadingOverlay');
    loadingScreen.style.display = "none";
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


async function loadAllPokemons() {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
        let response = await fetch(url);
        pokemons = await response.json();
        let result = pokemons['results'];
        loadPokemonId(result);
    } catch (error) {
        console.log('Fehler beim laden der Pokemon Liste');
    }

}


function loadPokemonId(result) {
    for (let i = 0; i < result.length; i++) {
        let pokemon = result[i];
        let url = pokemon['url'];
        allPokemons.push(url);
    }
}


async function loadPokemon() {
    try {
        for (let j = offset; j < allPokemons.length; j++) {
            let pokemonCurrentUrl = allPokemons[j];
            let response = await fetch(pokemonCurrentUrl);
            currentPokemon = await response.json();
            currentPokemonName.push(currentPokemon);
            renderPokemonInformation(j);
        }
    } catch (error) {
        console.log('Fehler beim laden der Pokemons');
    }
}


function showLoadingOverlay() {
    let loadingScreen = document.getElementById('loadingOverlay');
    loadingScreen.style.display = "block";
}


function loadMorePokemon() {
    showLoadingOverlay();
    offset += 20;
    init();
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
}


function generateHTMLPokedex(img, name, id, type, color, shadow, j) {
    let flipCard = `flipper-${j}`;
    return /*html*/`
                <div id="${flipCard}" class="pokemon-container">
                    ${generateHTMLFrontCard(img, name, id, type, color, shadow, flipCard, j)}
                    ${generateHTMLBackCard(img, name, color, shadow, flipCard, j)}
                </div>
    `;
}


function generateHTMLFrontCard(img, name, id, type, color, shadow, flipCard, j) {
    let openCard = `openCard${j}`
    return /*html*/`
        <div class="pokemon-card pokemon-card-front ${shadow}">
            <div id="${openCard}" onclick="openPokemonCard('${flipCard}', '${j}', '${openCard}')" class="pokemon-card-img">
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
                    <button id="aboutButton${j}" class="show-stats-button" onclick="showInformation('aboutButton${j}')">About</button>
                    <button id="baseStatsButton${j}" class="show-stats-button" onclick="showInformation('baseStatsButton${j}')">Base Stats</button>
                </div>
                ${generateHTMLBackCardStats(shadow, j)}
                ${generateHTMLBackCardAbout(j)}
        </div>
    `
}


function generateHTMLBackCardAbout(j) {
    return /*html*/`
        <table id="about${j}" class="back-div back-div-about">
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


function generateHTMLBackCardStats(shadow, j) {
    return /*html*/`
        <table id="baseStats${j}" class="back-div d-none back-div-baseStats">
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['0']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['0']['stat']['name'].slice(1)}</td>
                <td class="progress-style"><div class="progress">
                    <div id="progressBar0${j}1" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="100" aria-valuemin="0" aria-valuemax="150"><p class="progress-bar-text">25%</p></div>
                </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['1']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['1']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                <div class="progress">
                    <div id="progressBar0${j}2" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150"><p class="progress-bar-text">25%</p></div>
                </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['2']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['2']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                <div class="progress">
                    <div id="progressBar0${j}3" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150"><p class="progress-bar-text">25%</p></div>
                </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['3']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['3']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                    <div class="progress">
                        <div id="progressBar0${j}4" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150"><p class="progress-bar-text">25%</p></div>
                    </div>
                </td>
            </tr>
            <tr class="${shadow}">
                <td>${currentPokemon['stats']['4']['stat']['name'].charAt(0).toUpperCase() + currentPokemon['stats']['4']['stat']['name'].slice(1)}</td>
                <td class="progress-style">
                <div class="progress">
                    <div id="progressBar0${j}5" class="progress-bar" role="progressbar" style="width: 25px" aria-valuenow="25" aria-valuemin="0" aria-valuemax="150"><p class="progress-bar-text">25%</p></div>
                </div>
                </td>
            </tr>
        </table>
    `;
}


function showInformation(layout) {
    for (let n = 0; n < currentPokemonName.length; n++) {
        let about = `about${n}`;
        let baseStats = `baseStats${n}`;
        let aboutButton = `aboutButton${n}`;
        let baseStatsButton = `baseStatsButton${n}`

        if (layout == aboutButton) {
            showLayoutAbout(about, baseStats, baseStatsButton, aboutButton);
        }
        if (layout == baseStatsButton) {
            showLayoutBaseStats(about, baseStats, baseStatsButton, aboutButton)
        }
    }
}


function showLayoutAbout(about, baseStats, baseStatsButton, aboutButton) {
    document.getElementById(about).classList.remove('d-none');
    document.getElementById(baseStats).classList.add('d-none');
    document.getElementById(baseStatsButton).classList.remove('btn-yellow');
    document.getElementById(aboutButton).classList.add('btn-yellow');
}


function showLayoutBaseStats(about, baseStats, baseStatsButton, aboutButton) {
    document.getElementById(about).classList.add('d-none');
    document.getElementById(baseStats).classList.remove('d-none');
    document.getElementById(baseStatsButton).classList.add('btn-yellow');
    document.getElementById(aboutButton).classList.remove('btn-yellow');
}


function openPokemonCard(flipCard, j) {
    let flipPokemonCard = document.getElementById(`${flipCard}`);
    let aboutButton = `aboutButton${j}`;
    let about = `about${j}`;
    defaultLayoutAbout(about, aboutButton);
    openPokemonCardAnimation(flipPokemonCard);
}


function defaultLayoutAbout(about, aboutButton) {
    if (about) {
        document.getElementById(aboutButton).classList.add('btn-yellow');
    }
}


function openPokemonCardAnimation(flipPokemonCard) {
    if (flipPokemonCard) {
        firstStepToStyleCard(flipPokemonCard);
        if (window.matchMedia("(max-width: 450px)").matches) {
            mediaQuerysStyleFlip90DEG(flipPokemonCard);
            mediaQuerysStyleFlip180DEG(flipPokemonCard);
            overlayAfterFlipCard();
            overflowHiddenX();
        } else {
            styleFlip90DEG(flipPokemonCard);
            styleFlip180DEG(flipPokemonCard);
            overlayAfterFlipCard();
            overflowHiddenX();
        }
    }
}


function firstStepToStyleCard(flipPokemonCard) {
    flipPokemonCard.style.transition = "1.5s";
    flipPokemonCard.style.transform = "scale(1) translateY(-50%)";
    flipPokemonCard.style.zIndex = "10";
    flipPokemonCard.style.position = "static";
}


function mediaQuerysStyleFlip90DEG(flipPokemonCard) {
    setTimeout(() => {
        flipPokemonCard.style.transform = "scale(1) rotate3D(0, 1, 0, 90deg)";
        flipPokemonCard.style.zIndex = "10";
        flipPokemonCard.style.position = "fixed";
        flipPokemonCard.style.top = "20vh";
    }, 800);
}


function mediaQuerysStyleFlip180DEG(flipPokemonCard) {
    setTimeout(() => {
        flipPokemonCard.style.transform = "scale(1) rotate3D(0, 1, 0, 180deg)";
        flipPokemonCard.style.zIndex = "10";
        flipPokemonCard.style.position = "fixed";
        flipPokemonCard.style.top = "20vh";
    }, 800);
}


function overlayAfterFlipCard() {
    setTimeout(() => {
        document.getElementById('overlayCard').classList.remove('d-none');
    }, 400);
}


function styleFlip90DEG(flipPokemonCard) {
    setTimeout(() => {
        flipPokemonCard.style.transform = "scale(1.5) rotate3D(0, 1, 0, 90deg)";
        flipPokemonCard.style.zIndex = "10";
        flipPokemonCard.style.position = "fixed";
        flipPokemonCard.style.top = "20vh";
    }, 800);
}


function styleFlip180DEG(flipPokemonCard) {
    setTimeout(() => {
        flipPokemonCard.style.transform = "scale(1.5) rotate3D(0, 1, 0, 180deg)";
        flipPokemonCard.style.zIndex = "10";
        flipPokemonCard.style.position = "fixed";
        flipPokemonCard.style.top = "20vh";
    }, 800);
}


function overflowHiddenX() {
    document.getElementById('myBody').classList.add('overflow');
}


function scrollFunction() {
    let scrollOnTOP = document.getElementById('scrollToTopButton');
    let scrollOnBOTTOM = document.getElementById('scrollToBottonButton');
    if (scrollOnTOP && scrollOnBOTTOM) {
        scrollOnTOP.style.display = "block";
        scrollOnBOTTOM.style.display = "block";
    }
}


function bottomFunction() {
    window.scrollTo(0, document.body.scrollHeight);
}


function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


function closePokemonCard(flipCard) {
    let flipPokemonCard = document.getElementById(`${flipCard}`);
    if (flipPokemonCard) {
        closePokemonCardAnimation(flipPokemonCard);
        document.getElementById('overlayCard').classList.add('d-none');
        document.getElementById('myBody').classList.remove('overflow');
    }
}


function closePokemonCardAnimation(flipPokemonCard) {
    flipPokemonCard.style.transition = "1s"
    flipPokemonCard.style.transform = "scale(1) rotate3D(0, 1, 0, 0deg)";
    flipPokemonCard.style.zIndex = "auto";
    flipPokemonCard.style.position = "static";
}


function closeCard() {
    for (let l = 0; l < currentPokemonName.length; l++) {
        let flipPokemonCard = `flipper-${l}`;
        closePokemonCard(flipPokemonCard);
    }
}


function nextPokemon(action, j) {
    let currentFlipCard = `flipper-${j}`;
    let nextFlipCard = `flipper-${j + 1}`;
    let showNextPokemon = `showNextPokemon${j}`;

    if (action == showNextPokemon) {
        closePokemonCard(currentFlipCard);
        if (document.getElementById(nextFlipCard)) {
            setTimeout(() => {
                openPokemonCardAnimation(nextFlipCard);
            }, 800);  
        }
    } 
    // else if (action === 'showPreviousPokemon') {
    //     // Hier können Sie Logik für das Zurückgehen zur vorherigen Karte hinzufügen, wenn nötig.
    // }
}


// function nextPokemon(action, j) {
//     let currentFlipCard = `flipper-${j}`;
//     let nextFlipCard = `flipper-${j}`;
//     nextFlipCard++;
//     let previousFlipCard = `flipper-${j}`;
//     previousFlipCard--;
//     let showNextPokemon = `showNextPokemon${j}`;
    
//     if (action == showNextPokemon) {
//         closePokemonCard(currentFlipCard);
//         if (document.getElementById(nextFlipCard)) {
//             setTimeout(() => {
//                 openPokemonCardAnimation(nextFlipCard);
//             }, 100);
//         }
//         console.log(action);
//     }
// }



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


