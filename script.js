const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = "cocomelon.png";   // Bird image
bg.src = "https://i.imgur.com/jUwKfbD.png";     // Background image
fg.src = "https://i.imgur.com/ULkIVzO.png";     // Foreground image
pipeNorth.src = "pipe.png"; // North pipe image
pipeSouth.src = "pipe.png"; // South pipe image

// Variables
let gap = 85;
let constant = pipeNorth.height + gap;
let bX = 10;
let bY = 150;
let gravity = 1.5;
let score = 0;

// Pipe coordinates
let pipes = [];

pipes[0] = {
    x: canvas.width,
    y: 0
};

// Key press event
document.addEventListener("keydown", moveUp);

function moveUp() {
    bY -= 25;
}

// Draw function
function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeNorth, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipeSouth, pipes[i].x, pipes[i].y + constant);

        pipes[i].x--;

        if (pipes[i].x === 125) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        // Detect collision
        if (
            (bX + bird.width >= pipes[i].x && bX <= pipes[i].x + pipeNorth.width &&
            (bY <= pipes[i].y + pipeNorth.height || bY + bird.height >= pipes[i].y + constant)) ||
            bY + bird.height >= canvas.height - fg.height
        ) {
            location.reload(); // Reload the game
        }

        if (pipes[i].x == 5) {
            score++;
        }
    }

    ctx.drawImage(fg, 0, canvas.height - fg.height);
    ctx.drawImage(bird, bX, bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

draw();
