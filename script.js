const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const birdImage = new Image();
birdImage.src = 'cocomelon.png'; // Path to your bird image

const pipeTopImage = new Image();
pipeTopImage.src = 'pipe.png'; // Path to your top pipe image

const pipeBottomImage = new Image();
pipeBottomImage.src = 'pipe.png'; // Path to your bottom pipe image

const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.5,
    lift: -10,
    velocity: 0,
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    },
    draw() {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    }
};

const pipes = [];
const pipeWidth = 80;
const pipeGap = 150;
let frameCount = 0;
let score = 0;
let gameOver = false;

function addPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 20) + 10;
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        width: pipeWidth
    });
}

function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= 3;

        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            score++;
        }

        // Check for collision
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImage, pipe.x, 0, pipe.width, pipe.top);
        ctx.drawImage(pipeBottomImage, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw();
    updatePipes();
    drawPipes();
    drawScore();

    if (frameCount % 75 === 0) {
        addPipe();
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over!', 80, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press R to Restart', 90, canvas.height / 2 + 40);
    }
    frameCount++;
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        bird.flap();
    } else if (event.code === 'KeyR' && gameOver) {
        resetGame();
        gameLoop();
    }
});

// Start the game loop when images are loaded
birdImage.onload = () => {
    pipeTopImage.onload = () => {
        pipeBottomImage.onload = () => {
            gameLoop();
        };
    };
};
