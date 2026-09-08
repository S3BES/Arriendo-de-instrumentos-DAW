
var servicios = [
    { id: 1, nombre: 'Guitarra Eléctrica', precioHora: 3000, foto: 'Guitarra.webp', descripcion: 'Ideal para presentaciones escolares y talleres en vivo.' },
    { id: 2, nombre: 'Teclado', precioHora: 4000, foto: 'Teclado.webp', descripcion: 'Teclado versátil con soporte y pedal de sostén incluido.' },
    { id: 3, nombre: 'bateria electronica', precioHora: 6000, foto: 'Bateria3.jpg', descripcion: 'Excelente calidad de sonido con volumen regulable.' }
];

var SEGURO_DANO_POR_UNIDAD = 2000;
var MAX_HORAS_PERMITIDAS = 24; // Límite de horas continuas
var MAX_CANTIDAD_UNIDADES = 5; // Límite de instrumentos por ítem


function cargarServicios() {
    var contenedor = document.getElementById('contenedor-servicios');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    servicios.forEach(function(item) {
        var tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta';

        tarjeta.innerHTML = 
            '<img src="' + item.foto + '" alt="' + item.nombre + '">' +
            '<h3>' + item.nombre + '</h3>' +
            '<p><strong>Valor:</strong> $' + item.precioHora.toLocaleString('es-CL') + ' / hora</p>' +
            '<p>' + item.descripcion + '</p>' +
            '<div class="control-arriendo" style="display: grid; gap: 8px; margin-top: 10px;">' +
                '<div>' +
                    '<label for="cant-' + item.id + '">Cantidad: </label>' +
                    '<input type="number" id="cant-' + item.id + '" value="1" min="1" max="' + MAX_CANTIDAD_UNIDADES + '" style="width: 50px; text-align: center;"> ' +
                '</div>' +
                '<div>' +
                    '<label for="horas-' + item.id + '">Horas: </label>' +
                    '<input type="number" id="horas-' + item.id + '" value="1" min="1" max="' + MAX_HORAS_PERMITIDAS + '" style="width: 50px; text-align: center;"> ' +
                '</div>' +
                '<button type="button" class="btn-calcular" id="btn-calc-' + item.id + '" style="margin-top: 5px; padding: 8px; background: #198754; color: white; border: none; border-radius: 4px; cursor: pointer;">+ Agregar a Reserva</button>' +
            '</div>';

        contenedor.appendChild(tarjeta);


        var btnCalcular = tarjeta.querySelector('#btn-calc-' + item.id);
        btnCalcular.addEventListener('click', function() {
            agregarReserva(item.id);
        });
    });
}

function agregarReserva(idServicio) {
    var servicio = servicios.find(function(s) { return s.id === idServicio; });
    var inputCant = document.getElementById('cant-' + idServicio);
    var inputHoras = document.getElementById('horas-' + idServicio);
    var divResultado = document.getElementById('resultado-presupuesto');

    if (!servicio || !inputCant || !inputHoras || !divResultado) return;

    var cantidad = parseInt(inputCant.value);
    var horas = parseInt(inputHoras.value);

    if (isNaN(cantidad) || cantidad <= 0 || cantidad > MAX_CANTIDAD_UNIDADES) {
        divResultado.innerHTML = '<div style="background-color: #f8d7da; color: #842029; padding: 12px; border-radius: 6px; border: 1px solid #f5c2c7;">' +
            '⚠️ <strong>Error:</strong> La cantidad de unidades debe ser entre 1 y ' + MAX_CANTIDAD_UNIDADES + '.' +
        '</div>';
        return;
    }

    if (isNaN(horas) || horas <= 0) {
        divResultado.innerHTML = '<div style="background-color: #f8d7da; color: #842029; padding: 12px; border-radius: 6px; border: 1px solid #f5c2c7;">' +
            '⚠️ <strong>Error:</strong> Ingrese una cantidad de horas válida (mínimo 1).' +
        '</div>';
        return;
    }


    if (horas > MAX_HORAS_PERMITIDAS) {
        divResultado.innerHTML = '<div style="background-color: #f8d7da; color: #842029; padding: 12px; border-radius: 6px; border: 1px solid #f5c2c7;">' +
            '⚠️ <strong>Límite excedido:</strong> El tiempo máximo de arriendo continuo es de ' + MAX_HORAS_PERMITIDAS + ' horas por evento.' +
        '</div>';
        return;
    }


    var costoHoras = (servicio.precioHora * horas) * cantidad;
    var seguroTotal = SEGURO_DANO_POR_UNIDAD * cantidad;
    var total = costoHoras + seguroTotal;


    var nuevaReserva = {
        idReserva: Date.now(),
        fecha: new Date().toLocaleDateString('es-CL'),
        instrumento: servicio.nombre,
        cantidad: cantidad,
        horas: horas,
        total: total
    };


    var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));


    divResultado.innerHTML = '<div style="background-color: #d1e7dd; color: #0f5132; padding: 12px; border-radius: 6px; border: 1px solid #badbcc;">' +
        '✓ <strong>¡Agregado con éxito!</strong> Se incluyeron ' + cantidad + ' unidad(es) de ' + servicio.nombre + ' por ' + horas + ' hrs. Total: $' + total.toLocaleString('es-CL') + ' CLP.' +
    '</div>';


    mostrarReservasActivas();
}


function mostrarReservasActivas() {
    var contenedor = document.getElementById('contenedor-mis-reservas');
    var btnVaciar = document.getElementById('btn-vaciar-todo');
    if (!contenedor) return;

    var reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    if (reservas.length === 0) {
        contenedor.innerHTML = '<p style="color: #6c757d; margin: 0;">No tienes reservas registradas en este momento.</p>';
        if (btnVaciar) btnVaciar.style.display = 'none';
        return;
    }

    if (btnVaciar) btnVaciar.style.display = 'inline-block';

    var totalAcumulado = 0;
    var html = '<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">' +
        '<thead>' +
            '<tr style="background-color: #f1f1f1; border-bottom: 2px solid #ccc;">' +
                '<th style="padding: 8px;">Instrumento</th>' +
                '<th style="padding: 8px;">Cant.</th>' +
                '<th style="padding: 8px;">Horas</th>' +
                '<th style="padding: 8px;">Total</th>' +
                '<th style="padding: 8px; text-align: center;">Acción</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>';

    reservas.forEach(function(item) {
        totalAcumulado += item.total;
        html += '<tr style="border-bottom: 1px solid #eee;">' +
            '<td style="padding: 8px;">' + item.instrumento + '</td>' +
            '<td style="padding: 8px;">' + item.cantidad + '</td>' +
            '<td style="padding: 8px;">' + item.horas + ' hrs</td>' +
            '<td style="padding: 8px; font-weight: bold; color: #0f5132;">$' + item.total.toLocaleString('es-CL') + '</td>' +
            '<td style="padding: 8px; text-align: center;">' +
                '<button type="button" class="btn-eliminar-item" data-id="' + item.idReserva + '" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Eliminar</button>' +
            '</td>' +
        '</tr>';
    });

    html += '</tbody></table>' +
        '<div style="margin-top: 15px; text-align: right; font-size: 16px;">' +
            '<strong>Monto Total Acumulado:</strong> <span style="color: #0d6efd; font-size: 18px;">$' + totalAcumulado.toLocaleString('es-CL') + ' CLP</span>' +
        '</div>';

    contenedor.innerHTML = html;


    var botonesEliminar = contenedor.querySelectorAll('.btn-eliminar-item');
    botonesEliminar.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var idParaEliminar = parseInt(btn.getAttribute('data-id'));
            eliminarReservaIndividual(idParaEliminar);
        });
    });
}


function eliminarReservaIndividual(idReserva) {
    var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    var reservasFiltradas = reservas.filter(function(item) {
        return item.idReserva !== idReserva;
    });

    localStorage.setItem('reservas', JSON.stringify(reservasFiltradas));
    
    var divResultado = document.getElementById('resultado-presupuesto');
    if (divResultado) {
        divResultado.innerHTML = '<div style="background-color: #fff3cd; color: #664d03; padding: 10px; border-radius: 6px;">' +
            '🗑️ Reserva eliminada del sistema.' +
        '</div>';
    }

    mostrarReservasActivas();
}

function vaciarTodasLasReservas() {
    localStorage.removeItem('reservas');
    var divResultado = document.getElementById('resultado-presupuesto');
    if (divResultado) {
        divResultado.innerHTML = '<div style="background-color: #fff3cd; color: #664d03; padding: 10px; border-radius: 6px;">' +
            '🗑️ Se han eliminado todas las reservas registradas.' +
        '</div>';
    }
    mostrarReservasActivas();
}


document.addEventListener('DOMContentLoaded', function() {
    cargarServicios();
    mostrarReservasActivas();

    var btnVaciar = document.getElementById('btn-vaciar-todo');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarTodasLasReservas);
    }
});
