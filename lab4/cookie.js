'use strict';

function saveReviewsToCookie(reviews, days = 7) {
    try {
        const reviewsJSON = JSON.stringify(reviews);
        const encodedValue = encodeURIComponent(reviewsJSON);

        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        document.cookie = `reviews_data=${encodedValue}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

        console.log('Отзывы сохранены в cookie');
    } catch (error) {
        console.error('Ошибка при сохранении в cookie:', error);
    }
}

function loadReviewsFromCookie() {
    try {
        const cookies = document.cookie.split('; ');

        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');

            if (name === 'reviews_data') {
                const decodedValue = decodeURIComponent(value);
                return JSON.parse(decodedValue);
            }
        }

        return null;
    } catch (error) {
        console.error('Ошибка при загрузке из cookie:', error);
        return null;
    }
}

function clearReviewsCookie() {
    document.cookie = 'reviews_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('Cookie с отзывами удалена');
}

window.CookieManager = {
    save: saveReviewsToCookie,
    load: loadReviewsFromCookie,
    clear: clearReviewsCookie
};