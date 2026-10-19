let x = 0;
let xSpeed = 1;
let targetX = 400,
    targetY = 250;
let mousex = targetX,
    mousey = targetY;
let from, to;
let spawnX = 0,
    spawnY = 0;

let evolved = false;

let ballSize = 50;
let ballColor;
let targetColor;
let targetChangeColor;
let foodType;
let tailNumber = 6;
let foodSize = 5;

let Happiness = 0;
let Angriness = 0;
let Sadness = 0;
let Fearfullness = 0;
let Loveness = 0;

let roamAngle = 0,
    roamRadius = 200;
let roamX, roamY;

// background

let bubbleNum = 5;
let xPos = [bubbleNum];
let yPos = [bubbleNum];
let bubbleTimer = [bubbleNum];
let bubbleRadius = [bubbleNum];
let bubbleSpeed = [bubbleNum];

//let tailPastX = targetX, tailPastY = targetY;

// 1) let's declare them with empty arrays
let tailPastX = [];
let tailPastY = [];
let tailRadius = [];

let isSpawned = false;
let wasPressed = false;

//let Chomp;

function setup() {
    createCanvas(800, 500);

    // Chomp = await loadSound("Chomp.mp3");

    ballColor = color("black");
    targetColor = color("black");
    targetChangeColor = color("black");

    for (i = 0; i < bubbleNum; i++) {
        xPos[i] = random(0, width);
        yPos[i] = random(0, height);
        bubbleTimer[i] = random(1 * 60, 10 * 60);
        bubbleRadius[i] = 0;
        bubbleSpeed[i] = random(1, 10);
    }

    background(200);
    foodType = "Angry";

    // 2) let's initiate them!
    for (let i = 0; i < tailNumber; i++) {
        tailPastX[i] = targetX;
        tailPastY[i] = targetY;
        tailRadius[i] = 1;
    }
}

function draw() {
    drawBackground();
    roamAngle += 0.01;
    Keyboard();
    // x+= xSpeed;
    let y = 30 * sin(frameCount * 0.1) + targetY;

    if (x > width) {
        xSpeed *= -1;
    }
    if (x < 0) {
        xSpeed *= -1;
    }

    roamX = width / 2 + cos(roamAngle) * roamRadius;
    roamY = height / 2 + sin(roamAngle) * roamRadius;

    if (mouseIsPressed && !wasPressed && !isSpawned) {
        isSpawned = true;
        spawnY = mouseY;
        spawnX = mouseX;

        wasPressed = true;
    } else {
    }

    // console.log(y)

    if (isSpawned) {
        circle(spawnX, spawnY, 5);

        targetX = lerp(targetX, spawnX, 0.02);
        targetY = lerp(targetY, spawnY, 0.02);
    } else {
        targetX = lerp(targetX, roamX, 0.02);
        targetY = lerp(targetY, roamY, 0.02);
    }

    drawTail(targetX, targetY);
    drawCreature(targetX, targetY, ballSize, ballColor);
    evolve();
    1;
    if (dist(targetX, targetY, spawnX, spawnY) <= ballSize / 2 + foodSize / 2) {
        eatFood(foodType, ballColor);
        isSpawned = false;
    }

    if (!mouseIsPressed && !isSpawned) {
        wasPressed = false;
    }
    ballColor = lerpColor(ballColor, targetChangeColor, 0.02);
}

function createFood(x, y, foodSize, color) {
    circle(x, y, foodSize);
}

function drawCreature(x, y, size, colors) {
    fill(colors);
    circle(x, y, size);
    noStroke;
}

function eatFood(typeofFood, creatureColor) {
    if (isSpawned && !evolved) {
        targetChangeColor = lerpColor(ballColor, targetColor, 0.6);
        // Chomp.play();
        if (typeofFood == "Happy") {
            ballSize += 5;
        }
        if (typeofFood == "Angry") {
            targetColor = color("red");
        }
        if (typeofFood == "Fear") {
            targetColor = color("orange");
        }
        if (typeofFood == "Sad") {
            targetColor = color("blue");
        }
        if (typeofFood == "Love") {
            targetColor = color("pink");
        }
        if (typeofFood == "small") {
        }
    }
}

///honestly might import this directly into the creature itself but I'm worried so I'm going to encapsulate it
function drawTail(x, y, ballRadius) {
    // 3) Finally, we can use them properly!
    for (let i = 0; i < tailNumber; i++) {
        if (i == 0) {
            let percent = 0.25 / (ballSize * ((1 / ballSize) * 2));
            tailPastX[i] = lerp(tailPastX[i], x, percent);
            tailPastY[i] = lerp(tailPastY[i], y, percent);
            tailRadius[i] = ballSize * 0.52;
        } else {
            let percentAdjustment = map(ballSize, 1, 100, 1, 0.1); // make the lerp percentage decrease as the value increases.
            let percent = map(i, 0, tailNumber, 0.3, 0.1) * percentAdjustment;
            tailPastX[i] = lerp(tailPastX[i], tailPastX[i - 1], percent); //0 --> 1 gets slower
            tailPastY[i] = lerp(tailPastY[i], tailPastY[i - 1], percent);
            tailRadius[i] = tailRadius[i - 1] * 0.8;
        }

        if (tailRadius[i] <= 1) {
            tailRadius[i] = 1;
        }

        fill(0);
        circle(tailPastX[i], tailPastY[i], tailRadius[i]);
    }
}

function drawBall(x, y, size, one, two, three) {
    fill(one, two, three);
    circle(x, y, size);
}

function drawBackground() {
    background(90, 190, 255);
    for (i = 0; i < bubbleNum; i++) {
        noFill();
        bubbleTimer[i]++;

        if (bubbleTimer[i] > 15 * 60) {
            bubbleRadius[i] += bubbleSpeed[i];
        }

        if (bubbleRadius[i] >= 1600) {
            xPos[i] = random(0, width);
            yPos[i] = random(0, height);
            bubbleSpeed[i] = random(1, 10);
            bubbleTimer[i] = random(2 * 60, 10 * 60);
            bubbleRadius[i] = 0;
        }

        circle(xPos[i], yPos[i], bubbleRadius[i]);
    }
}

function evolve() {
    if (ballSize >= 105) {
        fill(255);
        evolved = true;
        ballSize = lerp(ballSize, 150, 0.05);

        if (
            Happiness > Angriness + 5 &&
            Happiness > Sadness + 5 &&
            Happiness > Fearfullness + 5 &&
            Happiness > Loveness + 5
        ) {
            arc(targetX, targetY + 30, 30, 30, radians(0), radians(180));
        }
        if (
            Angriness > Happiness + 5 &&
            Angriness > Sadness + 5 &&
            Angriness > Fearfullness + 5 &&
            Angriness > Loveness + 5
        ) {
            arc(targetX, targetY + 30, 30, 30, radians(180), radians(360));
        }
        if (
            Sadness > Happiness + 5 &&
            Sadness > Angriness + 5 &&
            Sadness > Fearfullness + 5 &&
            Sadness > Loveness + 5
        ) {
            arc(targetX, targetY + 30, 30, 30, radians(180), radians(360));
        }

        if (
            Fearfullness > Happiness + 5 &&
            Fearfullness > Angriness + 5 &&
            Fearfullness > Sadness + 5 &&
            Fearfullness > Loveness + 5
        ) {
            arc(targetX, targetY + 30, 30, 30, radians(0), radians(360));
        }
        if (
            Loveness > Happiness + 5 &&
            Loveness > Angriness + 5 &&
            Loveness > Sadness + 5 &&
            Loveness > Fearfullness + 5
        ) {
            arc(targetX, targetY + 30, 30, 30, radians(0), radians(180));
        } else {
            ellipse(targetX - 30, targetY, 60, 30);
            ellipse(targetX + 30, targetY, 60, 30);
            arc(targetX, targetY + 30, 30, 30, radians(180), radians(360));
        }

        // sad  // arc(targetX, targetY + 30, 30, 30, radians(180), radians(360));
        // happy //        arc(targetX, targetY + 30, 30, 30, radians(0), radians(180));
        //shocked    //arc(targetX, targetY + 30, 30, 30, radians(0), radians(360));
    }
}

function Keyboard() {
    if (key === "1") {
        foodType = "Happy";
    }
    if (key === "2") {
        foodType = "Angry";
    }
    if (key === "3") {
        foodType = "Sad";
    }
    if (key === "4") {
        foodType = "Fear";
    }
    if (key === "5") {
        foodType = "Love";
    }
}
``;

function heart(x, y, size) {
    beginShape();
    fill("red");
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}

// make rainbow function that cycles color cuz it sounds fun (that map() stuff you did with target positions to make it rainbowy)

//what you need to do is get whatever the target x is for every second. the ball needs to then lerp to THAT target x and then you need to repeat and count the time for whatever that balls target x was and find its time.

//nvm all you need to do now is just create a for loop that makes 5 balls that progressively get bigger. they also need to all lerp individually to the spawn ball at different speeds so probably they need to become arrays.

// alr now we just need to cause it so that the size is directly proportional to the lerp speed of the tail aka bigger creature slower tail lerp.

// MAKE BOOLEAN TO SPWAN IN FOOD AND ADD COUNTER THING SO IT ONLY SPWANS IN ONE WHEN YOU PRESS MOUSE #youaresooooooosmartdudeB)

//// add metamorphasis (need to find face rig)

/// add background color change

/// if we have time add different movement properties
