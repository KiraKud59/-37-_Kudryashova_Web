'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggleBtn.textContent = 'Светлая тема';
    }

    
    themeToggleBtn.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = 'Светлая тема';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = 'Тёмная тема';
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewForm = document.getElementById('review-form');
    const imageInput = document.getElementById('review-image');
    const nameInput = document.getElementById('review-name');
    const textInput = document.getElementById('review-text');
    const errorDiv = document.getElementById('form-error');

    
    const COOKIE_NAME = 'reviews_data';

    
    const defaultReviews = [
        { name: '@anon_67', text: 'Норм', image: '' },
        { name: '@hater', text: 'Протекло, 10/10', image: '' },
        { name: '@sigma', text: 'Не буду говорить, для чего я его использовал, но это круто', image: '' },
        { name: '@void', text: '...', image: '' }
    ];

    function loadReviews() {
        const savedReviews = CookieManager.get(COOKIE_NAME);
        if (savedReviews) {
            try {
                return JSON.parse(savedReviews);
            } catch (e) {
                console.error('Ошибка парсинга отзывов из cookie', e);
                return [...defaultReviews];
            }
        } else {
            saveReviews(defaultReviews);
            return [...defaultReviews];
        }
    }


    function saveReviews(reviews) {
        CookieManager.set(COOKIE_NAME, JSON.stringify(reviews), 30);
    }

 
    function renderReviews() {
        const reviews = loadReviews();
        reviewsContainer.innerHTML = ''; 

        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';

  
            let imageHtml = '';
            if (review.image && review.image.trim() !== '') {
                imageHtml = `<img src="${review.image}" alt="review image" class="review-image" onerror="this.style.display='none'">`;
            }

            reviewDiv.innerHTML = `
                ${imageHtml}
                <p>"${review.text}"</p>
                <span class="author">${review.name}</span>
            `;

            reviewsContainer.appendChild(reviewDiv);
        });
    }

    function validateForm(name, text) {
        if (!name || name.trim() === '') {
            return 'Имя не может быть пустым.';
        }
        if (name.length > 30) {
            return 'Имя слишком длинное (макс. 30 символов).';
        }
        if (!text || text.trim() === '') {
            return 'Текст отзыва не может быть пустым.';
        }
        if (text.length > 500) {
            return 'Отзыв слишком длинный (макс. 500 символов).';
        }
        return ''; 
    }

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault(); 


        const image = imageInput.value.trim();
        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        const error = validateForm(name, text);
        if (error) {
            errorDiv.textContent = error;
            return;
        }

        errorDiv.textContent = '';

        const newReview = {
            name: name,
            text: text,
            image: image 
        };

        const currentReviews = loadReviews();
        currentReviews.unshift(newReview); 
        saveReviews(currentReviews);

        reviewForm.reset();

        renderReviews();
    });

    renderReviews();
});