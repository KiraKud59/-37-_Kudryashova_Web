class Card {
    constructor(name, cost) {
        this._name = name;   
        this._cost = cost;
    }

    getHTML() {
        return `<div class="card">
            <h3>${this._name}</h3>
            <p>Стоимость: ${this._cost}</p>
        </div>`;
    }
}

class AttackCard extends Card {
    constructor(name, cost, damage) {
        super(name, cost);
        this._damage = damage;
    }

    getHTML(editMode, index) {
        return `
        <div class="card attack">
            <h3>${this._name}</h3>
            <p>Урон: ${this._damage}</p>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? controls(index) : ""}
        </div>`;
    }
}

class DefenseCard extends Card {
    constructor(name, cost, armor) {
        super(name, cost);
        this._armor = armor;
    }

    getHTML(editMode, index) {
        return `
        <div class="card defense">
            <h3>${this._name}</h3>
            <p>Броня: ${this._armor}</p>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? controls(index) : ""}
        </div>`;
    }
}

class MagicCard extends Card {
    constructor(name, cost, effect) {
        super(name, cost);
        this._effect = effect;
    }

    getHTML(editMode, index) {
        return `
        <div class="card magic">
            <h3>${this._name}</h3>
            <p>Эффект: ${this._effect}</p>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? controls(index) : ""}
        </div>`;
    }
}

function controls(index) {
    return `
        <div class="controls">
            <button onclick="removeCard(${index})">Удалить</button>
        </div>
    `;
}

let cards = [];
let currentList = cards; 

function loadCards() {
    const data = localStorage.getItem("cards");

    if (data) {
        const parsed = JSON.parse(data);
        cards = parsed.map(c => {
            switch (c.type) {
                case "attack": return new AttackCard(c.name, c.cost, c.damage);
                case "defense": return new DefenseCard(c.name, c.cost, c.armor);
                case "magic": return new MagicCard(c.name, c.cost, c.effect);
            }
        });
    } else {
        cards = [
            new AttackCard("Огненный удар", 2, 10),
            new DefenseCard("Щит героя", 3, 15),
            new MagicCard("Ледяной дождь", 4, "Заморозка")
        ];
    }
}

function saveCards() {
    const data = cards.map(c => {
        if (c instanceof AttackCard)
            return { type: "attack", name: c._name, cost: c._cost, damage: c._damage };

        if (c instanceof DefenseCard)
            return { type: "defense", name: c._name, cost: c._cost, armor: c._armor };

        if (c instanceof MagicCard)
            return { type: "magic", name: c._name, cost: c._cost, effect: c._effect };
    });

    localStorage.setItem("cards", JSON.stringify(data));
}

let editMode = false;

function toggleEdit() {
    editMode = !editMode;
    render();
}

function removeCard(index) {
    const card = currentList[index];              
    const realIndex = cards.indexOf(card);        

    if (realIndex !== -1) {
        cards.splice(realIndex, 1);
    }

    saveCards();
    render(currentList); 
}

function addCard() {
    const name = prompt("Название:");
    const cost = Number(prompt("Стоимость:"));
    const type = prompt("Тип: attack / defense / magic");

    if (!name || !cost || !type) return;

    if (type === "attack") {
        const damage = prompt("Урон:");
        cards.push(new AttackCard(name, cost, damage));
    }
    else if (type === "defense") {
        const armor = prompt("Броня:");
        cards.push(new DefenseCard(name, cost, armor));
    }
    else if (type === "magic") {
        const effect = prompt("Эффект:");
        cards.push(new MagicCard(name, cost, effect));
    }

    saveCards();
    render();
}

function searchCard(text) {
    const filtered = cards.filter(c =>
        c._name.toLowerCase().includes(text.toLowerCase())
    );

    render(filtered);
}

function render(list = cards) {
    currentList = list; 

    document.body.innerHTML = `
        <header>
            <h2>Моя колода (${cards.length})</h2>
             <input placeholder="Поиск..." oninput="searchCard(this.value)">
            <div>
                <button onclick="toggleEdit()">
                    ${editMode ? "Выход" : "Редактировать"}
                </button>
                ${editMode ? `<button onclick="addCard()">Добавить</button>` : ""}
            </div>
        </header>

        <div class="container">
            ${list.map((c, i) => c.getHTML(editMode, i)).join("")}
        </div>
        <footer>
         <p>Карточная игра | 2026</p>
        </footer>
    `;
}

loadCards();
render();