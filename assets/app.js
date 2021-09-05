$(document).ready(() => {

// ----- Entidades -----

class Usuario {
    constructor(nombre, apellido, email){
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
    }
}

class Pedido {
    constructor(tipo, tamano, pais, ciudad, fecha, estilo, color, precio){
        this.tipo = tipo;
        this.tamano = tamano;
        this.pais = pais;
        this.ciudad = ciudad;
        this.fecha = fecha;
        this.estilo = estilo;
        this.color = color;
        this.precio = precio;
    }
}

// ----- Variables -----

let usuarios = [];
let pedidos = [];
let precio = 0;
var select = $('#pais');

// ----- Funciones -----

// Función para guardar los datos del usuario

function guardarUsuario() {
    let nombre = $("#nombre").val();
    let apellido = $("#apellido").val();
    let email = $("#email").val();
    let usuario = new Usuario(nombre, apellido, email);

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Función para imprimir el nombre del usuario

function imprimirUsuario() {
    let imprimirUsuario = JSON.parse(localStorage.getItem("usuarios"));

    if (imprimirUsuario != null) {

        imprimirUsuario.forEach(elemento => {

            $('#dataUsuario').append(
                `
                <div class="float-end usuario">
                    <img class="iconoUsuario" src="./assets/img/usuario.svg" alt="">
                    <p>${elemento.nombre} ${elemento.apellido}</p>
                </div>
                `
            )
        }
    )} else {
        console.log("El Array está vacío");
    }
}

// Función para guardar los datos del pedido a solicitar

function guardarPedido() {
    let tipo = $("#tipoIlustracion").val();
    let tamano = $("#tamano").val();
    let pais = $("#pais").val();
    let ciudad = $("#ciudad").val();
    let fecha = $("#fecha").val();
    let estilo = $('input[name="estilo"]:checked').val();
    let color = $('input[name="color"]:checked').val();

    if (tipo === "Artesanal") {
        precio = 6000;
        tamano = "A4";
        estilo = "Acuarela";
        color = "Multicolor";
        
    } else {
        if ((tamano === "A4") || (tamano === "20x30")) {
            precio = 4000;
            
        } else if (tamano === "30x40") {
            precio = 5000;

        } else {
            precio = 0;
            estilo = "No Definido";
            color = "No Definido";
        }
    }

    let pedido = new Pedido(tipo, tamano, pais, ciudad, fecha, estilo, color, precio);
    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

// Función para imprimir el pedido solicitado

function imprimirPedido() {

    let imprimirPedido = JSON.parse(localStorage.getItem("pedidos"));

    if (imprimirPedido != null) {

        imprimirPedido.forEach(elemento => {

            $("#impresionFinal").append(
                `
                <div class="border border-light shadow-sm p-3 mb-5 bg-white rounded w-100">
                    <h3 class="font-weight-bold">Pedido Final</h3>
                    <p>Tipo de Ilustración: ${elemento.tipo}</p>
                    <p>Tamaño de la Ilustración: ${elemento.tamano}</p>
                    <p>País del Evento: ${elemento.pais}</p>
                    <p>Ciudad del Evento: ${elemento.ciudad}</p>
                    <p>Fecha del Evento: ${elemento.fecha}</p>
                    <p>Estilo de la Ilustración: ${elemento.estilo}</p>
                    <p>Color de Fondo: ${elemento.color}</p>
                    <p class="font-weight-bold">Precio Final $: ${elemento.precio}</p>
                    <div class="estiloBoton">
                        <button class="btn boton" id="botonConfirmar">Confirmar Pedido</button>
                    </div>
                </div>
                `
            )
            
            $("#botonConfirmar").on("click", (e) => {
                e.preventDefault()
                const confirmar = document.querySelector("#impresionFinal");
                confirmar.innerHTML = ''
                const h3 = document.createElement('h3');
                h3.textContent = "Gracias por tu pedido, en la brevedad te llegará el detalle del mismo a tu email";
                h3.setAttribute("class", "parrafoFinal");
                confirmar.appendChild(h3);
            })
        })
    } else {
        console.log("El Array está vacío");
    }
}

// Función que deshabilita la selcción de tamaño al elegir una Ilustración Artesanal (ya que solo se hace en tamaño A4)

function tipoArtesanal() {
    let tipoIlus = $("#tipoIlustracion").val();

    if (tipoIlus === "Artesanal") {
        $("#tamano").prop("disabled", true)
        $("#tamano").val("A4")
        $("#refTamano").show()
        $("#estilos").hide()
        $("#colores").hide()

    } else {
        $("#tamano").prop("disabled", false)
        $("#refTamano").hide()
        $("#estilos").show()
        $("#colores").show()
    }
}

// Funciones para organizar los eventos que ocurren con los clicks de los botones Continuar y Finalizar

function desplegarTexto(e) {
    e.preventDefault()
    guardarUsuario();
    imprimirUsuario();
    $("#botonContinuar").hide();
    $("#datosMapa").show();
}

function finalizarPedido(e) {
    e.preventDefault()
    guardarPedido();
    imprimirPedido();
    $("#DatosPersonales").hide()
    $("#datosMapa").hide();
}

// Funciones para la selección del país en el selector. Uso de API

function seleccionarPais() {
    var url = `https://restcountries.eu/rest/v2/all`;
    $.ajax({
        method: "GET",
        url: url,
    }).done(function (data) {
        //console.log(data);
        renderPais(data);
    }).fail(function (error) {
        console.log(error)
    });
}

if(select.prop) {
  var options = select.prop('options');
}
else {
  var options = select.attr('options');
}
$('option', select).remove();

function renderPais(data) {
    $.each(data, (val, text) => {
        options[options.length] = new Option(text.name,text.name)
    })
}

// ----- Eventos -----

$("#datosMapa").hide();
$("#tipoIlustracion").change(tipoArtesanal);
$("#login").on('submit',desplegarTexto);
$("#mapa").on('submit', finalizarPedido);

// ----- Lógica -----

seleccionarPais()

})



