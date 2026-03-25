function showLoader(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = '<div class="loader"></div> Загрузка...';
}

function showStatus(containerId, message, type = 'info') {
    const container = document.getElementById(containerId);
    if (container) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-msg status-${type}`;
        statusDiv.innerHTML = message;
        const existing = container.querySelector('.status-msg');
        if (existing) existing.remove();
        container.prepend(statusDiv);
        setTimeout(() => statusDiv.remove(), 4000);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    const stringValue = String(str);
    return stringValue.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function translateText(text, targetLang = 'ru') {
    try {
        const response = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(text));
        if (!response.ok) throw new Error('Translation failed');
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.warn('Translation error:', error);
        return text;
    }
}

function showSkeleton(containerId, type = 'default') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const skeletons = {
        dog: `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `,
        fact: `
            <div class="skeleton-card">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `,
        user: `
            <div class="skeleton-card">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `,
        default: `
            <div class="skeleton-card">
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `
    };
    
    container.innerHTML = skeletons[type] || skeletons.default;
}

function renderDogsAPI() {
    const contentDiv = document.getElementById('apiContent');
    contentDiv.innerHTML = `
        <div class="api-card">
            <div class="api-header">
                <div class="api-title">🐕 Случайные собаки (Dog API)</div>
                <div class="api-badge">GET · Доступ без ключа</div>
            </div>
            <div class="api-content">
                <div class="form-group">
                    <button id="getRandomDogBtn">🐕 Получить случайную собаку</button>
                    <button id="getMultipleDogsBtn">🐕🐕 Получить 3 случайных собаки</button>
                </div>
                <div class="data-panel" id="dogsDataPanel">
                    <h4>📸 Результат</h4>
                    <div id="dogsResult">
                        <div class="placeholder-message">
                            <span class="placeholder-icon">🐕</span>
                            <p>Нажмите кнопку выше, чтобы получить изображение собаки</p>
                            <small>Данные будут загружены из Dog API</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('getRandomDogBtn').onclick = async () => {
        const resultDiv = document.getElementById('dogsResult');
        showSkeleton('dogsResult', 'dog');
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            const breedMatch = data.message.match(/breeds\/([^\/]+)\//);
            const breed = breedMatch ? breedMatch[1].replace(/-/g, ' ') : 'неизвестная порода';
            
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 16px; color: white; text-align: center;">
                    <img src="${data.message}" alt="Random Dog" style="max-width: 100%; border-radius: 12px; margin-bottom: 1rem; max-height: 300px; object-fit: cover;">
                    <h3>🐕 Ваша случайная собака</h3>
                    <p>Порода: ${escapeHtml(breed)}</p>
                    <p style="font-size: 0.9rem; opacity: 0.9;">Наслаждайтесь прекрасным моментом!</p>
                </div>
            `;
            showStatus('dogsDataPanel', `✅ Собака породы "${breed}" успешно загружена`, 'success');
        } catch (err) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>Не удалось загрузить изображение собаки</p>
                    <small>Ошибка: ${err.message}</small>
                    <button onclick="location.reload()" style="margin-top: 1rem;">🔄 Попробовать снова</button>
                </div>
            `;
            showStatus('dogsDataPanel', `❌ Ошибка: ${err.message}`, 'error');
        }
    };

    document.getElementById('getMultipleDogsBtn').onclick = async () => {
        const resultDiv = document.getElementById('dogsResult');
        showSkeleton('dogsResult', 'dog');
        try {
            const promises = [];
            for (let i = 0; i < 3; i++) {
                promises.push(fetch('https://dog.ceo/api/breeds/image/random'));
            }
            const responses = await Promise.all(promises);
            const data = await Promise.all(responses.map(r => r.json()));
            
            let imagesHtml = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 16px; color: white;">
                    <h3>🐕🐕🐕 3 случайные собаки</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            `;
            
            data.forEach((dog, idx) => {
                const breedMatch = dog.message.match(/breeds\/([^\/]+)\//);
                const breed = breedMatch ? breedMatch[1].replace(/-/g, ' ') : 'неизвестная порода';
                imagesHtml += `
                    <div style="text-align: center;">
                        <img src="${dog.message}" alt="Dog ${idx + 1}" style="width: 100%; border-radius: 12px; height: 200px; object-fit: cover;">
                        <p style="margin-top: 0.5rem;">Собака ${idx + 1}<br><small>${escapeHtml(breed)}</small></p>
                    </div>
                `;
            });
            
            imagesHtml += `</div></div>`;
            resultDiv.innerHTML = imagesHtml;
            showStatus('dogsDataPanel', `✅ 3 собаки успешно загружены`, 'success');
        } catch (err) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>Не удалось загрузить изображения</p>
                    <small>Ошибка: ${err.message}</small>
                </div>
            `;
            showStatus('dogsDataPanel', `❌ Ошибка: ${err.message}`, 'error');
        }
    };
}

let favoriteFacts = [];

function renderCatFactsAPI() {
    const contentDiv = document.getElementById('apiContent');
    contentDiv.innerHTML = `
        <div class="api-card">
            <div class="api-header">
                <div class="api-title">🐱 Cat Facts - Интересные факты о кошках</div>
                <div class="api-badge"> 🌐 Автоперевод</div>
            </div>
            <div class="api-content">
                <div class="form-group">
                    <button id="getRandomFactBtn">🐱 Получить случайный факт</button>
                    <button id="getMultipleFactsBtn">🐱🐱 Получить 3 случайных факта</button>
                </div>
                <div class="data-panel" id="factsDataPanel">
                    <h4>📖 Интересный факт</h4>
                    <div id="currentFact">
                        <div class="placeholder-message">
                            <span class="placeholder-icon">🐱</span>
                            <p>Нажмите кнопку выше, чтобы узнать интересный факт о кошках</p>
                            <small>Факты будут автоматически переведены на русский язык</small>
                        </div>
                    </div>
                </div>
                
                <hr>
                
                <div class="form-group">
                    <label>⭐ Добавить факт в избранное (POST локально)</label>
                    <textarea id="favoriteFact" rows="3" placeholder="Введите ваш любимый факт о кошках"></textarea>
                    <button id="addToFavoritesBtn">💾 POST в избранное</button>
                </div>
                
                <div class="data-panel" id="favoritesPanel">
                    <h4>⭐ Избранные факты</h4>
                    <div id="favoritesList">
                        <div class="placeholder-message">
                            <span class="placeholder-icon">⭐</span>
                            <p>Нет избранных фактов</p>
                            <small>Добавьте факт в избранное, нажав кнопку выше</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    function renderFavorites() {
        const container = document.getElementById('favoritesList');
        if (!container) return;
        if (!favoriteFacts.length) {
            container.innerHTML = `
                <div class="placeholder-message">
                    <span class="placeholder-icon">⭐</span>
                    <p>Нет избранных фактов</p>
                    <small>Добавьте факт в избранное, нажав кнопку выше</small>
                </div>
            `;
            return;
        }
        
        let html = `<div class="grid-list">`;
        favoriteFacts.forEach((fact, idx) => {
            html += `
                <div class="list-item">
                    <strong>${escapeHtml(fact.text)}</strong><br>
                    <small>📅 Добавлено: ${fact.date || new Date().toLocaleDateString()}</small>
                    <div class="row-actions">
                        <button class="edit-favorite-btn" data-index="${idx}">✏️ PUT (редактировать)</button>
                        <button class="delete-favorite-btn" data-index="${idx}">🗑 DELETE</button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;

        document.querySelectorAll('.edit-favorite-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                const newText = prompt('Введите новый факт:', favoriteFacts[idx].text);
                if (newText && newText.trim()) {
                    favoriteFacts[idx].text = newText.trim();
                    renderFavorites();
                    showStatus('favoritesPanel', `✅ PUT: факт обновлён`, 'success');
                }
            };
        });
        
        document.querySelectorAll('.delete-favorite-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (confirm('Удалить из избранного?')) {
                    favoriteFacts.splice(idx, 1);
                    renderFavorites();
                    showStatus('favoritesPanel', `🗑 DELETE: факт удалён`, 'success');
                }
            };
        });
    }

    document.getElementById('getRandomFactBtn').onclick = async () => {
        const resultDiv = document.getElementById('currentFact');
        showSkeleton('currentFact', 'fact');
        try {
            const response = await fetch('https://catfact.ninja/fact');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            resultDiv.innerHTML = '<div class="loader"></div> Перевод на русский язык...';
            const translatedFact = await translateText(data.fact, 'ru');
            
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 1.5rem; border-radius: 16px; color: #333;">
                    <div style="font-size: 3rem; text-align: center; margin-bottom: 0.5rem;">🐱</div>
                    <p style="font-size: 1.1rem; line-height: 1.5; text-align: center;">${escapeHtml(translatedFact)}</p>
                    <details style="margin-top: 1rem; text-align: center;">
                        <summary style="cursor: pointer; font-size: 0.85rem; opacity: 0.7;">📖 Показать оригинал (английский)</summary>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem;">${escapeHtml(data.fact)}</p>
                    </details>
                </div>
            `;
            showStatus('factsDataPanel', `✅ Интересный факт о кошках получен и переведён`, 'success');
        } catch (err) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>Не удалось загрузить факт о кошках</p>
                    <small>Ошибка: ${err.message}</small>
                    <button onclick="location.reload()" style="margin-top: 1rem;">🔄 Попробовать снова</button>
                </div>
            `;
            showStatus('factsDataPanel', `❌ Ошибка: ${err.message}`, 'error');
        }
    };

    document.getElementById('getMultipleFactsBtn').onclick = async () => {
        const resultDiv = document.getElementById('currentFact');
        showSkeleton('currentFact', 'fact');
        try {
            const promises = [];
            for (let i = 0; i < 3; i++) {
                promises.push(fetch('https://catfact.ninja/fact'));
            }
            const responses = await Promise.all(promises);
            const facts = await Promise.all(responses.map(r => r.json()));
            
            resultDiv.innerHTML = '<div class="loader"></div> Перевод фактов на русский...';
            const translatedFacts = await Promise.all(
                facts.map(fact => translateText(fact.fact, 'ru'))
            );
            
            let factsHtml = `
                <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 1.5rem; border-radius: 16px; color: #333;">
                    <h3 style="text-align: center; margin-bottom: 1.5rem;">🐱 3 интересных факта о кошках 🐱</h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            `;
            
            translatedFacts.forEach((fact, idx) => {
                factsHtml += `
                    <div style="border-left: 3px solid #ff6b6b; padding-left: 1rem;">
                        <strong style="color: #ff6b6b;">Факт ${idx + 1}</strong>
                        <p style="margin-top: 0.5rem;">${escapeHtml(fact)}</p>
                        <details style="margin-top: 0.5rem;">
                            <summary style="cursor: pointer; font-size: 0.8rem; opacity: 0.6;">Показать оригинал</summary>
                            <small>${escapeHtml(facts[idx].fact)}</small>
                        </details>
                    </div>
                `;
            });
            
            factsHtml += `</div></div>`;
            resultDiv.innerHTML = factsHtml;
            showStatus('factsDataPanel', `✅ 3 факта о кошках загружены и переведены`, 'success');
        } catch (err) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>Не удалось загрузить факты</p>
                    <small>Ошибка: ${err.message}</small>
                </div>
            `;
            showStatus('factsDataPanel', `❌ Ошибка: ${err.message}`, 'error');
        }
    };

    document.getElementById('addToFavoritesBtn').onclick = () => {
        const factText = document.getElementById('favoriteFact').value.trim();
        if (!factText) return showStatus('favoritesPanel', 'Введите факт о кошках', 'error');
        
        const newFact = {
            id: Date.now(),
            text: factText,
            date: new Date().toLocaleDateString()
        };
        favoriteFacts.push(newFact);
        renderFavorites();
        document.getElementById('favoriteFact').value = '';
        showStatus('favoritesPanel', `➕ POST: факт добавлен в избранное`, 'success');
    };
    
    renderFavorites();
}

let savedUsers = [];

function renderRandomUserAPI() {
    const contentDiv = document.getElementById('apiContent');
    contentDiv.innerHTML = `
        <div class="api-card">
            <div class="api-header">
                <div class="api-title">👥 Random User Generator</div>
                <div class="api-badge">GET · POST · PUT · DELETE</div>
            </div>
            <div class="api-content">
                <div class="form-group">
                    <button id="fetchUsersBtn">📥 Получить случайных пользователей</button>
                    <input type="number" id="userCount" min="1" max="10" value="5" style="width: 80px;">
                    <label style="display: inline-block;">пользователей</label>
                </div>
                
                <div class="data-panel" id="usersDataPanel">
                    <h4>👥 Сгенерированные пользователи</h4>
                    <div id="usersListContainer">
                        <div class="placeholder-message">
                            <span class="placeholder-icon">👥</span>
                            <p>Нет загруженных пользователей</p>
                            <small>Нажмите "Получить случайных пользователей" для загрузки</small>
                        </div>
                    </div>
                </div>
                
                <hr>
                
                <div class="form-group">
                    <label>➕ Добавить пользователя вручную (POST локально)</label>
                    <input type="text" id="localUserName" placeholder="Имя и фамилия">
                    <input type="email" id="localUserEmail" placeholder="Email">
                    <button id="addLocalUserBtn">💾 POST (сохранить)</button>
                </div>
            </div>
        </div>
    `;

    function renderUsersList() {
        const container = document.getElementById('usersListContainer');
        if (!container) return;
        if (!savedUsers.length) {
            container.innerHTML = `
                <div class="placeholder-message">
                    <span class="placeholder-icon">👥</span>
                    <p>Нет загруженных пользователей</p>
                    <small>Нажмите "Получить случайных пользователей" для загрузки</small>
                </div>
            `;
            return;
        }
        
        let html = `<div class="grid-list">`;
        savedUsers.forEach((user, idx) => {
            const name = user.name || `${user.firstName} ${user.lastName}` || 'Без имени';
            const email = user.email || 'нет email';
            const country = user.location?.country || user.country || 'не указана';
            const picture = user.picture;
            
            html += `
                <div class="list-item" style="text-align: center;">
                    ${picture ? `<img src="${picture}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 0.5rem;">` : '<div style="font-size: 3rem;">👤</div>'}
                    <strong>${escapeHtml(name)}</strong><br>
                    📧 ${escapeHtml(email)}<br>
                    🌍 ${escapeHtml(country)}
                    <div class="row-actions" style="justify-content: center;">
                        <button class="edit-user-btn" data-index="${idx}">✏️ PUT (ред.)</button>
                        <button class="delete-user-btn" data-index="${idx}">🗑 DELETE</button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;

        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                const newName = prompt('Введите новое имя:', savedUsers[idx].name || 'User');
                if (newName && newName.trim()) {
                    savedUsers[idx].name = newName.trim();
                    renderUsersList();
                    showStatus('usersDataPanel', `✅ PUT: пользователь обновлён`, 'success');
                }
            };
        });
        
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (confirm('Удалить пользователя?')) {
                    savedUsers.splice(idx, 1);
                    renderUsersList();
                    showStatus('usersDataPanel', `🗑 DELETE: пользователь удалён`, 'success');
                }
            };
        });
    }

    document.getElementById('fetchUsersBtn').onclick = async () => {
        const count = document.getElementById('userCount').value || 5;
        const container = document.getElementById('usersListContainer');
        showSkeleton('usersListContainer', 'user');
        
        try {
            const response = await fetch(`https://randomuser.me/api/?results=${count}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            const newUsers = data.results.map((u, i) => ({
                id: `user_${Date.now()}_${i}`,
                name: `${u.name.first} ${u.name.last}`,
                firstName: u.name.first,
                lastName: u.name.last,
                email: u.email,
                location: {
                    country: u.location.country,
                    city: u.location.city
                },
                picture: u.picture?.thumbnail
            }));
            
            savedUsers = [...newUsers];
            renderUsersList();
            showStatus('usersDataPanel', `✅ Загружено ${savedUsers.length} пользователей`, 'success');
        } catch (err) {
            container.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>Не удалось загрузить пользователей</p>
                    <small>Ошибка: ${err.message}</small>
                    <button onclick="location.reload()" style="margin-top: 1rem;">🔄 Попробовать снова</button>
                </div>
            `;
            showStatus('usersDataPanel', `❌ Ошибка загрузки: ${err.message}`, 'error');
        }
    };

    document.getElementById('addLocalUserBtn').onclick = () => {
        const name = document.getElementById('localUserName').value.trim();
        const email = document.getElementById('localUserEmail').value.trim();
        if (!name || !email) return showStatus('usersDataPanel', 'Заполните имя и email', 'error');
        
        const newUser = {
            id: `local_${Date.now()}`,
            name: name,
            email: email,
            location: { country: 'добавлен вручную' },
            picture: null,
            dateAdded: new Date().toLocaleDateString()
        };
        savedUsers.push(newUser);
        renderUsersList();
        document.getElementById('localUserName').value = '';
        document.getElementById('localUserEmail').value = '';
        showStatus('usersDataPanel', `➕ POST: пользователь "${name}" добавлен`, 'success');
    };
    
    renderUsersList();
}

let currentApi = 'dogs';

function switchTo(apiName) {
    currentApi = apiName;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-api') === apiName) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    if (apiName === 'dogs') renderDogsAPI();
    else if (apiName === 'catfacts') renderCatFactsAPI();
    else if (apiName === 'randomuser') renderRandomUserAPI();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTo(btn.getAttribute('data-api')));
    });
    switchTo('dogs');
});