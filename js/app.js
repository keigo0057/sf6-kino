const hamburger =
document.getElementById("hamburger");

const sidebar =
document.getElementById("sidebar");

const characterList =
document.getElementById("characterList");



hamburger.onclick = ()=>{

    sidebar.classList.toggle("open");

};




async function loadCharacters(){

    const response =
    await fetch("./data/characters.json");


    const characters =
    await response.json();


    renderCharacterList(
        characters
    );

}



function renderCharacterList(characters){

    characterList.innerHTML="";


    characters.forEach(character=>{


        const div =
        document.createElement("div");


        div.className=
        "characterCard";


        div.textContent=
        character.name;



        div.dataset.id=
        character.id;



        characterList.appendChild(div);



    });



}



loadCharacters();