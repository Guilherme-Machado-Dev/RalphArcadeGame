// Estado principal do jogo
const state = {
    view: {
        squares: document.querySelectorAll(".square"), // todos os quadrados do painel
        enemy: document.querySelector(".enemy"),       // inimigo (classe aplicada dinamicamente)
        timeleft: document.querySelector("#time-left"),// contador de tempo
        score: document.querySelector("#score"),       // pontuação
    },
    values: {
        timerId: null,             // controla movimento do inimigo
        countDownTimerId: null,    // controla contagem regressiva
        gameVelocity: 1000,        // velocidade do inimigo (ms)
        hitPosition: 0,            // posição atual do inimigo
        result: 0,                 // pontuação atual
        curretTime: 60,            // tempo inicial
        lives: 3,                  // número de vidas
    },
};

// Função de contagem regressiva
function countDown() {
    state.values.curretTime--;
    state.view.timeleft.textContent = state.values.curretTime;

    if (state.values.curretTime <= 0) {
        clearInterval(state.values.countDownTimerId);
        clearInterval(state.values.timerId);
        alert("O tempo acabou! Sua pontuação final foi: " + state.values.result);
        resetGame();
    }
}

// Som ao acertar o inimigo
function playSound() {
    let audio = new Audio("./src/audios/audiocoin.m4a");
    audio.volume = 0.2;
    audio.play();
}

// Escolhe aleatoriamente um quadrado para o inimigo aparecer
function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

// Faz o inimigo se mover periodicamente
function moveEnemy() {
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// Atualiza o contador de vidas na tela
function updateLives() {
    document.getElementById("lives").textContent = "x" + state.values.lives;
}

// Reduz uma vida e verifica se acabou
function loseLife() {
    state.values.lives--;
    updateLives();

    if (state.values.lives === 0) {
        clearInterval(state.values.countDownTimerId);
        clearInterval(state.values.timerId);
        alert("Game Over! Você errou 3 vezes. O jogo vai reiniciar.");
        resetGame();
    }
}

// Listener para cliques nos quadrados
function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                // Acertou o inimigo
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound();
            } else {
                // Clique errado → perde vida
                loseLife();
            }
        });
    });
}

// Reinicia o jogo
function resetGame() {
    clearInterval(state.values.countDownTimerId);
    clearInterval(state.values.timerId);

    state.values.curretTime = 60;
    state.values.result = 0;
    state.values.lives = 3;

    state.view.score.textContent = state.values.result;
    state.view.timeleft.textContent = state.values.curretTime;
    updateLives();

    state.values.countDownTimerId = setInterval(countDown, 1000);
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// Inicializa o jogo
function init() {
    moveEnemy();
    addListenerHitBox();
    state.values.countDownTimerId = setInterval(countDown, 1000);
    updateLives();
}

init();