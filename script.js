document.addEventListener('DOMContentLoaded', () => {
    actualizarBarraEstado();
});


function actualizarBarraEstado() {
    const barra = document.getElementById('barra-estado');
    if (!barra) return;
    
    const usuario = localStorage.getItem('usuario_admin');
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    
    if (usuario) {
        barra.textContent = `Sesión activa: ${usuario} | Reservas registradas: ${reservas.length}`;
        barra.style.backgroundColor = '#d1e7dd';
        barra.style.color = '#0f5132';
        barra.style.padding = '5px 10px';
        barra.style.fontSize = '14px';
    } else {
        barra.textContent = `Reservas activas en sistema: ${reservas.length}`;
        barra.style.backgroundColor = '#f8f9fa';
        barra.style.color = '#212529';
        barra.style.padding = '5px 10px';
        barra.style.fontSize = '14px';
    }
}