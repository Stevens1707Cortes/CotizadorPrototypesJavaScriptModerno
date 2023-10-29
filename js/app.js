
// Constructores 

function Seguro(marca, year, cobertura) {
    this.marca = marca;
    this.year = year;
    this.cobertura = cobertura;
}

function UI() {} // Tambien se puede dejar constructor vacios

// Realiza la cotizacion con los datos

Seguro.prototype.cotizarDatosSeguro = function () {

    /* Algoritmo:
        1 - Americano = 1.15 incremento
        2 - Asiatico = 1.05 incremento
        3 - Europeo = 1.35 incremento

        Si es mas nuevo, va tener un mayor valor. Por cada año de antiguedad que tenga el auto, va ser un 3% mas barato.

        Si el seguro es basico, el seguro se multiplica por un 30% de mas, si es completo por 50%
    */

    let cantidad;
    const base = 150000;

    // Evaluando la marca

    switch (this.marca) { // Usamos switch(){} para evaluar multiples condiciones
        case '1':
            cantidad = base * 1.15;
            // console.log('Americano', cantidad);
            // this.marca = 'Americano';
            break;

        case '2':
            cantidad = base * 1.05;
            // console.log('Asiatico', cantidad);
            // this.marca = 'Asiatico';
            break;

        case '3':
            cantidad = base * 1.35;
            // console.log('Europeo', cantidad);
            // this.marca = 'Europeo';
            break;

        default:
            break;
    }

    // Evaluando el año

    const diferenciaYear = new Date().getFullYear() - this.year;

    // Cada año que la diferencia es mayor, el costo se reduce un 3%

    cantidad -= (diferenciaYear * 3) * cantidad / 100; // Seria igual cantidad = cantidad - (diferenciaYear * 3) * cantidad / 100

    // Evaluando la cobertura

    if (this.cobertura === 'basico') {
        // cantidad += (30 * cantidad) / 100;
        cantidad *= 1.30;
    }else{
        // cantidad += (50 * cantidad) / 100;
        cantidad *= 1.50;
    }

    return cantidad;
}


// Llena las opciones de los años

UI.prototype.llenarYear = function () {
    const maxYear = new Date().getFullYear();
    const minYear = maxYear - 20;
    const yearSelect = document.querySelector('#year');

    for (let i = maxYear; i > minYear; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        // Insertar al HTML
        yearSelect.appendChild(option);
    }

}

// Mostrar estado de validacion / Resultado

UI.prototype.mostrarMensaje = function (mensaje, tipo) {
    //Limpiar AlertaHTML
    limparAlerta();

    const formulario = document.querySelector('#cotizar-seguro');
    // const resultado = document.querySelector('#resultado');
    const spinner = document.querySelector('#cargando');
    const contenedorMensaje = document.createElement('div');


    contenedorMensaje.classList.add('mensaje', 'mt-10');
    contenedorMensaje.textContent = mensaje;

    if (tipo === 'error') {
        // Crear el HTML alerta
        contenedorMensaje.classList.add('error');
    }else{
        contenedorMensaje.classList.add('correcto');

    }
    
    //Insertar HTML
    formulario.insertBefore(contenedorMensaje, spinner); // (nuevo nodo, nodo de referencia)
    
    //Tiempo en pantalla
    setTimeout(() => {
        contenedorMensaje.remove();
    }, 3000);

}

UI.prototype.mostrarResultado = function (seguro, total) {

    limpiarResultadoHTML();

    const {marca, year, cobertura} = seguro;

    // Texto marca

    let textoMarca;
    
    switch (marca) { 
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Elementos

    const spinner = document.querySelector('#cargando');
    const resultado = document.querySelector('#resultado');

    const contenedorResultado = document.createElement('div');
    const encabezadoResultado = document.createElement('p');
    const marcaResultado = document.createElement('p');
    const yearResultado = document.createElement('p');
    const coberturaResultado = document.createElement('p');
    const totalResultado = document.createElement('p');

    contenedorResultado.classList.add('mt-10');
    encabezadoResultado.classList.add('header');
    encabezadoResultado.textContent = 'TU RESUMEN';
    marcaResultado.textContent = `Marca: ${textoMarca}`;
    yearResultado.textContent = `Año: ${year}`;
    coberturaResultado.textContent = `Tipo: ${cobertura}`;
    totalResultado.textContent = `Total: $ ${total}`;
   
    // Spinner

    spinner.classList.add('flex');
    spinner.classList.remove('hidden');

    //Insertar HTML

    contenedorResultado.appendChild(encabezadoResultado);
    contenedorResultado.appendChild(marcaResultado);
    contenedorResultado.appendChild(yearResultado);
    contenedorResultado.appendChild(coberturaResultado);
    contenedorResultado.appendChild(totalResultado);

    setTimeout(() => {
        spinner.classList.remove('flex');
        spinner.classList.add('hidden');
        resultado.appendChild(contenedorResultado);
    }, 3000);

}


//Instanciar UI

const ui= new UI();


// EventListeners

cargarEventListeners();
function cargarEventListeners() {

    //Al cargar todo el documento
    document.addEventListener('DOMContentLoaded', ()=>{
        // Llenar opciones año
        ui.llenarYear();
    })

    // Event Listeners - LOS SELECTORES NO SON RECOMENDABLES AGREGARLOS A UN PROTOTYPE
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
    
}

//Funciones
function cotizarSeguro(e) {
    e.preventDefault();

    // Leer marca seleccionado
    const selectMarca = document.querySelector('#marca').value; //El valor de marca

    // Leer año seleccionado
    const selectYear = document.querySelector('#year').value;

    // Leer cobertura seleccionada
    const selectCobertura = document.querySelector('input[name="tipo"]:checked').value; // Estamos leyendo los datos de los radio buttons, cuyo estado este checked

    if (selectMarca === '' || selectYear === '' || selectCobertura === '') {
        ui.mostrarMensaje('Error en la validacion. No pueden existir campos vacios', 'error');
        return;
    }

    console.log(selectCobertura);

    ui.mostrarMensaje('Validacion correcta', 'exito');

    // Instanciar objeto Seguro con propiedades
    const seguro = new Seguro(selectMarca, selectYear, selectCobertura);
    const total = seguro.cotizarDatosSeguro();

    // Usar el prototype que va a cotizar

    ui.mostrarResultado(seguro, total);



}

function limparAlerta() {
    const alerta = document.querySelector('#cotizar-seguro .mensaje');
    if (alerta) {
        alerta.remove();
    }
}

function limpiarResultadoHTML() {
    const mensajeResultado = document.querySelector('#resultado div');
    if (mensajeResultado) {
        mensajeResultado.remove();
    }
}
