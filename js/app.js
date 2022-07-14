// CONSTRUCTORES

function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

function UI() { } // Vacío

// PROTOTYPES

// Realizar la cotización del seguro
Seguro.prototype.cotizar = function () {
    const base = 2000;
    let valorFinal;

    /* El valorFinal se multiplica según la marca:
       - 1: Américano: 1.15
       - 2: Asiático: 1.05
       - 3: Europeo: 1.35
    */

    switch (this.marca) {
        case '1':
            valorFinal = base * 1.15;
            break;
        case '2':
            valorFinal = base * 1.05;
            break;
        case '3':
            valorFinal = base * 1.35;
            break;
        default:
            break;
    }

    // Mientras más viejo, menos vale el seguro. Un 3% menos cada año
    const diferenciaYear = new Date().getFullYear() - this.year;
    valorFinal -= ((diferenciaYear * 3) * valorFinal) / 100;

    /* Si el tipo es básico, el valor es 30% más
       Si el tipo es completo, el valor es 50% más */

    if (this.tipo === 'basico') {
        valorFinal *= 1.3;
    } else {
        valorFinal *= 1.5;
    }

    return valorFinal;
}

// Llenar las opciones de los años
UI.prototype.llenarOpciones = () => {
    const maxYear = new Date().getFullYear();
    const minYear = maxYear - 20;

    const selectYear = document.querySelector('#year');

    for (let i = maxYear; i >= minYear; i--) {
        const option = document.createElement('OPTION');
        option.textContent = i;
        option.value = i;
        selectYear.appendChild(option);
    }
}

// Mostrar alertas en pantalla
UI.prototype.mostrarAlerta = (mensaje, tipo, tiempo) => {
    // Crear elemento HTML
    const div = document.createElement('DIV');
    div.textContent = mensaje;
    div.classList.add('mensaje', 'mt-10')

    // Tipo del mensaje
    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    // Quitar alerta luego de cierto tiempo
    setTimeout(() => {
        div.remove();
    }, tiempo * 1000);
}

// Mostrar resultado final de la cotización
UI.prototype.mostrarResultado = (seguro, total, tiempo) => {
    // Destructuring del objeto seguro
    const { marca, year, tipo } = seguro;
    let textoMarca;

    // Convertir la marca a String
    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiático';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Crear elemento HTML
    const div = document.createElement('DIV');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p><span class="font-bold">Marca:</span> ${textoMarca}</p>
        <p><span class="font-bold">Año:</span> ${year}</p>
        <p><span class="font-bold">Tipo:</span> <span class="capitalize">${tipo}</span></p>
        <p><span class="font-bold">Total:</span> $${total}</p>
    `;

    // Mostrar spinner y que desaparezca luego de cierto tiempo
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';

        // Insertar resultado en el HTML
        const contenedor = document.querySelector('#resultado');
        contenedor.appendChild(div);
    }, tiempo * 1000);

}

// Desactivar botón de cotizar durante el tiempo que dura el spinner
UI.prototype.desactivarBoton = (tiempo) => {
    const btnCotizar = document.querySelector('#boton-cotizar')
    btnCotizar.classList.add('cursor-not-allowed', 'opacity-50')
    btnCotizar.disabled = true;

    // Volver a activar el botón luego de cierto tiempo
    setTimeout(() => {
        btnCotizar.classList.remove('cursor-not-allowed', 'opacity-50')
        btnCotizar.disabled = false;
    }, tiempo * 1000);
}

// INSTANCIAS GLOBALES

const ui = new UI();

// ARRANQUE DE LA APP

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
})

// LISTENERS

cargarListeners();
function cargarListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro)
}

// FUNCIONES

function cotizarSeguro(e) {
    e.preventDefault(); // Prevenir acción predeterminada

    // Validar los campos
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error', 3);
        return;
    }

    // Ocultar las cotizaciones previas
    const resultado = document.querySelector('#resultado');

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Instanciar el seguro y calcular la cotización
    const seguro = new Seguro(marca, year, tipo);
    const cotizacion = seguro.cotizar();

    // Mostrar la cotización en pantalla
    ui.mostrarAlerta('Cotizando...', 'correcto', 1.5);
    ui.mostrarResultado(seguro, cotizacion, 1.5);
    ui.desactivarBoton(1.5)
}