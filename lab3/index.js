function playAdventureGame() {
    let playerName = prompt("Привет, путник! Как тебя зовут?");

    if (playerName === null || playerName.trim() === "") {
        alert("Ошибка: Вы не представились! Игра не может начаться без имени.");
        return;
    }

    playerName = playerName.trim();

    let startGame = confirm(playerName + ", ты стоишь перед темным лесом. Хочешь войти в него?");
    if (!startGame) {
        alert("Ты решил остаться дома. Скучная жизнь... Игра окончена.");
        return;
    }

    alert("Ты вошел в лес. Вдруг перед тобой появляется гоблин и преграждает путь.");

    let riddleAnswer = prompt("Гоблин говорит: 'Отгадай загадку, и я пропущу тебя. \nЧто может быть больше горы, но легче перышка?'");

    if (riddleAnswer === null) {
        alert("Ты промолчал. Гоблин рассердился и прогнал тебя. Игра окончена.");
        return;
    }

    let correctAnswer = "тень";
    let userAnswer = riddleAnswer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
        alert("Правильно! Это тень. Гоблин восхищен твоим умом и дарит тебе золото.");
        let playAgain = confirm(playerName + ", хочешь сыграть еще раз?");
        if (playAgain) {
            playAdventureGame();
        } else {
            alert("Спасибо за игру!");
        }
    } else {
        alert("Неверно! Гоблин сказал, что правильный ответ - тень. Он отобрал у тебя ботинки.");
        if (riddleAnswer.trim() === "") {
            alert("Кстати, ты вообще ничего не ответил. Так дела не делаются!");
        }
    }
}