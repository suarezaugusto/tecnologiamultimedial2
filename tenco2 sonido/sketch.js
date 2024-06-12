
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
//SONIDO
let monitorear = false;

let mic;
let pitch;
let audioContext;

let gestorAmp;
let gestorPitch;


let umbral_sonido = 0.03;
let antesHabiaSonido;

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

/*let animaciones = [];
let imagenFrente;
let imagenFondo;
let colorActual;
let cual = 0;
let xActual, yActual;
let dirActual;*/

function preload(){
  for (let i = 0; i < cant; i++) {
    manchaG[i] = loadImage("data/manchasg" + (i + 1) + ".png");
    conteoG[i] = 0;
    manchaN[i] = loadImage("data/manchasn" + (i + 1) + ".png");
    conteoN[i] = 0;
    lineas[i] = loadImage("data/Linea" + (i + 1) + ".png");
    conteoLineas[i] = 0;
  }
  /*animaciones[0] = new Animacion( "data/tinta1/foto" , 5 , 1 , 235 );
  animaciones[1] = new Animacion( "data/tinta2/foto" , 5 , 1 , 41 );
  animaciones[2] = new Animacion( "data/tinta3/foto" , 5 , 1 , 269 );
  animaciones[3] = new Animacion( "data/tinta4/foto" , 5 , 1 , 84 );
  animaciones[4] = new Animacion( "data/tinta5/foto" , 5 , 4 , 43 );*/
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  //capaspgraphics
  CapamanchaG = createGraphics(displayWidth, displayHeight);
  CapamanchaN = createGraphics(displayWidth, displayHeight);
  Capalineas = createGraphics(displayWidth, displayHeight);

  //inicializo la escucha de sonido
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  //acá le pido que llame a startPitch
  mic.start( startPitch );

  //hay que agregar esto
  userStartAudio();

  background(255);
  
  //inicializo los objetos de gestión de señal
  gestorAmp = new GestorSenial( 0.0 , 0.5 );
  gestorPitch = new GestorSenial( 40 , 80 );

 /* imagenFrente = createGraphics( width , height );
  imagenFrente.imageMode( CENTER );
  imagenFondo = createGraphics( width , height );
  imagenFondo.imageMode( CENTER );
  actualizarColor();*/
  
}

//function actualizarColor( valor_){
 // push();
 // colorMode( HSB , 360 , 100 , 100 , 100 );
  //pop();
//}

function draw() {
  background(0);

  //cuandoHaySonido
  let vol = mic.getLevel();
  gestorAmp.actualizar( vol );

  let haySonido = gestorAmp.filtrada > umbral_sonido;

  let empezoElSonido = haySonido && !antesHabiaSonido;
  let terminoElSonido = !haySonido && antesHabiaSonido;
  
  // Contadores
  let tiempoTranscurrido = millis() - tiempoAnterior;
  tiempoAnterior = millis();

  if( empezoElSonido ){
    if (tiempoDentroCapaN >= tiempoLimite) {
      let i = floor(random(cant));
      let x = random(width);
      let y = random(height);
      let w = random(150, 250);
      let h = random(150, 250);
      manchasN.push(new ManchaN(manchaN[i], x, y, w, h));
      conteoN[i]++;
      tiempoDentroCapaN = 0;
    } else if (tiempoDentroCapaL >= tiempoLimite) {
        let i = floor(random(cant));
        let x = random(width);
        let y = random(height);
        let w = random(5, 50);
        let h = random(5, 50);
        manchasLineas.push(new Lineas(lineas[i], x, y, w, h));
        conteoLineas[i]++;
        tiempoDentroCapaL = 0;
      } else if (tiempoDentroCapaG >= tiempoLimite) {
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
  if( terminoElSonido ){
    //imagenFondo.image( imagenFrente , width/2 , height/2 );
    //imagenFrente.clear();

  // Hace que se borre el paso de la imagen
  CapamanchaN.clear();
  Capalineas.clear();
  CapamanchaG.clear();

     
  }

  if( haySonido ){
    if (haySonido) {
      tiempoDentroCapaN += tiempoTranscurrido;
      tiempoDentroCapaG = 0;
      tiempoDentroCapaL = 0;
    } else if (haySonido) {
      tiempoDentroCapaL += tiempoTranscurrido;
      tiempoDentroCapaG = 0;
      tiempoDentroCapaN = 0;
    } else if (haySonido) {
      tiempoDentroCapaG += tiempoTranscurrido;
      tiempoDentroCapaN = 0;
      tiempoDentroCapaL = 0;
    } else {
      tiempoDentroCapaN = 0;
      tiempoDentroCapaG = 0;
      tiempoDentroCapaL = 0;
    }
  }
  //image( imagenFondo , 0 , 0 );
  //image( imagenFrente , 0 , 0 );
  image(CapamanchaN, 0, 0);
  image(Capalineas, 0, 0);
  image(CapamanchaG, 0, 0); 

  if( monitorear ){
    gestorAmp.dibujar( 100 , 100 );
    gestorPitch.dibujar( 100 , 300 );
  }
 
  antesHabiaSonido = haySonido;
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}

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


/*
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

  if () {
  manchasN.forEach(m => {
    if (rotarN) {
      m.rotar();
    }
    m.dibujar(CapamanchaN);
  });
  }

  if () {
  manchasLineas.forEach(m => {
    if (rotarLineas) {
      m.rotar();
    }
    m.dibujar(Capalineas);
  });
  }
  if () {
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
}*/
