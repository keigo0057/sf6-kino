const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

const characterList =
document.getElementById("characterList");

const detailArea =
document.getElementById("detailArea");


let characters=[];
let currentStyle="classic";
let currentTab="combo";



hamburger.onclick=()=>{

    sidebar.classList.toggle("open");

};



async function loadCharacters(){

    const response=
    await fetch("./data/characters.json");


    characters=
    await response.json();


    renderCharacterList();

}


function renderCharacterList(){

    characterList.innerHTML="";


    characters.forEach(character=>{


        const div=
        document.createElement("div");


        div.className="characterCard";



        const favorites=getFavorites();


        const star=
        favorites.includes(character.id)
        ? "★"
        : "☆";


        div.innerHTML=`

            <span>${star}</span>

            ${character.name}

        `;



        div.onclick=()=>{

            showCharacter(character);


            highlight(character.id);


            if(window.innerWidth<=768){

                sidebar.classList.remove("open");

            }

        };


        characterList.appendChild(div);

    });


}




function showCharacter(character){

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


document
.getElementById("classicBtn")
.onclick=()=>{

currentStyle="classic";

renderContent(character);

};


document
.getElementById("modernBtn")
.onclick=()=>{

currentStyle="modern";

renderContent(character);

};



document
.getElementById("comboTab")
.onclick=()=>{

currentTab="combo";

renderContent(character);

};



document
.getElementById("neutralTab")
.onclick=()=>{

currentTab="neutral";

renderContent(character);

};



document
.getElementById("videoTab")
.onclick=()=>{

currentTab="video";

renderContent(character);

};



renderContent(character);

}

function renderContent(character){

const content=
document.getElementById("contentArea");



if(currentTab==="combo"){


content.innerHTML=`

<h3>コンボ</h3>


<ul>

${character[currentStyle]
.combos

.map(c=>`<li>${c}</li>`)

.join("")}


</ul>

`;

}



else if(currentTab==="neutral"){


content.innerHTML=`

<h3>立ち回り</h3>


<ul>

${character[currentStyle]
.neutral

.map(n=>`<li>${n}</li>`)

.join("")}

</ul>

`;

}



else{


content.innerHTML=`

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


document
.querySelectorAll(".characterCard")


.forEach(card=>{


card.classList.remove("selected");


if(card.textContent.includes(

characters.find(c=>c.id===id).name

)){

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


let favorites=

getFavorites();



if(

favorites.includes(id)

){

favorites=favorites.filter(

f=>f!==id

);

}
else{

favorites.push(id);

}



localStorage.setItem(

"favorites",

JSON.stringify(favorites)

);


}


loadCharacters();