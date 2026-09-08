document.addEventListener('DOMContentLoaded', function() {

    var formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();


            limpiarError('err-nombre');
            limpiarError('err-email');
            limpiarError('err-telefono');
            limpiarError('err-mensaje');
            limpiarError('exito-mensaje');


            var nombre = document.getElementById('nombre').value.trim();
            var email = document.getElementById('email').value.trim();
            var telefono = document.getElementById('telefono').value.trim();
            var mensaje = document.getElementById('mensaje').value.trim();

            var esValido = true;

            if (nombre === '') {
                mostrarError('err-nombre', '⚠️ Ingrese su nombre completo.');
                esValido = false;
            } else if (/\d/.test(nombre)) {
                mostrarError('err-nombre', '⚠️ El nombre no puede contener números.');
                esValido = false;
            }

            if (email === '') {
                mostrarError('err-email', '⚠️ Ingrese su correo electrónico.');
                esValido = false;
            } else if (!email.includes('@') || !email.includes('.')) {
                mostrarError('err-email', '⚠️ Ingrese un correo válido (ejemplo@dominio.cl).');
                esValido = false;
            }


            var telLimpio = telefono.replace('+', '');
            if (telefono === '') {
                mostrarError('err-telefono', '⚠️ Ingrese un número telefónico.');
                esValido = false;
            } else if (isNaN(telLimpio)) {
                mostrarError('err-telefono', '⚠️ El teléfono solo debe contener dígitos numéricos.');
                esValido = false;
            } else if (telLimpio.length < 8) {
                mostrarError('err-telefono', '⚠️ El teléfono debe tener al menos 8 dígitos.');
                esValido = false;
            }


            if (mensaje === '') {
                mostrarError('err-mensaje', '⚠️ Escriba su consulta o mensaje.');
                esValido = false;
            } else if (mensaje.length < 10) {
                mostrarError('err-mensaje', '⚠️ El mensaje debe contener al menos 10 caracteres.');
                esValido = false;
            }


            if (esValido) {
                var nuevoContacto = {
                    id: Date.now(),
                    fecha: new Date().toLocaleDateString('es-CL'),
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    mensaje: mensaje
                };

                var contactos = JSON.parse(localStorage.getItem('contactos_guardados')) || [];
                contactos.push(nuevoContacto);
                localStorage.setItem('contactos_guardados', JSON.stringify(contactos));

                document.getElementById('exito-mensaje').textContent = '✓ Mensaje enviado y registrado exitosamente.';
                formContacto.reset();
            }
        });
    }

    var formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();

            var user = document.getElementById('user-input').value.trim();
            var pass = document.getElementById('pass-input').value.trim();
            var errLogin = document.getElementById('login-error');

            if (errLogin) errLogin.textContent = '';

            if (user === '' || pass === '') {
                if (errLogin) errLogin.textContent = '⚠️ Ingrese su usuario y contraseña.';
                return;
            }


            if (user === 'admin' && pass === '1234') {
                document.getElementById('seccion-publica').style.display = 'none';
                document.getElementById('panel-admin').style.display = 'block';
                renderizarTablasAdmin();
                formLogin.reset();
            } else {
                if (errLogin) errLogin.textContent = '⚠️ Credenciales incorrectas. Verifique usuario y clave.';
            }
        });
    }

    var btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            document.getElementById('panel-admin').style.display = 'none';
            document.getElementById('seccion-publica').style.display = 'block';
        });
    }

});


function mostrarError(id, mensaje) {
    var elem = document.getElementById(id);
    if (elem) {
        elem.textContent = mensaje;
        elem.style.color = '#dc3545';
    }
}

function limpiarError(id) {
    var elem = document.getElementById(id);
    if (elem) elem.textContent = '';
}


function renderizarTablasAdmin() {
    var contenedor = document.getElementById('contenedor-admin-tablas');
    if (!contenedor) return;

    var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    var mensajes = JSON.parse(localStorage.getItem('contactos_guardados')) || [];

    var html = '<h3>1. Cotizaciones y Arriendos Registrados</h3>';

    if (reservas.length === 0) {
        html += '<p style="color: #6c757d;">No existen reservas guardadas en el localStorage.</p>';
    } else {
        html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; text-align: left;">' +
            '<thead>' +
                '<tr style="background-color: #212529; color: white;">' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Fecha</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Instrumento</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Cantidad</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Horas</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Total (CLP)</th>' +
                '</tr>' +
            '</thead><tbody>';

        reservas.forEach(function(r) {
            html += '<tr style="border-bottom: 1px solid #dee2e6;">' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + r.fecha + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + r.instrumento + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + (r.cantidad || 1) + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + r.horas + ' hrs</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; color: #198754;">$' + (r.total ? r.total.toLocaleString('es-CL') : '0') + '</td>' +
            '</tr>';
        });

        html += '</tbody></table>';
    }

    html += '<h3>2. Mensajes de Contacto Recibidos</h3>';

    if (mensajes.length === 0) {
        html += '<p style="color: #6c757d;">No hay mensajes registrados en el formulario.</p>';
    } else {
        html += '<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">' +
            '<thead>' +
                '<tr style="background-color: #0d6efd; color: white;">' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Fecha</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Nombre</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Email</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Teléfono</th>' +
                    '<th style="padding: 10px; border: 1px solid #dee2e6;">Mensaje</th>' +
                '</tr>' +
            '</thead><tbody>';

        mensajes.forEach(function(m) {
            html += '<tr style="border-bottom: 1px solid #dee2e6;">' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + m.fecha + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + m.nombre + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + m.email + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + m.telefono + '</td>' +
                '<td style="padding: 8px; border: 1px solid #dee2e6;">' + m.mensaje + '</td>' +
            '</tr>';
        });

        html += '</tbody></table>';
    }

    contenedor.innerHTML = html;
}