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
    constructor({ position, velocity, color }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.color = color
        this.attackBox = {
            position: this.position,
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
    color: 'blue',
});

console.log(enemy);
console.log(player);
// #endregion

//omar 
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


    // Collision detection
    if (player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height && player.isattacking) {
        player.isattacking = false;
        console.log('hit');
    }
}
animate();
// #endregion

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
    }
});
// #endregion