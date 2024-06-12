
// Capas
let CapamanchaG;
let CapamanchaN;
let Capalineas;
// Cantidad
let cant = 5;
// Arreglos
let manchaG = [];
let manchaN = [];
let lineas = [];
// Contadores de...
let conteoG = [];
let conteoN = [];
let conteoLineas = [];
let manchasG = [];
let manchasN = [];
let manchasLineas = [];
let tiempoDentroCapaN = 0;
let tiempoDentroCapaG = 0;
let tiempoDentroCapaL = 0;
let tiempoAnterior = 0;
let tiempoLimite = 1000;
let tiempoRotacion = 2000;
let limiteImagenes = 5;
// Booleans 
let rotarG = false;
let rotarN = false;
let rotarLineas = false;
//Sonido
let mic;
let pitch;
let audioContext;
let nivelSonidoumbral = 0.0;
let nivelSonido = 0;
let gestorAmp; 
let gestorPitch;


// Carga de imagenes
function preload() {
  for (let i = 0; i < cant; i++) {
    manchaG[i] = loadImage("data/manchasg" + (i + 1) + ".png");
    conteoG[i] = 0;
    manchaN[i] = loadImage("data/manchasn" + (i + 1) + ".png");
    conteoN[i] = 0;
    lineas[i] = loadImage("data/Linea" + (i + 1) + ".png");
    conteoLineas[i] = 0;
  }
}

function setup() {
  createCanvas(550, 800);
  CapamanchaG = createGraphics(550, 800);
  CapamanchaN = createGraphics(550, 800);
  Capalineas = createGraphics(550, 800);

  mic = new p5.AudioIn();
  mic.start();

  userStarAudio();

  gestorAmp = new GestorSenial(0.0, 0.5);
  gestorPitch = new GestorSenial(40, 60);
}

function draw() {
  background(200);

  let nivelSonido = mic.getLevel();
  gestorAmp.actualizar(nivelSonido);
  
  let haySonido = gestorAmp.filtrada > nivelSonidoumbral;
  let empezoElSonido = haySonido && !antesHabiaSonido;
  let teminoElSonido = !haySonido && antesHabiaSonido;

  // Contadores
  let tiempoTranscurrido = millis() - tiempoAnterior;
  tiempoAnterior = millis();

  // Activan contadores
  if (nivelSonido > 0.0 && nivelSonido < 0.1) {
    tiempoDentroCapaN += tiempoTranscurrido;
    tiempoDentroCapaG = 0;
    tiempoDentroCapaL = 0;
  } else if (nivelSonido > 0.1 && nivelSonido < 0.2) {
    tiempoDentroCapaL += tiempoTranscurrido;
    tiempoDentroCapaG = 0;
    tiempoDentroCapaN = 0;
  } else if (nivelSonido > 0.2 && nivelSonido < 0.3) {
    tiempoDentroCapaG += tiempoTranscurrido;
    tiempoDentroCapaN = 0;
    tiempoDentroCapaL = 0;
  } else {
    tiempoDentroCapaN = 0;
    tiempoDentroCapaG = 0;
    tiempoDentroCapaL = 0;
  }
  // Si el mouse....
  if (nivelSonido > 0.1 && conteoN.reduce((a, b) => a + b, 0) < limiteImagenes) {
    if (tiempoDentroCapaN >= tiempoLimite) {
      let i = floor(random(cant));
      let x = random(width);
      let y = random(height);
      let w = random(150, 250);
      let h = random(150, 250);
      manchasN.push(new ManchaN(manchaN[i], x, y, w, h));
      conteoN[i]++;
      tiempoDentroCapaN = 0;
    }
  } else if (nivelSonido > 0.1 && conteoLineas.reduce((a, b) => a + b, 0) < limiteImagenes) {
    if (tiempoDentroCapaL >= tiempoLimite) {
      let i = floor(random(cant));
      let x = random(width);
      let y = random(height);
      let w = random(5, 50);
      let h = random(5, 50);
      manchasLineas.push(new Lineas(lineas[i], x, y, w, h));
      conteoLineas[i]++;
      tiempoDentroCapaL = 0;
    }
  } else if (nivelSonido > 0.1 && conteoG.reduce((a, b) => a + b, 0)< limiteImagenes) {
    if (tiempoDentroCapaG >= tiempoLimite) {
      let i = floor(random(cant));
      let x = random(width);
      let y = random(height);
      let w = random(250, 450);
      let h = random(250, 450);
      manchasG.push(new ManchaG(manchaG[i], x, y, w, h));
      conteoG[i]++;
      tiempoDentroCapaG = 0;
    }
  }

  // Condicionales con posicion = booleanas
 if (nivelSonido > 0.0 && conteoN.reduce((a, b) => a + b, 0)< limiteImagenes) {
    rotarN = true;
    rotarG = false;
    rotarLineas = false;
  } else if (nivelSonido > 0.0 && conteoLineas.reduce((a, b) => a + b, 0)< limiteImagenes) {
    rotarLineas = true;
    rotarG = false;
    rotarN = false;
  } else if (nivelSonido > 0.0 && conteoG.reduce((a, b) => a + b, 0)< limiteImagenes) {
    rotarG = true;
    rotarN = false;
    rotarLineas = false;
  } else {
    rotarN = false;
    rotarLineas = false;
    rotarG = false;
  } 
  
  // Hace que se borre el paso de la imagen
  CapamanchaN.clear();
  Capalineas.clear();
  CapamanchaG.clear();

  if (teminoElSonido) {
  manchasN.forEach(m => {
    if (rotarN) {
      m.rotar();
    }
    m.dibujar(CapamanchaN);
  });
  }

  if (teminoElSonido) {
  manchasLineas.forEach(m => {
    if (rotarLineas) {
      m.rotar();
    }
    m.dibujar(Capalineas);
  });
  }
  if (teminoElSonido) {
  manchasG.forEach(m => {
    if (rotarG) {
      m.rotar();
    }
    m.dibujar(CapamanchaG);
  });
  }
  image(CapamanchaN, 0, 0);
  image(Capalineas, 0, 0);
  image(CapamanchaG, 0, 0);
}
//--------------------------------------------------------------------
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}
//--------------------------------------------------------------------
function modelLoaded() {
//select('#status').html('Model Loaded');
getPitch();
//console.log( "entro aca !" );

}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {      
      let midiNum = freqToMidi(frequency);
      //console.log( midiNum );

      gestorPitch.actualizar( midiNum );

    }
    getPitch();
  })
}
