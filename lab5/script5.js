class Card {
    constructor(name, cost) {
        this._name = name;
        this._cost = cost;
    }

    get name() { return this._name; }
    get cost() { return this._cost; }
    
    set name(value) { this._name = value; }
    set cost(value) { this._cost = value; }

    getHTML(editMode, index) {
        return `<div class="card" data-index="${index}">
            <h3>${this._name}</h3>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? this.getEditControls(index) : ""}
        </div>`;
    }

    getEditControls(index) {
        return `
            <div class="controls">
                <button onclick="editCard(${index})">Редактировать</button>
                <button onclick="removeCard(${index})">Удалить</button>
            </div>
        `;
    }
}

class AttackCard extends Card {
    constructor(name, cost, damage) {
        super(name, cost);
        this._damage = damage;
    }

    get damage() { return this._damage; }
    set damage(value) { this._damage = value; }

    getHTML(editMode, index) {
        return `
        <div class="card attack" data-index="${index}">
            <h3>${this._name}</h3>
            <p>Урон: ${this._damage}</p>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? this.getEditControls(index) : ""}
        </div>`;
    }

    getEditControls(index) {
        return `
            <div class="controls">
                <button onclick="editCard(${index})">Редактировать</button>
                <button onclick="removeCard(${index})">Удалить</button>
            </div>
        `;
    }
}

class DefenseCard extends Card {
    constructor(name, cost, armor) {
        super(name, cost);
        this._armor = armor;
    }

    get armor() { return this._armor; }
    set armor(value) { this._armor = value; }

    getHTML(editMode, index) {
        return `
        <div class="card defense" data-index="${index}">
            <h3>${this._name}</h3>
            <p>Броня: ${this._armor}</p>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? this.getEditControls(index) : ""}
        </div>`;
    }

    getEditControls(index) {
        return `
            <div class="controls">
                <button onclick="editCard(${index})">Редактировать</button>
                <button onclick="removeCard(${index})">Удалить</button>
            </div>
        `;
    }
}

class MagicCard extends Card {
    constructor(name, cost, effect) {
        super(name, cost);
        this._effect = effect;
    }

    get effect() { return this._effect; }
    set effect(value) { this._effect = value; }

    getHTML(editMode, index) {
        return `
        <div class="card magic" data-index="${index}">
            <h3>${this._name}</h3>
            <p>Эффект: ${this._effect}</p>
            <p>Стоимость: ${this._cost}</p>
            ${editMode ? this.getEditControls(index) : ""}
        </div>`;
    }

    getEditControls(index) {
        return `
            <div class="controls">
                <button onclick="editCard(${index})">Редактировать</button>
                <button onclick="removeCard(${index})">Удалить</button>
            </div>
        `;
    }
}

let cards = [];
let editMode = false;
let currentSearchText = "";

function loadCards() {
    const data = localStorage.getItem("cards");
    
    if (data) {
        const parsed = JSON.parse(data);
        cards = parsed.map(c => {
            switch (c.type) {
                case "attack": 
                    return new AttackCard(c.name, c.cost, c.damage);
                case "defense": 
                    return new DefenseCard(c.name, c.cost, c.armor);
                case "magic": 
                    return new MagicCard(c.name, c.cost, c.effect);
                default:
                    return new Card(c.name, c.cost);
            }
        });
    } else {
        cards = [
            new AttackCard("Огненный удар", 2, 8),
            new AttackCard("Молния", 3, 12),
            new DefenseCard("Каменная кожа", 2, 10),
            new DefenseCard("Щит героя", 3, 15),
            new MagicCard("Ледяной дождь", 4, "Заморозка всех врагов"),
            new MagicCard("Исцеление", 3, "Восстановление 10 HP")
        ];
    }
}

function saveCards() {
    const data = cards.map(c => {
        if (c instanceof AttackCard) {
            return { 
                type: "attack", 
                name: c.name, 
                cost: c.cost, 
                damage: c.damage 
            };
        }
        if (c instanceof DefenseCard) {
            return { 
                type: "defense", 
                name: c.name, 
                cost: c.cost, 
                armor: c.armor 
            };
        }
        if (c instanceof MagicCard) {
            return { 
                type: "magic", 
                name: c.name, 
                cost: c.cost, 
                effect: c.effect 
            };
        }
        return { type: "card", name: c.name, cost: c.cost };
    });
    
    localStorage.setItem("cards", JSON.stringify(data));
}

function getFilteredCards() {
    if (!currentSearchText.trim()) return cards;
    return cards.filter(c => 
        c.name.toLowerCase().includes(currentSearchText.toLowerCase())
    );
}

function searchCard(event) {
    currentSearchText = event.target.value;
    updateCardsDisplay();
}

function updateCardsDisplay() {
    const filteredCards = getFilteredCards();
    const container = document.querySelector('.container');
    
    if (filteredCards.length > 0) {
        container.innerHTML = filteredCards.map((c, i) => c.getHTML(editMode, i)).join("");
    } else {
        container.innerHTML = '<div class="empty-message">Нет карт, соответствующих поиску</div>';
    }
}

function showEditModal(index) {
    const filteredCards = getFilteredCards();
    const card = filteredCards[index];
    const realIndex = cards.findIndex(c => c === card);
    
    if (realIndex === -1) return;
    
    const originalCard = cards[realIndex];
    let modalHtml = '';
    
    if (originalCard instanceof AttackCard) {
        modalHtml = `
            <div id="editModal" class="modal">
                <div class="modal-content">
                    <h3>Редактирование карты</h3>
                    <label>Название:</label>
                    <input type="text" id="editName" value="${originalCard.name.replace(/"/g, '&quot;')}">
                    <label>Стоимость:</label>
                    <input type="number" id="editCost" value="${originalCard.cost}">
                    <label>Урон:</label>
                    <input type="number" id="editDamage" value="${originalCard.damage}">
                    <div class="modal-buttons">
                        <button onclick="saveEdit(${realIndex}, 'attack')">Сохранить</button>
                        <button onclick="closeModal()">Отмена</button>
                    </div>
                </div>
            </div>
        `;
    } else if (originalCard instanceof DefenseCard) {
        modalHtml = `
            <div id="editModal" class="modal">
                <div class="modal-content">
                    <h3>Редактирование карты</h3>
                    <label>Название:</label>
                    <input type="text" id="editName" value="${originalCard.name.replace(/"/g, '&quot;')}">
                    <label>Стоимость:</label>
                    <input type="number" id="editCost" value="${originalCard.cost}">
                    <label>Броня:</label>
                    <input type="number" id="editArmor" value="${originalCard.armor}">
                    <div class="modal-buttons">
                        <button onclick="saveEdit(${realIndex}, 'defense')">Сохранить</button>
                        <button onclick="closeModal()">Отмена</button>
                    </div>
                </div>
            </div>
        `;
    } else if (originalCard instanceof MagicCard) {
        modalHtml = `
            <div id="editModal" class="modal">
                <div class="modal-content">
                    <h3>Редактирование карты</h3>
                    <label>Название:</label>
                    <input type="text" id="editName" value="${originalCard.name.replace(/"/g, '&quot;')}">
                    <label>Стоимость:</label>
                    <input type="number" id="editCost" value="${originalCard.cost}">
                    <label>Эффект:</label>
                    <textarea id="editEffect" rows="3">${originalCard.effect.replace(/"/g, '&quot;')}</textarea>
                    <div class="modal-buttons">
                        <button onclick="saveEdit(${realIndex}, 'magic')">Сохранить</button>
                        <button onclick="closeModal()">Отмена</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('editModal').style.display = 'flex';
}

function saveEdit(index, type) {
    const originalCard = cards[index];
    const newName = document.getElementById('editName').value;
    const newCost = parseInt(document.getElementById('editCost').value);
    
    if (!newName || newName.trim() === "") {
        alert("Название не может быть пустым!");
        return;
    }
    
    if (isNaN(newCost) || newCost < 0) {
        alert("Стоимость должна быть положительным числом!");
        return;
    }
    
    originalCard.name = newName;
    originalCard.cost = newCost;
    
    if (type === 'attack') {
        const newDamage = parseInt(document.getElementById('editDamage').value);
        if (isNaN(newDamage) || newDamage < 0) {
            alert("Урон должен быть положительным числом!");
            return;
        }
        originalCard.damage = newDamage;
    } else if (type === 'defense') {
        const newArmor = parseInt(document.getElementById('editArmor').value);
        if (isNaN(newArmor) || newArmor < 0) {
            alert("Броня должна быть положительным числом!");
            return;
        }
        originalCard.armor = newArmor;
    } else if (type === 'magic') {
        const newEffect = document.getElementById('editEffect').value;
        if (!newEffect || newEffect.trim() === "") {
            alert("Эффект не может быть пустым!");
            return;
        }
        originalCard.effect = newEffect;
    }
    
    saveCards();
    closeModal();
    updateCardsDisplay();
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

function editCard(index) {
    showEditModal(index);
}

function removeCard(index) {
    const filteredCards = getFilteredCards();
    const card = filteredCards[index];
    const realIndex = cards.findIndex(c => c === card);
    
    if (realIndex !== -1) {
        cards.splice(realIndex, 1);
        saveCards();
        
        if (getFilteredCards().length === 0 && currentSearchText) {
            currentSearchText = "";
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = "";
        }
        updateCardsDisplay();
    }
}

function addCard() {
    const name = prompt("Введите название карты:");
    if (!name || name.trim() === "") {
        alert("Название не может быть пустым!");
        return;
    }
    
    const cost = parseInt(prompt("Введите стоимость (число):"));
    if (isNaN(cost) || cost < 0) {
        alert("Стоимость должна быть положительным числом!");
        return;
    }
    
    const type = prompt("Введите тип карты (attack / defense / magic):").toLowerCase();
    
    if (type === "attack") {
        const damage = parseInt(prompt("Введите урон:"));
        if (isNaN(damage) || damage < 0) {
            alert("Урон должен быть положительным числом!");
            return;
        }
        cards.push(new AttackCard(name, cost, damage));
        
    } else if (type === "defense") {
        const armor = parseInt(prompt("Введите броню:"));
        if (isNaN(armor) || armor < 0) {
            alert("Броня должна быть положительным числом!");
            return;
        }
        cards.push(new DefenseCard(name, cost, armor));
        
    } else if (type === "magic") {
        const effect = prompt("Введите описание эффекта:");
        if (!effect || effect.trim() === "") {
            alert("Эффект не может быть пустым!");
            return;
        }
        cards.push(new MagicCard(name, cost, effect));
        
    } else {
        alert("Неверный тип карты! Доступные типы: attack, defense, magic");
        return;
    }
    
    saveCards();
    updateCardsDisplay();
}

function toggleEdit() {
    editMode = !editMode;
    updateCardsDisplay();
}

function render() {
    document.body.innerHTML = `
        <header>
            <h2>Моя колода (${cards.length})</h2>
            <div class="search-box">
                <input 
                    id="searchInput"
                    type="text" 
                    placeholder="Поиск по названию..." 
                    value="${currentSearchText.replace(/"/g, '&quot;')}"
                    oninput="searchCard(event)"
                >
            </div>
            <div class="header-buttons">
                <button onclick="toggleEdit()">
                    ${editMode ? "Выход из редактирования" : "Редактировать"}
                </button>
                ${editMode ? `<button onclick="addCard()">Добавить карту</button>` : ""}
            </div>
        </header>

        <div class="container">
        </div>
        
        <footer>
            <p>Карточная игра | ${new Date().getFullYear()}</p>
        </footer>
    `;
    
    updateCardsDisplay();
}

loadCards();
render();