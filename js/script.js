// Optimizadores de codigo Swal (optimizaremos validadores y botones al no repetirlos en cada alerta)
const textSwal = Swal.mixin({
    input: 'text',
    inputValidator: (value) => {
        if (!value) {
            return 'Este campo no puede estar vacio!'
        } else if (!(isNaN(value))) {
            return 'Este campo tiene que ser un texto!'
        }
    },
    confirmButtonText: 'Siguiente',
    confirmButtonColor: '#275cce',
    allowOutsideClick: false
});
const numSwal = Swal.mixin({
    input: 'number',
    inputValidator: (value) => {
        if (!value) {
            return 'Este campo no puede estar vacio!'
        } else if (isNaN(Number(value))) {
            return 'Este campo tiene que ser un numero!'
        }
    },
    confirmButtonText: 'Siguiente',
    confirmButtonColor: '#275cce',
    allowOutsideClick: false
});
const summary = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});
/*  - Empezaremos con unas alertas automaticas que nos pediran lo siguiente:
    -   Nombre
    -   Dificultad
    -   Dinero total que ingresaremos
    - Mas adelante crearemos una funcion que se iniciara al pulsar el botton
    - donde nos pedira lo siguiente:
    -   Canidad para ingresar
    -   Numero para adividar
    -   Resultado
*/

let playerName; // Nombre del jugador
let levelDifficult; // Nivel de dificultad
let maxCup; // Guardaremos la cantidad lo que vale ese nivel
let maxBalance; // Maximo de saldo ingresado

(async() => {
    // Alerta de informacion al juego
    await Swal.fire({
        title: 'SHELL GAME',
        text: 'El objetivo del juego es que el jugador adivine en qué cubilete se encuentra la bolita',
        confirmButtonText: '¡Empezar!',
        confirmButtonColor: '#275cce',
        allowOutsideClick: false
    });

    // Insertar el nombre
    playerName = await textSwal.fire({
        title: 'Configuración',
        text: 'Introduzca su nombre:',
        inputPlaceholder: 'Nombre'
    });

    // Especificar una levelDifficult
    levelDifficult = await Swal.fire({
        title: 'Configuración',
        text: 'Selecione el nivel de levelDifficult:',
        input: 'select',
        inputPlaceholder: 'Selecciona la dificultad',
        inputOptions: {
            0: 'Facil (Las apuestas x2)',
            1: 'Medio (Las apuestas x5)',
            2: 'Dificil (Las apuestas x10)'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Este campo no puede estar vacio!'
            }
        },
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#275cce',
        allowOutsideClick: false
    });

    // Insertar el nombre
    maxBalance = await numSwal.fire({
        title: 'Configuración',
        text: 'Introduzca el total de dinero que quiere apostar:',
        inputPlaceholder: '1500',
        inputAttributes: {
            min: 1
        }
    });

    // Mostramos el nombre del usuario
    summary.fire({
        icon: 'info',
        title: 'Bienvenido ' + playerName.value
    });

    // Imprimiremos los cubiletes segun la levelDifficult selecionada
    switch (levelDifficult.value) {
        case '0': // Facil
            maxCup = Number(3);
            break;
        case '1': // Medio
            maxCup = Number(5);
            break;
        case '2': // Dificil
            maxCup = Number(7);
            break;
    }

    // Bucle para imprimir los cubiletes en pantalla
    for (let x = 1; x <= maxCup; x++) {
        document.getElementById('board').innerHTML += `<div class="beaker" id="${x}">${x}</div>`;
    }
    // Creamos la variable de un valor aleatorio
    cupWinner = Math.floor((Math.random() * ((maxCup) - 1)) + 1);
})();

let wageredBalance; // Saldo apostado
let cupChosen; // Encontrar donde esta la pelotita 
// Creamos la funcion que se executara al tocar el boton
async function reboot() {
    if (maxBalance.value > 0) {
        // Creamos la variable de un valor aleatorio
        cupWinner = Math.floor((Math.random() * ((maxCup) - 1)) + 1);
        // Imprimimos el saldo actual arriba a la derecha de la pantalla
        document.getElementById('currentBalance').innerHTML = `<div class="currentBalanceContent">Tu saldo: ${maxBalance.value} €</div>`;
        // Guardamos el dinero Insertado
        wageredBalance = await numSwal.fire({
            currentProgressStep: 0,
            progressSteps: ['1', '2', '3'],
            title: 'Empezar a apostar',
            text: 'Inserte la cantidad que quieres apostar:',
            inputPlaceholder: '50',
            inputAttributes: {
                min: 1,
            }
        });

        // Guardamos el cubilete que emos elegido
        cupChosen = await numSwal.fire({
            currentProgressStep: 1,
            progressSteps: ['1', '2', '3'],
            title: 'Empezar a apostar',
            text: 'En que cubilete crees que está la bola:',
            inputAttributes: {
                min: 1,
                max: maxCup,
                step: 1
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Este campo no puede estar vacio!'
                } else if (isNaN(Number(value))) {
                    return 'Este campo tiene que ser un numero!'
                } else if (!(value >= 1 && value <= maxCup)) {
                    return 'El valor debe ser entre el 1 y el ' + maxCup
                }
            }
        });

        // Mostramos un brebe summary de nuestros datos
        await Swal.fire({
            currentProgressStep: 2,
            progressSteps: ['1', '2', '3'],
            icon: 'info',
            title: 'Confirme la apuesta',
            html: '<p><strong>Nombre: </strong>' + playerName.value + '</p>' +
                '<p><strong>Cubilete elegido: </strong>' + cupChosen.value + '</p>' +
                '<p><strong>Dinero: </strong>' + wageredBalance.value + ' €</p>',
            showDenyButton: true,
            denyButtonText: `Cancelar`,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: '#275cce'
        }).then((result) => {
            if (result.isConfirmed) {
                let reward;
                let titleSwalReward;
                if (cupChosen.value == cupWinner) {
                    switch (levelDifficult.value) {
                        case '0': // Facil
                            reward = wageredBalance.value * 2;
                            break;
                        case '1': // Medio
                            reward = wageredBalance.value * 5;
                            break;
                        case '2': // Dificil
                            reward = wageredBalance.value * 10;
                            break;
                    }
                    maxBalance.value += reward
                    titleSwalReward = '¡Felicidades! Has ganado'
                    alertReward = '<h1 style="color:green">' + reward + ' €</h1>'
                } else {
                    reward = wageredBalance.value;
                    maxBalance.value -= reward;
                    titleSwalReward = '¡Has perdido!'
                    alertReward = '<h1 style="color:red"> -' + reward + ' €</h1>'
                }
                Swal.fire({
                    position: 'center',
                    title: titleSwalReward,
                    html: alertReward,
                    showConfirmButton: true,
                    timer: 10000
                });
                document.getElementById('currentBalance').innerHTML = `<div class="currentBalanceContent">Tu saldo: ${maxBalance.value} €</div>`;
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'No te queda más saldo, regrese otro día.',
            showConfirmButton: true,
            timer: 10000
        });
    }
}