// #region Canvas Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
// #endregion

// #region Player and Enemy Setup
const player = new Fighter({
    position: {
        x: 200,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    color: 'red',
    context: c, // Pass context
    imageSrc: './img/samuraiMack/Idle.png',
    framesMaze: 8,
    scale: 2.5,
    framesHold: 10,
    offset: {
        x: 215,
        y: 157,
    },
    Sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMaze: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMaze: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMaze: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMaze: 2,
        },
        attack1: {

            imageSrc: `./img/samuraiMack/Attack1.png`,
            framesMaze: 6,
        },
        attack2: {
            imageSrc: `./img/samuraiMack/Attack2.png`,
            framesMaze: 6,
        },
        takeHit: {
            imageSrc: `./img/samuraiMack/Take Hit - white silhouette.png`,
            framesMaze: 4,
        },
        death: {
            imageSrc: `./img/samuraiMack/Death.png`,
            framesMaze: 6,
        },


    },
    attackBox: {
        offset: {
            x: 95,
            y: 50,
        },
        width: 150,
        height: 50,
    },
    getRandomAttackSprite() {
        const randNum = Math.random() < 0.5 ? 1 : 2;
        return `attack${randNum}`;
    },
});

const enemy = new Fighter({
    position: {
        x: 600,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/kenji/Idle.png',
    framesMaze: 4,
    scale: 2.5,
    framesHold: 10,
    offset: {
        x: 215,
        y: 167,
    }, // <-- keep this for sprite offset
    Sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMaze: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMaze: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMaze: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMaze: 2,
        },
        attack1: {
            imageSrc: `./img/kenji/Attack1.png`,
            framesMaze: 4,
        },
        attack2: {
            imageSrc: `./img/kenji/Attack2.png`,
            framesMaze: 4,
        },
        takeHit: {
            imageSrc: `./img/kenji/Take hit.png`,
            framesMaze: 3,
        },
        death: {
            imageSrc: `./img/kenji/Death.png`,
            framesMaze: 7,
        },
    },
    attackBox: {
        offset: {
            x: -100,
            y: -50,
        },
        width: 150,
        height: 50,
    },
    color: 'blue',
    context: c, // Pass context
});

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
});
const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMaze: 6,
});
console.log(enemy);
console.log(player);
// #endregion

// #region Key States
const keys = {
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
};
// #endregion

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}
function gameover(winner) {
    // Only stop the winner if they are dead, otherwise let them stay idle
    if (winner && winner.dead) {
        winner.velocity.x = 0;
        winner.velocity.y = 0;
    }
    // Always stop the loser
    if (player.dead) {
        player.velocity.x = 0;
        player.velocity.y = 0;
    }
    if (enemy.dead) {
        enemy.velocity.x = 0;
        enemy.velocity.y = 0;
    }
}

function determineWinner({ player, enemy }) {
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Draw';
        console.log('draw');
        gameover();
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
        timer = 0;
        console.log('player 1 wins');
        gameover(player);
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
        timer = 0;
        console.log('player 2 wins');
        gameover(enemy);

    }
}

let timer = 60;
function decreaseTimer() {
    setTimeout(decreaseTimer, 1000);
    if (timer > 0) {
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy });
    }
}
decreaseTimer();

// #region Animation Loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    // Game over if either player is dead
    if (player.dead || enemy.dead) {
        // Allow the winner to stay in idle animation and move if not dead
        if (!player.dead) {
            // Player is alive, allow movement and idle animation
            player.switchSprite('idle');
        }
        if (!enemy.dead) {
            // Enemy is alive, allow movement and idle animation
            enemy.switchSprite('idle');
        }
        // Stop movement for the dead character
        if (player.dead) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
        if (enemy.dead) {
            enemy.velocity.x = 0;
            enemy.velocity.y = 0;
        }
        return;
    }

    //player movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -2;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 2;
        player.switchSprite('run');
    }
    else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    //enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -2;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 2;
        enemy.switchSprite('run');
    }
    else {
        enemy.switchSprite('idle');
    }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // --- HIT DETECTION WITH HIT FRAME CHECK AND HIT FLAG ---
    const playerHitFrame = 4; // adjust as needed for your attack sprite
    const enemyHitFrame = 2;  // adjust as needed for your attack sprite

    if (
        !enemy.dead &&
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isattacking &&
        !player.hasHit &&
        (
            player.image === player.Sprites.attack1.image ||
            player.image === player.Sprites.attack2.image
        ) &&
        player.framesCurrent === playerHitFrame
    ) {
        console.log('player hit');
        enemy.takeHit();
        player.hasHit = true;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
        !player.dead &&
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        enemy.isattacking &&
        !enemy.hasHit &&
        (
            enemy.image === enemy.Sprites.attack1.image ||
            enemy.image === enemy.Sprites.attack2.image
        ) &&
        enemy.framesCurrent === enemyHitFrame
    ) {
        console.log('enemy hit');
        player.takeHit();
        enemy.hasHit = true;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy });
    }
}
// #endregion

animate();

// #region Event Listeners
// Player actions
window.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            player.velocity.y = 0;
            break;
    }
});
let jumpCount = 0;
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':

            if (player.velocity.y > 0) {
                break;
            };
            console.log(player.velocity.y);
            player.velocity.y = -10;
            break;
        case ' ':
            if (!player.dead) player.attack();
            break;
    }
});

// Enemy actions
window.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            enemy.velocity.y = 0;
            break;
        case "m":
            if (!enemy.dead) enemy.attack();
            break;
    }
});
// #endregion