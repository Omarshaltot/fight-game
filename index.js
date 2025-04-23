// #region Canvas Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
// #endregion

// #region Constants
const gravity = 0.2;
// #endregion

// #region Sprite and draw Class and update
class sprite {
    constructor({ position, velocity, color, offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.health = 100;
        this.color = color
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: offset,
            width: 100,
            height: 50,
        };
        this.isattacking

    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.isattacking) {

            c.fillStyle = 'green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isattacking = true;
        setTimeout(() => {
            this.isattacking = false;
        }, 100);

    }
}

// #endregion

// #region Player and Enemy Setup
const player = new sprite({
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
});

const enemy = new sprite({
    position: {
        x: 600,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,
        y: 0,
    },
    color: 'blue',
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

function determineWinner({ player, enemy }) {
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Draw';
        console.log('draw');
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
        timer = 0;
        console.log('player 1 wins');
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
        timer = 0;
        console.log('player 2 wins');
    }
}

let timer = 60;
function decreaseTimer() {
    setTimeout(decreaseTimer, 1000);
    if (timer > 0) {
        timer--
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
    player.update('red');
    enemy.update('blue');
    //player movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -2;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 2;
    }
    //enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -2;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 2;
    }
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) && player.isattacking) {
        console.log('player hit');
        player.isattacking = false;
        enemy.health -= 10;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) && enemy.isattacking) {
        console.log('enemy hit');
        enemy.isattacking = false;
        player.health -= 10;
        document.querySelector('#playerHealth').style.width = player.health + '%';

        // End game based on health
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
            player.velocity.y = -10;
            break;
        case ' ':
            player.attack();
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
    }
});

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            enemy.lastKey = 'ArrowRight';
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -10;
            break;
        case "m":
            enemy.attack();
            break;
    }

});
// #endregion