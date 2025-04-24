const gravity = 0.2; // Keep gravity here

class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMaze = 1 }) { // Add context parameter
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMaze = framesMaze; // Number of frames in the sprite sheet
        this.framesCurrent = 0; // Current frame
        this.framesElapsed = 0; // Frames elapsed since last update
        this.framesHold = 10; // Frames to hold each frame

    }

    draw() {
        c.drawImage(this.image,
            this.framesCurrent * (this.image.width / this.framesMaze), // Calculate the x position of the current frame
            0,
            this.image.width / this.framesMaze,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMaze) * this.scale,
            this.image.height * this.scale
        ); // Use context
    }

    update() {
        this.draw();
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMaze - 1) {
                this.framesCurrent++;
            }
            else {
                this.framesCurrent = 0;
            }
        }
    }
}

class Fighter {
    constructor({ position, velocity, color, offset, context }) { // Add context parameter
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.health = 100;
        this.color = color;
        this.context = context; // Store context
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: offset,
            width: 100,
            height: 50,
        };
        this.isattacking = false; // Initialize isattacking
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.isattacking) {
            this.context.fillStyle = 'green';
            this.context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
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
