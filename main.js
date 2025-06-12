console.log("Hola");

class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];  
        this.puntuacion = 0;
        this.puntosElement = document.getElementById("puntos");
        this.crearEscenario();
        this.agregarEventos();
        this.sonidoGolpe = new Audio("./audio/stab-f-01-brvhrtz-224599.mp3");
    }

    crearEscenario() {
        this.personaje = new Personaje(); 
        this.container.appendChild(this.personaje.element); 
        for (let i = 0; i < 5; i++) {
            const moneda = new Moneda();
            moneda.actualizarPosicion(); 
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e)); // ✅ corregido
        this.checkColisiones();   
    }

    checkColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuación(10);
                    this.sonidoGolpe.currentTime = 0;
                    this.sonidoGolpe.play();


                }
            })
        }, 100);// Revisa colisiones cada 100 milisegundos
    }

   
    actualizarPuntuación(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`; // ✅ corregido
    }
}

class Personaje {
    constructor() {
        this.x = 25;
        this.y = 355;
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");

        this.actualizarPosicion(); 
       
    }

    mover(evento) {
    if (evento.key === "ArrowRight" && this.x + this.width < 800) {// 
      this.x += this.velocidad;
    } else if (evento.key === "ArrowLeft" && this.x > 0) {
      this.x -= this.velocidad; 
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar();
    }
    this.actualizarPosicion();
  }


    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 250;
        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
            } else {
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        }, 20);
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 355) { 
                this.y += 10;
            } else {
                clearInterval(gravedad);
            }
            this.saltando = false;  // puede volver a saltar
            this.actualizarPosicion();
        }, 20);
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    colisionaCon(objeto) {
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
        );
    }
}

class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

const juego = new Game();

// Getionar los div que desaparezca container-portada y aparezca game-container
const btn = document.getElementById("ocultarContainer");
const portada = document.getElementById("container_portada");
const gameContainer = document.getElementById("game-container");
const gameMusic = document.getElementById("sonidoJuego");

btn.addEventListener("click", () => {
  portada.style.display = "none";                 // Oculta la portada
  gameContainer.classList.remove("oculto"); 
  gameMusic.play();      // Muestra el juego
});


//Gestión del audio
const gameSound = document.getElementById("sonidoJuego");
const volumnGame = document.getElementById("volumnControl");
const btnPause = document.getElementById("pause");

volumnGame.addEventListener('input', () => {
   gameSound.volume = volumnGame.value;
});

// Control de pausa/play
btnPause.addEventListener('click', () => {
    if (gameSound.paused) {
        gameSound.play();
        // btnPause.value = "||"; // Cambia el texto del botón
    } else {
        gameSound.pause();
        // btnPause.value = " "; // Cambia el texto del botón
    }
});




