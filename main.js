let status; // question or answer
let index;
let order; // en：英→日 or ja：日→英

let words = [
    {"en":"avoid", "ja":"避ける"},
    {"en":"encourage", "ja":"励ます"},
    {"en":"improve", "ja":"改良する"},
    {"en":"participate", "ja":"参加する"},
    {"en":"behavior", "ja":"行動"},
    {"en":"competition", "ja":"競争"},
    {"en":"superstition", "ja":"迷信"},
    {"en":"variety", "ja":"多様性"},
    {"en":"appropriate", "ja":"適切な"},
    {"en":"comfortable", "ja":"快適な"}
]

const init = () => {
    const loadData = localStorage.getItem("wordbook");
    if (loadData !== null) {
        words = JSON.parse(loadData);
    }
    listWords();
}

const listWords = () => {
    document.getElementById("list").innerHTML = "";
    document.getElementById("list").style.display = "block";
    document.getElementById("wordbook").style.display = "none";

    words.sort((a,b) => {
        let ret = 0;
        if (a.en < b.en) ret = -1;
        else if (a.en > b.en) ret = 1;
        else if ((ret === 0) && (a.ja < b.ja)) ret = -1;
        else if ((ret === 0) && (a.ja >= b.ja)) ret = 1;
        return ret;
    })

    for (const word of words) {
        const tr = document.createElement("tr");
        const delBtnTd = document.createElement("td");
        const delBtn = document.createElement("button");

        delBtn.id = `word_${word.en}_${word.ja}`;
        delBtn.innerText = "削除";
        delBtn.onclick = deleteWord;
        delBtnTd.appendChild(delBtn);

        const enTd = document.createElement("td");
        enTd.innerText = word.en;
        const jaTd = document.createElement("td");
        jaTd.innerText = word.ja;

        tr.appendChild(delBtnTd);
        tr.appendChild(enTd);
        tr.appendChild(jaTd);

        document.getElementById("list").appendChild(tr);
    }

    saveWords();
}

const displayForm = () => {
    document.getElementById("add").style.display = "block";
}

const addWord = set => {
    if (set) {
        const en = document.getElementById("en").value;
        const ja = document.getElementById("ja").value;
        words.push({"en": en, "ja": ja});
        listWords();
    }

    document.getElementById("add").style.display = "none";
}

const deleteWord = event => {
    const en = event.target.id.split("_")[1];
    const ja = event.target.id.split("_")[2];
    for (let i=0; i<words.length; i++) {
        if ((words[i].en === en) && (words[i].ja === ja)) {
            words.splice(i, 1);
            break;
        }
    }
    listWords();
}

const saveWords = () => {
    localStorage.setItem("wordbook". JSON.stringify(words));
}

const startStudy = wordbookOrder => {
    status = "question";
    index = 0;
    order = wordbookOrder;
    document.getElementById("list").style.display = "none";
    document.getElementById("wordbook").style.display = "block";

    for (let i=words.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * i);
        [words[i], words[j]] = [words[j], words[i]];
    }

    study();
}

const study = () => {
    let [q, a, op] = [words[index].en, words[index].ja, "日本語を表示"];
    if (status === "question") {
        if (order === "ja") {
            q = words[index].ja;
            op = "英語を表示";
        }
        document.getElementById("q").innerText = q;
        document.getElementById("a").innerText = "";
        document.getElementById("op").value = op;
        status = "answer";
    } else if (status === "answer") {
        if (order === "ja") {
            a = words[index].en;
        }
        document.getElementById("a").innerText = a;
        document.getElementById("op").value = "次の単語";
        status = "question";
        index++;
        if (index === words.length) {
            document.getElementById("op").value = "初めから";
            index = 0;
        }
    }
}