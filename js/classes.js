const gravity = 0.2; // Keep gravity here

class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMaze = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMaze = framesMaze;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMaze),
            0,
            this.image.width / this.framesMaze,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMaze) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        // Prevent animation from looping if dead and on last frame of death animation
        if (
            this.image === this.Sprites?.death?.image &&
            this.framesCurrent === this.Sprites.death.framesMaze - 1
        ) {
            return;
        }
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMaze - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        // Only animate frames if not dead, or if not on last frame of death animation
        if (
            !this.dead ||
            (this.image === this.Sprites?.death?.image && this.framesCurrent < this.Sprites.death.framesMaze - 1)
        ) {
            this.animateFrames();
        }
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMaze = 1,
        offset = { x: 0, y: 0 },
        Sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMaze,
            offset
        });

        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.color = color;
        this.isattacking = false;
        this.hasHit = false;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.Sprites = Sprites;
        this.dead = false;

        for (const sprite in this.Sprites) {
            this.Sprites[sprite].image = new Image();
            this.Sprites[sprite].image.src = this.Sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        // Only animate frames if not dead, or if not on last frame of death animation
        if (
            !this.dead ||
            (this.image === this.Sprites?.death?.image && this.framesCurrent < this.Sprites.death.framesMaze - 1)
        ) {
            this.animateFrames();
        }
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        if (this.dead) return;
        this.switchSprite('attack1');
        this.isattacking = true;
        this.hasHit = false;
    }

    takeHit() {
        if (this.dead) return;
        this.health -= 10;
        if (this.health <= 0) {
            if (!this.dead) {
                this.switchSprite('death');
                this.dead = true;
            }
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.Sprites.death.image) {
            if (this.framesCurrent === this.Sprites.death.framesMaze - 1) {
                this.dead = true;
                return;
            }
            return;
        }
        if (this.dead && sprite !== 'death') {
            return;
        }
        if (
            this.image === this.Sprites.attack1.image &&
            this.framesCurrent < this.Sprites.attack1.framesMaze - 1
        )
            return;
        if (
            this.image === this.Sprites.takeHit.image &&
            this.framesCurrent < this.Sprites.takeHit.framesMaze - 1
        )
            return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.Sprites.idle.image) {
                    this.image = this.Sprites.idle.image;
                    this.framesMaze = this.Sprites.idle.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.Sprites.run.image) {
                    this.image = this.Sprites.run.image;
                    this.framesMaze = this.Sprites.run.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.Sprites.jump.image) {
                    this.image = this.Sprites.jump.image;
                    this.framesMaze = this.Sprites.jump.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.Sprites.fall.image) {
                    this.image = this.Sprites.fall.image;
                    this.framesMaze = this.Sprites.fall.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.Sprites.attack1.image) {
                    this.image = this.Sprites.attack1.image;
                    this.framesMaze = this.Sprites.attack1.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack2':
                if (this.image !== this.Sprites.attack2.image) {
                    this.image = this.Sprites.attack2.image;
                    this.framesMaze = this.Sprites.attack2.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.Sprites.takeHit.image) {
                    this.image = this.Sprites.takeHit.image;
                    this.framesMaze = this.Sprites.takeHit.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.Sprites.death.image) {
                    this.image = this.Sprites.death.image;
                    this.framesMaze = this.Sprites.death.framesMaze;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}
