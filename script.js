const characters = [
{
    name: "リュウ",

    classic:{
        combo:"立ち中P → 屈中P → 波動拳",
        super:"真空波動拳"
    },

    modern:{
        combo:"アシストコンボ中",
        super:"必殺技ボタン + 強"
    }
},

{
    name:"ケン",

    classic:{
        combo:"屈中K → 迅雷脚",
        super:"疾風迅雷脚"
    },

    modern:{
        combo:"アシストコンボ強",
        super:"必殺技ボタン + 強"
    }
}
];

const list = document.getElementById("characterList");
const detail = document.getElementById("detail");

characters.forEach(character => {

    const div = document.createElement("div");
    div.className = "character";
    div.textContent = character.name;

    div.onclick = () => {

        detail.innerHTML = `
            <h2>${character.name}</h2>

            <button onclick="showStyle('${character.name}','classic')">
                クラシック
            </button>

            <button onclick="showStyle('${character.name}','modern')">
                モダン
            </button>

            <div id="styleInfo"></div>
        `;
    };

    list.appendChild(div);
});


function showStyle(name, type){

    const character = characters.find(c => c.name === name);

    const data = character[type];

    document.getElementById("styleInfo").innerHTML = `
        <h3>${type === 'classic' ? 'クラシック' : 'モダン'}</h3>

        <p>コンボ：${data.combo}</p>

        <p>SA：${data.super}</p>
    `;
}