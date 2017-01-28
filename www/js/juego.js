var app={
  inicio: function(){
    DIAMETRO_AST = 50;
    dificultad = 0;
    velocidadX = 0;
    puntuacion = 0;

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload(){
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#000066';
      game.load.image('rocket', 'assets/rocket.png')
      game.load.image('asteroid','assets/asteroide.png')
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '25px', fill: '#FFFFFF' });

      rocket = game.add.sprite(app.inicioX(),600,'rocket');
      asteroid =game.add.sprite(app.inicioX(),16,'asteroid');

      game.physics.arcade.enable(rocket);
      game.physics.arcade.enable(asteroid);

      rocket.body.collideWorldBounds = true;
      asteroid.body.collideWorldBounds = true;
      asteroid.body.onWorldBounds = new Phaser.Signal();
      asteroid.body.onWorldBounds.add(app.incrementaPuntuacion,this);
    }

    function update(){
      var factorDificultad = 300 + (dificultad*50);

      asteroid.body.velocity.y = factorDificultad;
      rocket.body.velocity.x = (velocidadX * (-300));

      game.physics.arcade.overlap(rocket,asteroid,app.pierde,null,this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);

  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion + 1;
    scoreText.text = puntuacion;

    asteroid.body.x= app.inicioX();
    asteroid.body.y = 16;

    dificultad = dificultad + 1; 
  },

  pierde: function(){
    asteroid.body.velocity.y = 0;
    rocket.body.velocity.x = 0;
    scoreText.text = "Chocaste :(. Puntuación = " + puntuacion;

    setTimeout(app.recomienza, 1000);
  },

  inicioX: function() {
    return app.numeroAleatorioHasta(ancho - DIAMETRO_AST);
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random()*limite);
  },

  vigilaSensores: function(){

    function onError(){
      console.log('OnError!');
    }

    function onSuccess(datosAceleracion){
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess,onError, { frequency: 10});
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x;
  },

    recomienza: function(){
    document.location.reload(true);
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}