let CapamanchaG, CapamanchaN, Capalineas;
let cant = 5;
let manchaG = [];
let manchaN = [];
let lineas = [];
let conteoG = [];
let conteoN = [];
let conteoLineas = [];

let tiempoMovimientoMouse = 0;

let anguloRotacionManchaG = [];
let anguloRotacionManchaN = [];
let anguloRotacionLineas = [];


function preload() {
  for (let i = 0; i < cant; i++) {
    let manchagris = "data/manchasg" + (i + 1) + ".png";
    manchaG[i] = loadImage(manchagris);
    conteoG[i] = 0;
  }

  for (let i = 0; i < cant; i++) {
    let manchanegra = "data/manchasn" + (i + 1) + ".png";
    manchaN[i] = loadImage(manchanegra);
    conteoN[i] = 0;
  }

  for (let i = 0; i < cant; i++) {
    let dlineas = "data/Linea" + (i + 1) + ".png";
    lineas[i] = loadImage(dlineas);
    conteoLineas[i] = 0;
  }
}

function setup() {
  createCanvas(550, 800);

  CapamanchaG = createGraphics(550, 800);
  CapamanchaN = createGraphics(550, 800);
  Capalineas = createGraphics(550, 800);

  anguloRotacionManchaG = new Array(cant);
  anguloRotacionManchaN = new Array(cant);
  anguloRotacionLineas = new Array(cant);

   
}

function draw() {
  background(150);

  // capa mancha NEGRA
  //CapamanchaN.clear();.....Esto limpia la capa
  CapamanchaN.noFill();
  CapamanchaN.noStroke();
  CapamanchaN.blendMode(BLEND);
  for (let i = 0; i < cant; i++) {
    if (mouseY > 0 && mouseY < 266 && conteoN[i] <= 5) {
      let x = random(width);
      let y = random(height);
      let w = random(150, 250);
      let h = random(150, 250);
      CapamanchaN.image(manchaN[i], x, y, w, h);
      conteoN[i]++;
    }
  }
  image(CapamanchaN, 0, 0);

  // capa Lineas
  //Capalineas.clear();.....Esto limpia la capa
  Capalineas.noFill();
  Capalineas.noStroke();
  Capalineas.blendMode(BLEND);
  for (let i = 0; i < cant; i++) {
    if (mouseY > 532 && mouseY < 800 && conteoLineas[i] <= 5) {
      let x = random(width);
      let y = random(height);
      let w = random(5, 50);
      let h = random(5, 50);
      Capalineas.image(lineas[i], x, y, w, h);
      conteoLineas[i]++;
    }
  }
  image(Capalineas, 0, 0);

  // capa mancha gris
  //CapamanchaG.clear();.....Esto limpia la capa
  CapamanchaG.noFill();
  CapamanchaG.noStroke();
  CapamanchaG.blendMode(BLEND);
  for (let i = 0; i < cant; i++) {
    if (mouseY > 266 && mouseY < 532 && conteoG[i] <= 5) {
      let x = random(width);
      let y = random(height);
      let w = random(250, 450);
      let h = random(250, 450);
      CapamanchaG.image(manchaG[i], x, y, w, h);
      conteoG[i]++;
    }
  }
  image(CapamanchaG, 0, 0);


  if (millis() - tiempoMovimientoMouse > 2000) {
    // Colocar la pantalla en negro
    background(0);
  }

  // Si el mouse se mueve, quitar la pantalla en negro
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    tiempoMovimientoMouse = millis();
  }
    
    
    for (let i = 0; i < cant; i++) {
    anguloRotacionManchaG[i] = 0;
    anguloRotacionManchaN[i] = 0;
    anguloRotacionLineas[i] = 0;
  }
  
    for (let i = 0; i < cant; i++) {
    manchaG[i].rotate(anguloRotacionManchaG[i]);
    manchaN[i].rotate(anguloRotacionManchaN[i]);
    lineas[i].rotate(anguloRotacionLineas[i]);

    // Incrementar el ángulo de rotación en cada iteración
    anguloRotacionManchaG[i] += PI/60;
    anguloRotacionManchaN[i] += PI/60;
    anguloRotacionLineas[i] += PI/60;
  }
}
