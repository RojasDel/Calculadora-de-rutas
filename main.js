// Inicialización del escenario y el canvas
const canvas = document.getElementById('escenarioCanvas');
const ctx = canvas.getContext('2d');

const anchoT = 10;  // Ancho en casillas
const altoT = 10;   // Alto en casillas
const anchoCasilla = 50;  // Ancho de cada casilla en píxeles
const altoCasilla = 50;   // Alto de cada casilla en píxeles

const escenario = new Escenario(anchoT, altoT);
escenario.inicializar(); // class Escenario en pathfinding

// Variables para principio y fin
let principio = escenario.casillas[0][0];
let fin = escenario.casillas[9][9];
principio.esPrincipio = true;
fin.esFin = true;

// Función para actualizar y redibujar el escenario
function actualizarEscenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    escenario.dibujar(ctx, anchoCasilla, altoCasilla);
    if (pathfinding) {
        pathfinding.dibujar(ctx, anchoCasilla, altoCasilla);
    }
}

// Configurar el botón para establecer el principio
document.getElementById('setPrincipio').addEventListener('click', () => {
    const x = parseInt(document.getElementById('principioX').value);
    const y = parseInt(document.getElementById('principioY').value);
    if (x >= 0 && x < anchoT && y >= 0 && y < altoT) {
        principio.esPrincipio = false; // Restablecer la casilla anterior
        principio = escenario.casillas[x][y];
        principio.esPrincipio = true;
        actualizarEscenario();
    }
});

// Configurar el botón para establecer el fin
document.getElementById('setFin').addEventListener('click', () => {
    const x = parseInt(document.getElementById('finX').value);
    const y = parseInt(document.getElementById('finY').value);
    if (x >= 0 && x < anchoT && y >= 0 && y < altoT) {
        fin.esFin = false; // Restablecer la casilla anterior
        fin = escenario.casillas[x][y];
        fin.esFin = true;
        actualizarEscenario();
    }
});

// Configurar el botón para agregar un obstáculo
document.getElementById('setObstaculo').addEventListener('click', () => {
    const x = parseInt(document.getElementById('obstaculoX').value);
    const y = parseInt(document.getElementById('obstaculoY').value);
    const tipo = parseInt(document.getElementById('tipoObstaculo').value);
    if (x >= 0 && x < anchoT && y >= 0 && y < altoT) {
        escenario.establecerTipo(x, y, tipo);
        actualizarEscenario();
    }
});

// Crear la instancia de Pathfinding
let pathfinding;

document.getElementById('inicio').addEventListener('click', () => {
    pathfinding = new Pathfinding(escenario, principio, fin);
    actualizarEscenario();
    bucle();
});

function bucle() {
    if (!pathfinding.terminado) {
        pathfinding.ejecutar();
    }
    pathfinding.dibujar(ctx, anchoCasilla, altoCasilla);
    requestAnimationFrame(bucle); // Método del navegador que le dice a éste que ejecute una función específica antes del próximo repintado de la pantalla
} //  Permite que el navegador optimice las actualizaciones de la animación para el rendimiento del dispositivo

// Inicializar y dibujar por primera vez
actualizarEscenario();
