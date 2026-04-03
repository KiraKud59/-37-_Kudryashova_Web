let currentApi = 'dogs';

let dogImagesList = [];
let catFactsList = [];
let usersList = [];
let jsonPosts = [];

const appContainer = document.getElementById('appContainer');

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 2200);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function loadDogImages() {
    const container = document.getElementById('dogContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading-shimmer"> 🐕 ЗАГРУЗКА СОБАК...</div>';
    try {
        const promises = Array(4).fill().map(() => fetch('https://dog.ceo/api/breeds/image/random'));
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(r => r.json()));
        dogImagesList = data.map(d => ({ url: d.message, breed: d.message.match(/breeds\/([^\/]+)\//)?.[1]?.replace(/-/g, ' ') || 'неизвестная' }));
        renderDogUI();
        showNotification('🐕 Dog CEO: случайные собаки загружены (GET)', 'success');
    } catch (err) {
        container.innerHTML = `<div class="placeholder-message">❌ Ошибка: ${err.message}</div>`;
        showNotification(`Ошибка Dog API: ${err.message}`, 'error');
    }
}

function renderDogUI() {
    const container = document.getElementById('dogContainer');
    if (!container) return;
    
    if (!dogImagesList.length) {
        container.innerHTML = '<div class="placeholder-message">🐕 Нет изображений. Обновите список</div>';
        return;
    }
    
    const imagesHtml = dogImagesList.map((dog, idx) => `
        <div class="dog-item">
            <img src="${dog.url}" alt="Собака" style="width:100%; height:180px; object-fit:cover; border-radius:12px;">
            <div style="margin-top:8px;"><strong>Порода:</strong> ${escapeHtml(dog.breed)}</div>
            <button class="delete-btn" data-index="${idx}" style="margin-top:8px;">🗑 Удалить</button>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="grid-list" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem;">${imagesHtml}</div>
        <div class="action-group" style="margin-top:1rem;">
            <button id="refreshDogBtn" class="secondary-btn">🐕 GET (обновить собак)</button>
        </div>
    `;
    
    document.getElementById('refreshDogBtn')?.addEventListener('click', loadDogImages);
    
    document.querySelectorAll('.delete-btn[data-index]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            if (!isNaN(idx) && idx >= 0 && idx < dogImagesList.length) {
                dogImagesList.splice(idx, 1);
                renderDogUI();
                showNotification(`🗑 Собака удалена`, 'success');
            }
        });
    });
}

async function loadCatFacts() {
    const container = document.getElementById('catFactsContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading-shimmer">🐱 ЗАГРУЗКА КОШАЧЬИХ ФАКТОВ...</div>';
    try {
        const res = await fetch('https://catfact.ninja/facts?limit=6');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        catFactsList = data.data;
        renderCatFactsUI();
        showNotification('🐱 Cat Facts загружены (GET)', 'success');
    } catch (err) {
        container.innerHTML = `<div class="placeholder-message">❌ Ошибка: ${err.message}</div>`;
        showNotification(`Ошибка Cat Facts: ${err.message}`, 'error');
    }
}

function renderCatFactsUI() {
    const container = document.getElementById('catFactsContainer');
    if (!container) return;
    
    if (!catFactsList.length) {
        container.innerHTML = '<div class="placeholder-message">🐱 Нет фактов. Обновите список</div>';
        return;
    }
    
    const factsHtml = catFactsList.map((factObj, idx) => `
        <div class="fact-item">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">📌 ${escapeHtml(factObj.fact)}</div>
                <button class="delete-btn" data-index="${idx}" style="margin-left: 15px;">🗑 Удалить</button>
            </div>
            <div style="font-size: 0.7rem; color: #8bc34a; margin-top: 8px;">📏 длина: ${factObj.length} симв.</div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="facts-list">${factsHtml}</div>
        <div class="action-group" style="margin-top:1rem;">
            <button id="refreshCatBtn" class="secondary-btn">🐱 GET (обновить факты)</button>
        </div>
    `;
    
    document.getElementById('refreshCatBtn')?.addEventListener('click', loadCatFacts);
    
    document.querySelectorAll('.delete-btn[data-index]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            if (!isNaN(idx) && idx >= 0 && idx < catFactsList.length) {
                catFactsList.splice(idx, 1);
                renderCatFactsUI();
                showNotification(`🗑 Факт удалён`, 'success');
            }
        });
    });
}

async function loadRandomUsers() {
    const container = document.getElementById('usersContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading-shimmer">👥 ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ...</div>';
    try {
        const res = await fetch('https://randomuser.me/api/?results=5');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        usersList = data.results.map(u => ({
            name: `${u.name.first} ${u.name.last}`,
            email: u.email,
            country: u.location.country,
            picture: u.picture.thumbnail
        }));
        renderUsersUI();
        showNotification('👥 RandomUser загружены (GET)', 'success');
    } catch (err) {
        container.innerHTML = `<div class="placeholder-message">❌ Ошибка: ${err.message}</div>`;
        showNotification(`Ошибка RandomUser: ${err.message}`, 'error');
    }
}

function renderUsersUI() {
    const container = document.getElementById('usersContainer');
    if (!container) return;
    
    if (!usersList.length) {
        container.innerHTML = '<div class="placeholder-message">👥 Нет пользователей. Обновите список</div>';
        return;
    }
    
    const usersHtml = usersList.map((user, idx) => `
        <div class="user-item" style="text-align:center; background:#1e2a3a; border-radius:16px; padding:1rem;">
            <img src="${user.picture}" style="width:70px; height:70px; border-radius:50%; margin-bottom:0.5rem;">
            <div><strong>${escapeHtml(user.name)}</strong></div>
            <div style="font-size:0.85rem;">📧 ${escapeHtml(user.email)}</div>
            <div style="font-size:0.85rem;">🌍 ${escapeHtml(user.country)}</div>
            <button class="delete-btn" data-index="${idx}" style="margin-top:8px;">🗑 Удалить</button>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="grid-list" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1rem;">${usersHtml}</div>
        <div class="action-group" style="margin-top:1rem;">
            <button id="refreshUsersBtn" class="secondary-btn">👥 GET (обновить пользователей)</button>
        </div>
    `;
    
    document.getElementById('refreshUsersBtn')?.addEventListener('click', loadRandomUsers);
    
    document.querySelectorAll('.delete-btn[data-index]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            if (!isNaN(idx) && idx >= 0 && idx < usersList.length) {
                usersList.splice(idx, 1);
                renderUsersUI();
                showNotification(`🗑 Пользователь удалён`, 'success');
            }
        });
    });
}

async function loadJsonPosts() {
    const container = document.getElementById('jsonPostsContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading-shimmer">📋 Загрузка...</div>';
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        jsonPosts = await res.json();
        renderJsonPostsUI();
        showNotification('📋 GET /posts — список загружен', 'success');
    } catch (err) {
        container.innerHTML = `<div class="placeholder-message">❌ Ошибка: ${err.message}</div>`;
        showNotification(err.message, 'error');
    }
}

async function createJsonPost(title, body) {
    if (!title || !body) throw new Error('Заголовок и текст обязательны');
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, userId: 1 })
    });
    if (!res.ok) throw new Error('POST ошибка');
    const created = await res.json();
    jsonPosts.unshift(created);
    renderJsonPostsUI();
    return created;
}

async function updateJsonPost(id, title, body) {
    if (!title || !body) throw new Error('Заполните заголовок и текст');
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, body, userId: 1 })
    });
    if (!res.ok) throw new Error('PUT ошибка');
    const updated = await res.json();
    const index = jsonPosts.findIndex(p => p.id == id);
    if (index !== -1) {
        jsonPosts[index] = { ...jsonPosts[index], title: updated.title, body: updated.body };
    }
    renderJsonPostsUI();
    return updated;
}

async function deleteJsonPost(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 200) throw new Error('DELETE ошибка');
    jsonPosts = jsonPosts.filter(p => p.id != id);
    renderJsonPostsUI();
    return true;
}

function renderJsonPostsUI() {
    const container = document.getElementById('jsonPostsContainer');
    if (!container) return;
    
    const postsHtml = jsonPosts.map(post => `
        <div class="post-item" style="background:#1e2a3a; border-radius:12px; padding:1rem; margin-bottom:0.8rem;">
            <div class="post-title" style="font-weight:bold; color:#8bc34a;">📌 ${escapeHtml(post.title)}</div>
            <div class="post-body" style="margin-top:0.5rem;">${escapeHtml(post.body)}</div>
            <div class="post-actions" style="margin-top:0.8rem;">
                <button class="edit-btn" data-id="${post.id}" data-title="${escapeHtml(post.title).replace(/"/g, '&quot;')}" data-body="${escapeHtml(post.body).replace(/"/g, '&quot;')}" style="background:#2196f3;">✏️ PUT</button>
                <button class="delete-post-btn" data-id="${post.id}" style="background:#f44336;">🗑 DELETE</button>
            </div>
        </div>
    `).join('');
    
    const formHtml = `
        <div class="action-group" style="margin-bottom:1rem;">
            <input type="text" id="newPostTitle" class="api-input" placeholder="Заголовок" style="flex:2; padding:0.8rem;">
            <input type="text" id="newPostBody" class="api-input" placeholder="Текст" style="flex:3; padding:0.8rem;">
            <button id="createPostBtn" class="success-btn" style="background:#4caf50;">💾 POST</button>
        </div>
        
        <div class="put-section" style="background:#0d1b2a; border-radius:12px; padding:1rem; margin-bottom:1rem;">
            <div style="margin-bottom: 10px; color: #8bc34a;">✏️ PUT — обновление</div>
            <div class="action-group" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <select id="putPostSelect" class="api-input" style="flex:2; padding:0.8rem;">
                    <option value="">-- Выберите ID --</option>
                    ${jsonPosts.map(p => `<option value="${p.id}">ID ${p.id}: ${escapeHtml(p.title).substring(0, 40)}</option>`).join('')}
                </select>
                <input type="text" id="putTitle" class="api-input" placeholder="Новый заголовок" style="flex:2; padding:0.8rem;">
                <input type="text" id="putBody" class="api-input" placeholder="Новый текст" style="flex:3; padding:0.8rem;">
                <button id="applyPutBtn" class="edit-btn" style="background:#ff9800;">✏️ PUT</button>
            </div>
        </div>
        
        <div class="scrollable-list" style="max-height:400px; overflow-y:auto;">
            ${postsHtml || '<div class="placeholder-message">📋 Нет постов</div>'}
        </div>
    `;
    
    container.innerHTML = formHtml;
    
    document.getElementById('createPostBtn')?.addEventListener('click', async () => {
        const title = document.getElementById('newPostTitle').value;
        const body = document.getElementById('newPostBody').value;
        try {
            await createJsonPost(title, body);
            showNotification(`💾 POST: "${title.substring(0, 40)}" создан`, 'success');
            document.getElementById('newPostTitle').value = '';
            document.getElementById('newPostBody').value = '';
        } catch (err) {
            showNotification(`POST ошибка: ${err.message}`, 'error');
        }
    });
    
    document.getElementById('applyPutBtn')?.addEventListener('click', async () => {
        const select = document.getElementById('putPostSelect');
        const id = select.value;
        const newTitle = document.getElementById('putTitle').value;
        const newBody = document.getElementById('putBody').value;
        if (!id) {
            showNotification('Выберите ID', 'error');
            return;
        }
        if (!newTitle || !newBody) {
            showNotification('Заполните заголовок и текст', 'error');
            return;
        }
        try {
            await updateJsonPost(parseInt(id), newTitle, newBody);
            showNotification(`✏️ PUT /${id} обновлён`, 'success');
            document.getElementById('putTitle').value = '';
            document.getElementById('putBody').value = '';
            select.value = '';
        } catch (err) {
            showNotification(`PUT ошибка: ${err.message}`, 'error');
        }
    });
    
    document.querySelectorAll('.edit-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const oldTitle = btn.dataset.title;
            const oldBody = btn.dataset.body;
            const selectEl = document.getElementById('putPostSelect');
            if (selectEl) selectEl.value = id;
            const titleInput = document.getElementById('putTitle');
            const bodyInput = document.getElementById('putBody');
            if (titleInput) titleInput.value = oldTitle;
            if (bodyInput) bodyInput.value = oldBody;
        });
    });
    
    document.querySelectorAll('.delete-post-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            try {
                await deleteJsonPost(id);
                showNotification(`🗑 DELETE /${id} удалён`, 'success');
            } catch (err) {
                showNotification(`DELETE ошибка: ${err.message}`, 'error');
            }
        });
    });
}

function renderActiveApi() {
    if (currentApi === 'dogs') {
        appContainer.innerHTML = `
            <div class="api-section">
                <div class="section-header">
                    <h2>🐕‍🦺 DOG CEO API</h2>
                    <span class="badge">GET · DELETE</span>
                </div>
                <div id="dogContainer"></div>
            </div>
            <div class="api-section" style="margin-top:2rem;">
                <div class="section-header">
                    <h2>📋 JSONPlaceholder</h2>
                    <span class="badge">GET · POST · PUT · DELETE</span>
                </div>
                <div id="jsonPostsContainer"></div>
            </div>
            <div class="response-area" style="margin-top:1rem; text-align:center;">
                🟢 GET (собаки) · 🗑 DELETE (локально) · 📋 CRUD (JSONPlaceholder)
            </div>
        `;
        loadDogImages();
        loadJsonPosts();
    } else if (currentApi === 'catfacts') {
        appContainer.innerHTML = `
            <div class="api-section">
                <div class="section-header">
                    <h2>🐱 CAT FACTS API</h2>
                    <span class="badge">GET · DELETE</span>
                </div>
                <div id="catFactsContainer"></div>
            </div>
            <div class="api-section" style="margin-top:2rem;">
                <div class="section-header">
                    <h2>📋 JSONPlaceholder</h2>
                    <span class="badge">GET · POST · PUT · DELETE</span>
                </div>
                <div id="jsonPostsContainer"></div>
            </div>
            <div class="response-area" style="margin-top:1rem; text-align:center;">
                🟢 GET (факты) · 🗑 DELETE (локально) · 📋 CRUD (JSONPlaceholder)
            </div>
        `;
        loadCatFacts();
        loadJsonPosts();
    } else if (currentApi === 'randomuser') {
        appContainer.innerHTML = `
            <div class="api-section">
                <div class="section-header">
                    <h2>👥 RANDOMUSER API</h2>
                    <span class="badge">GET · DELETE</span>
                </div>
                <div id="usersContainer"></div>
            </div>
            <div class="api-section" style="margin-top:2rem;">
                <div class="section-header">
                    <h2>📋 JSONPlaceholder</h2>
                    <span class="badge">GET · POST · PUT · DELETE</span>
                </div>
                <div id="jsonPostsContainer"></div>
            </div>
            <div class="response-area" style="margin-top:1rem; text-align:center;">
                🟢 GET (пользователи) · 🗑 DELETE (локально) · 📋 CRUD (JSONPlaceholder)
            </div>
        `;
        loadRandomUsers();
        loadJsonPosts();
    }
}

function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const apiType = btn.getAttribute('data-api');
            if (apiType === 'dogs') currentApi = 'dogs';
            else if (apiType === 'catfacts') currentApi = 'catfacts';
            else if (apiType === 'randomuser') currentApi = 'randomuser';
            renderActiveApi();
        });
    });
}

initNavigation();
renderActiveApi();