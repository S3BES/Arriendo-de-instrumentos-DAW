function cargarNosotros() {
    const contenedor = document.getElementById('contenedor-nosotros');
    if (!contenedor) return;

    const integrantes = [
        {
            nombre: 'Juan Pérez',
            cargo: 'Encargado del Taller de Música y Sonido',
            instrumentoFavorito: 'Guitarra Eléctrica',
            foto: 'Encargado de stand.jpg'
        },
        {
            nombre: 'Elena Martínez',
            cargo: 'Coordinadora de Servicios Musicales',
            instrumentoFavorito: 'Piano / Teclado',
            foto: 'Coordinadora con piano.jpg'
        },
        {
            nombre: 'Carlos López',
            cargo: 'Experto en Arriendo de Instrumentos',
            instrumentoFavorito: 'Teclado Synthesizer',
            foto: 'Teclado-persona.webp'
        },
        {
            nombre: 'María González',
            cargo: 'Especialista en Logística de Eventos',
            instrumentoFavorito: 'Batería y Percusión',
            foto: 'Bateria-Mujer.webp'
        },
        {
            nombre: 'Felipe Ramírez',
            cargo: 'Productor Musical de Eventos',
            instrumentoFavorito: 'Teclado y Dirección',
            foto: 'Teclado2.jpg'
        },
        {
            nombre: 'Junior Torres',
            cargo: 'Director de Orquesta',
            instrumentoFavorito: 'Teclado y Dirección Musical',
            foto: 'Teclado3.webp'
        }
    ];

    contenedor.innerHTML = integrantes.map(persona => `
        <article class="tarjeta">
            <img src="${persona.foto}" alt="${persona.nombre}">
            <h3>${persona.nombre}</h3>
            <p><strong>Cargo:</strong> ${persona.cargo}</p>
            <p><strong>Instrumento favorito:</strong> ${persona.instrumentoFavorito}</p>
        </article>
    `).join('');
}

document.addEventListener('DOMContentLoaded', cargarNosotros);
