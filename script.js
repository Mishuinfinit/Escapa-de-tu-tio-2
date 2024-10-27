const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const key = document.getElementById("key");
const door = document.getElementById("door");
const gameOverOverlay = document.getElementById("gameOver");
const nextLevelOverlay = document.getElementById("nextLevel");
const levelCounter = document.getElementById("levelCounter");
const gameArea = document.querySelector(".game-area");

let playerPosition = { x: 50, y: 50 };
let enemyPosition = { x: 300, y: 300 };
let keyPosition = { x: getRandomPosition(), y: getRandomPosition() };
let doorPosition = { x: getRandomPosition(), y: getRandomPosition() };
let playerSpeed = 10;
let enemySpeed = 2;
let hasKey = false;
let level = 1;
let canMove = true; // Variable para controlar el movimiento del jugador

// Movimiento del jugador con teclas de flechas y WASD
document.addEventListener("keydown", (event) => {
    if (!canMove) return; // Detiene el movimiento si no se permite mover

    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
            if (playerPosition.y > 0) playerPosition.y -= playerSpeed;
            break;
        case "ArrowDown":
        case "s":
        case "S":
            if (playerPosition.y < gameArea.clientHeight - 30) playerPosition.y += playerSpeed;
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            if (playerPosition.x > 0) playerPosition.x -= playerSpeed;
            break;
        case "ArrowRight":
        case "d":
        case "D":
            if (playerPosition.x < gameArea.clientWidth - 30) playerPosition.x += playerSpeed;
            break;
    }
    updatePositions();
    checkCollisions();
});

// Movimiento del enemigo hacia el jugador
function moveEnemy() {
    const dx = playerPosition.x - enemyPosition.x;
    const dy = playerPosition.y - enemyPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        enemyPosition.x += (dx / distance) * enemySpeed;
        enemyPosition.y += (dy / distance) * enemySpeed;
    }
    updatePositions();
    checkCollisions();
}

// Actualiza las posiciones de los elementos en el juego
function updatePositions() {
    player.style.left = playerPosition.x + "px";
    player.style.top = playerPosition.y + "px";
    enemy.style.left = enemyPosition.x + "px";
    enemy.style.top = enemyPosition.y + "px";
    key.style.left = keyPosition.x + "px";
    key.style.top = keyPosition.y + "px";
    door.style.left = doorPosition.x + "px";
    door.style.top = doorPosition.y + "px";
}

// Verifica las colisiones
function checkCollisions() {
    const playerEnemyDist = getDistance(playerPosition, enemyPosition);
    const playerKeyDist = getDistance(playerPosition, keyPosition);
    const playerDoorDist = getDistance(playerPosition, doorPosition);

    if (playerEnemyDist < 30) {
        gameOver();
    } else if (playerKeyDist < 30 && !hasKey) {
        hasKey = true;
        key.style.display = "none";
        door.style.display = "block";
    } else if (playerDoorDist < 30) {
        if (hasKey) {
            nextLevel(); // Pasa al siguiente nivel si el jugador tiene la llave
        } else {
            // Si el jugador no tiene la llave, bloquea el movimiento hacia la puerta
            canMove = false;
            setTimeout(() => canMove = true, 500); // Vuelve a permitir movimiento tras un pequeño tiempo
        }
    }
}

// Obtiene una posición aleatoria para la llave o la puerta
function getRandomPosition() {
    return Math.floor(Math.random() * (gameArea.clientWidth - 30));
}

// Calcula la distancia entre dos puntos
function getDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Muestra el mensaje de Game Over
function gameOver() {
    gameOverOverlay.style.display = "block";
    clearInterval(enemyMovement);
}

// Permite revivir al jugador en el mismo nivel
function revive() {
    gameOverOverlay.style.display = "none";
    resetPositions();
    canMove = true;
    enemyMovement = setInterval(moveEnemy, 50);
}

// Pasa al siguiente nivel
function nextLevel() {
    nextLevelOverlay.style.display = "block";
    canMove = false; // Desactiva el movimiento después de completar el nivel
    clearInterval(enemyMovement);
}

// Inicia el siguiente nivel
function startNextLevel() {
    nextLevelOverlay.style.display = "none";
    level++;
    hasKey = false;
    levelCounter.textContent = "Nivel: " + level;
    enemySpeed += 0.5;  // Incrementa la velocidad del enemigo
    canMove = true; // Permite el movimiento al iniciar el siguiente nivel
    resetPositions();
    enemyMovement = setInterval(moveEnemy, 50);
}

// Reinicia posiciones del jugador, enemigo, llave y puerta
function resetPositions() {
    playerPosition = { x: 50, y: 50 };
    enemyPosition = { x: 300, y: 300 };
    keyPosition = { x: getRandomPosition(), y: getRandomPosition() };
    doorPosition = { x: getRandomPosition(), y: getRandomPosition() };
    key.style.display = "block";
    door.style.display = "none";
    updatePositions();
}

// Inicia el movimiento del enemigo
let enemyMovement = setInterval(moveEnemy, 50);

