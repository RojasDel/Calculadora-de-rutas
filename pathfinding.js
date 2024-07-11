class Casilla {
    constructor(x, y, tipo) { // Datos encapsulados de Refactorizacion
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.vecinos = [];
        this.padre = null;
        this.esPrincipio = false;
        this.esFin = false;
    }

    agregarVecinos(escenario) { // Métodos encapsulados de Refactorizacion
        if (this.x > 0) this.vecinos.push(escenario[this.x - 1][this.y]);
        if (this.x < escenario.length - 1) this.vecinos.push(escenario[this.x + 1][this.y]);
        if (this.y > 0) this.vecinos.push(escenario[this.x][this.y - 1]);
        if (this.y < escenario[0].length - 1) this.vecinos.push(escenario[this.x][this.y + 1]);
    }

    dibujar(ctx, anchoCasilla, altoCasilla) {
        if (this.esPrincipio) {
            ctx.fillStyle = '#00FF00'; // Verde para principio
        } else if (this.esFin) {
            ctx.fillStyle = '#FF0000'; // Rojo para fin
        } else {
            ctx.fillStyle = this.tipo === 0 ? '#777777' :
                            this.tipo === 1 ? '#FF00FF' :
                            this.tipo === 2 ? '#2986cc' : '#145a32';
        }
        ctx.fillRect(this.x * anchoCasilla, this.y * altoCasilla, anchoCasilla, altoCasilla);
        ctx.strokeRect(this.x * anchoCasilla, this.y * altoCasilla, anchoCasilla, altoCasilla);
    }
}

class Escenario {
    constructor(anchoT, altoT) {
        this.anchoT = anchoT;
        this.altoT = altoT;
        this.casillas = Array.from({ length: anchoT }, (_, x) =>
            Array.from({ length: altoT }, (_, y) => new Casilla(x, y, 0))
        );
    }

    inicializar() { // Proporciona interfaz simple para interactuar con las casillas sin exponer la logica principal: abstracción de refactorización
        for (let x = 0; x < this.anchoT; x++) {
            for (let y = 0; y < this.altoT; y++) {
                this.casillas[x][y].agregarVecinos(this.casillas);
            }
        }
    }

    dibujar(ctx, anchoCasilla, altoCasilla) { // Abstracción de refactorización
        for (let x = 0; x < this.anchoT; x++) {
            for (let y = 0; y < this.altoT; y++) {
                this.casillas[x][y].dibujar(ctx, anchoCasilla, altoCasilla);
            }
        }
    }

    establecerTipo(x, y, tipo) { // Abstracción de refactorización
        if (x >= 0 && x < this.anchoT && y >= 0 && y < this.altoT) {
            this.casillas[x][y].tipo = tipo;
        }
    }
}

class Pathfinding {
    constructor(cuadricula, principio, fin) { //Crea y organiza las casillas en una cuadricula con Abstracción
        this.cuadricula = cuadricula;
        this.principio = principio;
        this.fin = fin;
        this.openSet = [principio];
        this.closedSet = [];
        this.camino = [];
        this.terminado = false;
    }

    heuristica(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    ejecutar() {
        if (this.openSet.length === 0) {
            console.log('No hay un camino posible');
            this.terminado = true;
            return;
        }

        let ganador = 0;
        for (let i = 0; i < this.openSet.length; i++) {
            if (this.openSet[i].f < this.openSet[ganador].f) {
                ganador = i;
            }
        }

        let actual = this.openSet[ganador];

        if (actual === this.fin) {
            console.log('Camino encontrado');
            let temp = actual;
            this.camino = [];
            while (temp.padre) {
                this.camino.push(temp);
                temp = temp.padre;
            }
            this.camino.push(this.principio);
            this.terminado = true;
        } else {
            this.openSet.splice(ganador, 1);
            this.closedSet.push(actual);

            let vecinos = actual.vecinos;
            for (let i = 0; i < vecinos.length; i++) {
                let vecino = vecinos[i];

                if (!this.closedSet.includes(vecino) && vecino.tipo !== 1 && vecino.tipo !== 2 && vecino.tipo !== 3) {
                    let tempG = actual.g + 1;
                    if (this.openSet.includes(vecino)) {
                        if (tempG < vecino.g) vecino.g = tempG;
                    } else {
                        vecino.g = tempG;
                        this.openSet.push(vecino);
                    }

                    vecino.h = this.heuristica(vecino, this.fin);
                    vecino.f = vecino.g + vecino.h;
                    vecino.padre = actual;
                }
            }
        }
    }

    dibujar(ctx, anchoCasilla, altoCasilla) {
        this.cuadricula.dibujar(ctx, anchoCasilla, altoCasilla);
        for (let i = 0; i < this.camino.length; i++) {
            let casilla = this.camino[i];
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(casilla.x * anchoCasilla, casilla.y * altoCasilla, anchoCasilla, altoCasilla);
        }
    }
}
