const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

const characterList =
document.getElementById("characterList");

const detailArea =
document.getElementById("detailArea");


let characters=[];



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

src="${character.image}"

>


<h2>

${character.name}

</h2>


<button id="favoriteBtn">

お気に入り

</button>


<p>

${character.description}

</p>



`;




document
.getElementById("favoriteBtn")

.onclick=()=>{


toggleFavorite(character.id);


renderCharacterList();


showCharacter(character);



};



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