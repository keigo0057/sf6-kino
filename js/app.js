const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const characterList = document.getElementById("characterList");
const detailArea = document.getElementById("detailArea");

let characters=[];
let currentStyle="classic";
let currentTab="combo";
let showFavoriteOnly=false;
let currentCharacter = null;

hamburger.onclick=()=>{
    sidebar.classList.toggle("open");
};

const allBtn = document.getElementById("allBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

allBtn.onclick = ()=>{

    showFavoriteOnly = false;
    updateFilterButtons();
    renderCharacterList();

};


favoriteBtn.onclick = ()=>{
    showFavoriteOnly = true;
    updateFilterButtons();
    renderCharacterList();
};

function updateFilterButtons(){

    if(showFavoriteOnly){
        favoriteBtn.classList.add("selected");
        allBtn.classList.remove("selected");
    }
    else{
        allBtn.classList.add("selected");
        favoriteBtn.classList.remove("selected");
    }
}

updateFilterButtons();

async function loadCharacters(){

    const response=
    await fetch("./data/characters.json");

    characters = await response.json();

    renderCharacterList();
}

function renderCharacterList(){

    characterList.innerHTML="";
    const favorites =getFavorites();
    let filtered = characters;


    if (showFavoriteOnly) {
        filtered = filtered.filter(character=>favorites.includes(character.id));
    }

    filtered.forEach(character=>{

        const div =document.createElement("div");
        div.className="characterCard";
        div.dataset.id=character.id;

        const star =favorites.includes(character.id)
        ? "★"
        : "☆";

        div.innerHTML=`
            <span class="favoriteBtn">
                ${star}
            </span>
            ${character.name}
        `;

        const favoriteBtn=div.querySelector(".favoriteBtn");

        favoriteBtn.onclick=(e)=>{
            e.stopPropagation();
            toggleFavorite(character.id);
            renderCharacterList();
        };


        div.onclick=()=>{
            gtag('event', 'select_character', {
            character_name: character.name
            });

            showCharacter(character);
            highlight(character.id);

            if (window.innerWidth<=768){
                sidebar.classList.remove("open");
            }
        };

        characterList.appendChild(div);
    });
}

function showCharacter(character){

    currentCharacter = character;
    const state = getCurrentCharState(character.id);
    currentStyle = state.style;
    currentTab = state.tab;

    detailArea.innerHTML=`

    <img
    class="characterImage"
    src="${character.image}">

    <h2>${character.name}</h2>

    <p>${character.description}</p>

    <div class="styleButtons">
    <button id="classicBtn">
    クラシック
    </button>
    <button id="modernBtn">
    モダン
    </button>
    </div>

    <div class="tabs">
    <button id="comboTab">
    コンボ
    </button>
    <button id="neutralTab">
    立ち回り
    </button>
    <button id="videoTab">
    動画
    </button>
    </div>

    <div id="contentArea">
    </div>
    `;


    document.getElementById("classicBtn").onclick = () => {

        const all = getCharacterState();
        all[currentCharacter.id] = all[currentCharacter.id] || {};
        all[currentCharacter.id].style = "classic";

        saveCharacterState(all);
        currentStyle = "classic";
        updateStyleButtons();
        renderContent(character);
    };

    document.getElementById("modernBtn").onclick = () => {

        const all = getCharacterState(); 
        all[currentCharacter.id] = all[currentCharacter.id] || {};
        all[currentCharacter.id].style = "modern";
        saveCharacterState(all);
        currentStyle = "modern";
        updateStyleButtons();
        renderContent(character);
    };



    document.getElementById("comboTab").onclick=()=>{

        const all = getCharacterState(); 
        all[currentCharacter.id] = all[currentCharacter.id] || {};
        all[currentCharacter.id].tab = "combo";
        saveCharacterState(all);
        currentTab="combo";
        updateTabButtons();
        renderContent(character);

    };



    document.getElementById("neutralTab").onclick=()=>{

        const all = getCharacterState(); 
        all[currentCharacter.id] = all[currentCharacter.id] || {};
        all[currentCharacter.id].tab = "neutral";
        saveCharacterState(all);
        currentTab="neutral";
        updateTabButtons();
        renderContent(character);

    };



    document.getElementById("videoTab").onclick=()=>{

        const all = getCharacterState(); 
        all[currentCharacter.id] = all[currentCharacter.id] || {};
        all[currentCharacter.id].tab = "video";
        saveCharacterState(all);
        currentTab="video";
        updateTabButtons();
        renderContent(character);

    };

    renderContent(character);
    updateTabButtons();
    updateStyleButtons();

}

function updateTabButtons(){
    document.getElementById("comboTab")
        .classList.toggle("selected", currentTab === "combo");

    document.getElementById("neutralTab")
        .classList.toggle("selected", currentTab === "neutral");

    document.getElementById("videoTab")
        .classList.toggle("selected", currentTab === "video");
}

function updateStyleButtons(){

    document.getElementById("classicBtn")
        .classList.toggle("selected", currentStyle === "classic");

    document.getElementById("modernBtn")
        .classList.toggle("selected", currentStyle === "modern");
}

function renderContent(character){

    const content = document.getElementById("contentArea");

    if(currentTab === "combo"){
        content.innerHTML = `
        <h3>コンボ</h3>
        <ul>
        ${character[currentStyle].combos.map(combo => `
            <li>
                <div class="comboText">${combo.text}</div>

                ${combo.routes.map(route => `
                    <div class="comboRoute">
                        ${route.steps
                            .map(step => `
                                <span class="comboStep">
                                    ${step
                                        .map(input => `
                                            <img src="assets/icons/${input}.png"
                                                class="inputIcon">
                                        `)
                                        .join("")}
                                </span>
                            `)
                            .join('<span class="arrow">＞</span>')}
                    </div>
                `).join("")}
            </li>
        `).join("")}
        </ul>
        `;
    }
    else if(currentTab === "neutral"){
        content.innerHTML = `
        <h3>立ち回り</h3>
        <ul>
        ${character[currentStyle].neutral.map(n => `<li>${n}</li>`)
            .join("")
        }
        </ul>
        `;
    }
    else{
        content.innerHTML = `
        <iframe
            width="100%"
            height="400"
            src="${character.youtube}"
            allowfullscreen>
        </iframe>
        `;
    }
}
function highlight(id){
    document.querySelectorAll(".characterCard")
    .forEach(card=>{
        card.classList.remove("selected");

        if(card.dataset.id == id){
            card.classList.add("selected");
        }
    });
}



function getFavorites(){
    return JSON.parse(
    localStorage.getItem(
    "favorites"
    )
    )||[];
}


function toggleFavorite(id){
    let favorites=getFavorites();

    if (favorites.includes(id)) {
        favorites=favorites.filter (f=>f!==id);

        gtag('event', 'favorite_toggle', {
        character_id: id,
        action: 'remove'
        });

    }
    else {
    favorites.push(id);

    gtag('event', 'favorite_toggle', {
    character_id: id,
    action: 'add'
    });
    }

    localStorage.setItem("favorites",JSON.stringify(favorites));
}

function getCharacterState(){
    return JSON.parse(localStorage.getItem("characterState")) || {};
}

function saveCharacterState(state){
    localStorage.setItem("characterState", JSON.stringify(state));
}

function getCurrentCharState(id){
    const all = getCharacterState();
    return all[id] || {
        style: "classic",
        tab: "combo"
    };
}

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = endX - startX;
    const diffY = Math.abs(endY - startY);

    // 縦スクロールなら無視
    if (diffY > 50) return;

    // 左端30px以内から右へ80px以上スワイプ
    if (startX < window.innerWidth * 0.5 && diffX > 40) {
    sidebar.classList.add("open");

    // メニューが開いているとき、左へ80px以上スワイプで閉じる
    if (sidebar.classList.contains("open") && diffX < -80) {
        sidebar.classList.remove("open");
    }
}});

document.addEventListener("click", (e) => {
    if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        e.target !== hamburger
    ) {
        sidebar.classList.remove("open");
    }
});

loadCharacters();