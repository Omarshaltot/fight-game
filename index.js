const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

class sprite {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
            this.position.y = canvas.height - this.height
        } else {
            this.velocity.y += gravity
        }
    }
}


const player = new sprite({
    position: {
        x: 200,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
})

const enemy = new sprite({
    position: {
        x: 600,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
})

console.log(enemy)

console.log(player)


const keys = {

    a:
    {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    w: {
        pressed: false
    },

}
let lastKey
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {

        player.velocity.x = -1
    } else if
        (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 1
    }
    else if (keys.w.pressed && player.lastKey === 'w') {
        player.velocity.y = -5
    }
}
animate()
//actions


window.addEventListener('keyup', (event) => {
    console.log(event.key)

    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
    }
    switch (event.key) {
        case 'a':
            keys.a.pressed = false
            break
    }
    switch (event.key) {
        case 'w':
            keys.w.pressed = false
            break
    }
})

window.addEventListener('keydown', (event) => {
    console.log(event.key)
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
    }
    switch (event.key) {
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
    }
    switch (event.key) {
        case 'w':
            keys.w.pressed = true
            player.lastKey = 'w'
            break
    }
})
