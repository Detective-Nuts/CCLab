let imgs, standing;
let imageIndex = 0;
let x = 200;
let y = 200;

let allPromises = []; // empty array

let walkingright = false;
let idle = true;


let idlestanding;

async function setup() {
  createCanvas(600, 600);

  //let allPromises = [];

  for (let i = 1; i <= 4; i++) {
    let filename = "asset/man" + i + ".png";
    let onePromise = loadImage(filename);
    allPromises.push(onePromise);
  }

  imgs = await Promise.all(allPromises);
  idlestanding = imgs[1];
}

function draw() {
  background(220);

  console.log(idle);
  spriteUpdate();


  if (key == "d") {
    x += 5;
    walkingright = true;
    idle = false
  } else {
    walkingright = false;
    idle = true;;
  }

  if (frameCount % 15 == 0) {
    imageIndex++;

    if (imageIndex >= imgs.length) { imageIndex = 0 }
  }
}




function spriteUpdate() {
  if (idle) {
    image(idlestanding, x, y);
  }
  if (walkingright) {
    image(imgs[imageIndex], x, y);
  }
  if (x > width + 25) { x = -240 }
}



// }
